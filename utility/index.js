const bcrypt = require('bcrypt');
const { saltRounds } = require('../config');

/**
 * encrypts a normal password to hashed string
 * @param {*} password - user password
 */
exports.encryptPassword = async (password) => {
  if (!password) {
    const error = new Error('password is missing');
    error.statusCode = 422;
    throw error;
  }
  return bcrypt.hash(password, saltRounds);
};

/**
 * checks if the provided password and hash match
 * @param {string} password - normal password string
 * @param {string} hash - encrypted password
 */
exports.comparePassword = async (password, hash) => {
  const error = new Error('Value is missing');
  error.statusCode = 422;
  if (!password) {
    error.message = 'password is missing';
    throw error;
  }
  if (!hash) {
    error.message = 'hash is missing';
    throw error;
  }
  return bcrypt.compare(password, hash);
};

/**
 * validates incoming data with given configuration
 * @param {object} data - data to validate
 * @param {object} configObj - configuration object
 */
// exports.validateUser = (data, configObj = {}) => {
//   const errors = {};
//   const error = false;
//   return { error: true, errors };
// };
