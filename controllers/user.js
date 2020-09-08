const debug = require('debug')('app');
const bcrypt = require('bcrypt');
const sendMail = require('../services/mailService');
// model imports
const User = require('../models/user');
const Transaction = require('../models/transaction');

// route handler for / => GET
exports.getDashboardHandler = (req, res) => {
  res.render('user/index', {
    title: 'User Dashboard',
    user: req.user,
    path: '/'
  });
};

// route handler for /login => GET
exports.getLoginHandler = (req, res) => {
  res.render('user/login', {
    title: 'Login',
    errorMessage: req.flash('error')
  });
};

// route handler for /login => POST
exports.postLoginHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid password');
    req.session.isAuthenticated = true;
    req.session.userId = user.id.toString();
    return res.redirect('/');
  } catch (error) {
    debug(error);
    if (
      error.message === 'User not found'
      || error.message === 'Invalid password'
    ) {
      req.flash('error', 'Invalid email or password');
    }
    return res.redirect('/login');
  }
};

// route handler for /logout => POST
exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid', { path: '/' });
    res.redirect('/login');
  });
};

// route handler for /passbook => GET
exports.getPassbookHandler = async (req, res, next) => {
  const { userId } = req.session;
  try {
    const transactionList = await Transaction.getLastTenTransactions(userId);
    const data = {
      title: 'My Passbook',
      headerTitle: 'Passbook',
      path: '/passbook',
      transactionList
    };
    return res.render('user/passbook', data);
  } catch (error) {
    return next(new Error('Internal Server Error'));
  }
};

// route handler for /account/transaction/:type => POST
exports.postTransactionHandler = async (req, res) => {
  const { userId } = req.session;
  const { user } = req;
  const amount = Number(req.body.amount);
  const { transactionType } = req.params;
  let transaction;
  let mailHtml;

  if (transactionType === 'withdraw') {
    if (amount < 100) {
      return res.status(422).json({ error: true, message: 'Amount must be more than 100' });
    }
    if (amount > user.balance) {
      return res.status(422).json({ error: true, message: 'Amount must be less than current balance' });
    }
    user.balance -= amount;
  }
  if (transactionType === 'deposit') {
    if (amount < 100) {
      return res.status(422).json({ error: true, message: 'Amount should be more than 100' });
    }
    user.balance += amount;
  }
  try {
    transaction = await Transaction.create({
      type: transactionType,
      user: userId,
      amount
    });
    await user.save();
    delete transaction._id;
    delete transaction.user;
    if (transactionType === 'deposit') {
      mailHtml = `
        <p>Am amount of <strong>₹ ${amount.toFixed(2)}</strong> has been credit to your account.<br>
        Available balance: <strong>₹ ${user.balance.toFixed(2)}</strong></p>
      `;
    } else {
      mailHtml = `
        <p>Am amount of <strong>₹ ${amount.toFixed(2)}</strong> has been debited from your account.<br>
        Available balance: <strong>₹ ${user.balance.toFixed(2)}</strong></p>
      `;
    }
    const subject = 'Account Update';
    // send mail
    sendMail(user.email, subject, mailHtml);
    return res.status(201).json({ transaction });
  } catch (error) {
    debug(error);
    if (transaction) {
      Transaction.deleteOne({ _id: transaction._id });
    }
    return res.status(500).json({ error: true, message: 'Internal Server Error' });
  }
};

// GET (API) => /account/balance
exports.enquireBalance = (req, res) => {
  const { balance } = req.user;
  res.status(200).json({ balance: balance.toFixed(2) });
};
