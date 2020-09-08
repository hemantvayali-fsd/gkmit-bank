const debug = require('debug')('app');
const moment = require('moment');
const { encryptPassword, comparePassword } = require('../utility');
const createExcel = require('../utility/createExcel');
// const sendMail = require('../services/mailService');
// model imports
const Employee = require('../models/employee');
const Transaction = require('../models/transaction');
const User = require('../models/user');

// GET => /admin
exports.getAdminDashboardHandler = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const skip = (page - 1) * limit;
  try {
    const count = await User.estimatedDocumentCount();
    const userList = await User.find({}, {
      balance: 0, password: 0, createdAt: 0, updatedAt: 0
    })
      .sort({ fullName: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const numPages = Math.ceil(count / limit);
    return res.render('admin/index', {
      title: 'Employee Dashboard', path: '/', userList, numPages
    });
  } catch (error) {
    debug(error);
    return res.status(500).send('Internal Server Error');
  }
  // res.render('admin/index', { title: 'Employee Dashboard', path: '/' });
};

// GET => /admin/signup
exports.getSignupHandler = (req, res) => {
  const errorMessage = req.flash('error');
  res.render('admin/signup', { title: 'Register Employee', errorMessage });
};

// POST => /admin/signup
exports.postSignupHandler = async (req, res) => {
  const {
    firstName, lastName, email, contactNumber, password, confirmPassword, role
  } = req.body;
  // validate password match
  if (password !== confirmPassword) {
    req.flash('error', "Passwords don't match");
    return res.redirect('/admin/signup');
  }
  try {
    // encrypt password
    const encryptedPassword = await encryptPassword(password);
    // save user with updated password
    const user = await Employee.create({
      firstName, lastName, email, contactNumber, role, password: encryptedPassword
    });
    delete user.password;
    return res.redirect('/admin/login');
  } catch (error) {
    debug(error);
    req.flash('error', error.message);
    return res.redirect('/admin/signup');
  }
};

// GET => /admin/login
exports.getLoginHandler = (req, res) => {
  const errorMessage = req.flash('error');
  res.render('admin/login', { title: 'Employee Login', errorMessage });
};

// POST => /admin/login
exports.postLoginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findByEmail(email);
    if (!user) throw new Error('User not found');
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid password');
    req.session.isAuthenticated = true;
    req.session.userId = user.id.toString();
    return res.redirect('/admin');
  } catch (error) {
    debug(error);
    if (
      error.message === 'User not found'
      || error.message === 'Invalid password'
    ) {
      req.flash('error', 'Invalid email or password');
    }
    return res.redirect('/admin/login');
  }
};

// POST => /admin/logout
exports.postLogoutHandler = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/admin/login');
  });
};

// GET => /admin/users-list
exports.getUsersList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const skip = (page - 1) * limit;
  try {
    const count = await User.estimatedDocumentCount();
    const userList = await User.find({}, {
      balance: 0, password: 0, createdAt: 0, updatedAt: 0
    })
      .sort({ fullName: 1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const numPages = Math.ceil(count / limit);
    return res.render('admin/users-list', {
      title: 'Users List', path: '/users', userList, numPages
    });
  } catch (error) {
    debug(error);
    return res.status(500).send('Internal Server Error');
  }
};

// Get => /admin/users/:userId
exports.getUserProfileHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId, {
      balance: 0
    });
    if (!user) throw new Error('User not found');
    return res.render('admin/user-profile', { title: user.fullName, path: '/users', user });
  } catch (error) {
    debug(error);
    return res.status(500).send(`<h1>${error.message}</h1>`);
  }
};

// GET (API) => /admin/users/:userId/transactions
exports.getUserTransactionsHandler = async (req, res) => {
  const { userId } = req.params;
  const {
    fromDate, toDate, limit, skip
  } = req.query;

  const newLimit = limit || 10;
  const newSkip = skip || 0;

  // create filter
  const filter = { user: userId };
  const toDateNew = moment(toDate).add(1, 'days').format('YYYY-MM-DD');
  if (fromDate && toDateNew) {
    filter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDateNew) };
  } else {
    if (fromDate) {
      filter.createdAt = { $gte: new Date(fromDate) };
    }
    if (toDateNew) {
      filter.createdAt = { $lte: new Date(toDateNew) };
    }
  }

  try {
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(newSkip)
      .limit(newLimit)
      .exec();
    return res.status(200).json({ transactions });
  } catch (error) {
    debug(error);
    return res.status(500).send(error.message);
  }
};

// GET => /admin/users/:userId/transactions/download
exports.downloadTransactionSheetHandler = async (req, res) => {
  const { userId } = req.params;
  const {
    fromDate, toDate
  } = req.query;

  // create filter
  const filter = { user: userId };
  const toDateNew = moment(toDate).add(1, 'days').format('YYYY-MM-DD');
  if (fromDate && toDate) {
    filter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDateNew) };
  } else {
    if (fromDate) {
      filter.createdAt = { $gte: new Date(fromDate) };
    }
    if (toDate) {
      filter.createdAt = { $lte: new Date(toDateNew) };
    }
  }
  debug(filter);
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .exec();
    const excelStream = createExcel(transactions);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${'tutorial'}.xlsx`
    );
    return excelStream.write(res).then(() => {
      res.status(200).end();
    });
  } catch (error) {
    debug(error);
    return res.status(500).send(error.message);
  }
};
