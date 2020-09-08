const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  accountNumber: {
    type: String,
    set() { return 'abc'; }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email is not unique']
  },
  password: {
    type: String,
    reqired: [true, 'Password is required'],
    select: false
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  balance: {
    type: Number,
    default: 0,
    min: [0, "Balance can't be negative"]
  }
}, { timestamps: true });

userSchema.virtual('fullName').get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.static('findByEmail', async function findByEmail(email) {
  return this.findOne({ email }).select('+password');
});

userSchema.index(
  { firstName: 'text', lastName: 'text' },
  {
    weights: { firstName: 2, lastName: 1 }
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
