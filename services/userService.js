// User model
const User = require('../models/user');

// utility methods
const { encryptPassword, comparePassword } = require('../utility');

// object containing the validation configuration for user obj
// const USER_VALIDATION_CONFIG = {
//   firstName: {
//     required: true,
//     minLength: 3,
//     maxLength: 16
//   }
// };

/**
 * encrypts the user password and persists data to the database
 * @param {*} userData
 */
exports.signupUser = async (userData) => {
  // encrypt password
  const encryptedPassword = await encryptPassword(userData.password);
  // update the new password
  const userObj = { ...userData, password: encryptedPassword };
  // save user data
  return User.create(userObj);
};

exports.comparePassword = async (password, hash) => comparePassword(password, hash);
