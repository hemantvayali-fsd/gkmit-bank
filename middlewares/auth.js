const debug = require('debug')('app');
// model imports
const User = require('../models/user');
const Employee = require('../models/employee');

// checks if the user is authenticated
exports.checkUserLogin = async (req, res, next) => {
  // check if a valid session is present
  if (!req.session.isAuthenticated || !req.session.userId) {
    return res.redirect('/login');
  }
  // check if user exists
  const user = await User.findById(req.session.userId, {
    createdAt: 0,
    updatedAt: 0,
    password: 0
  }).catch((error) => {
    debug(error);
    req.flash('error', 'Oops! Something went wrong. Please re-login');
    return res.redirect('/login');
  });
  if (!user) {
    req.flash('error', 'Session Expired! Please re-login');
    return res.redirect('/login');
  }
  // user is authenticated
  req.user = user;
  return next();
};

// check if an employee is logged in
exports.checkStaffLogin = async (req, res, next) => {
  // check if a valid session is present
  if (!req.session.isAuthenticated || !req.session.userId) {
    return res.redirect('/admin/login');
  }
  // check if employee exists
  const user = await Employee.findById(req.session.userId, {
    createdAt: 0,
    updatedAt: 0,
    password: 0
  }).catch((error) => {
    debug(error);
    req.flash('error', 'Oops! Something went wrong. Please re-login');
    return res.redirect('/admin/login');
  });
  if (!user) {
    req.flash('error', 'Session Expired! Please re-login');
    return res.redirect('/admin/login');
  }
  // user is authenticated
  req.user = user;
  return next();
};

exports.checkIfManager = (req, res, next) => {
  const { user } = req;
  // let pass if manager
  if (user.role === 'manager') return next();
  // else redirect back to employee login
  req.flash('error', 'Unauthorized');
  return res.redirect('/admin/login');
};
