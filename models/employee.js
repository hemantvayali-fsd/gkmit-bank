const { Schema, model } = require('mongoose');

// User Schema
const employeeSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email is not unique']
  },
  password: {
    type: String,
    reqired: [true, 'Password is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  role: {
    type: String,
    required: [true, 'role is required'],
    enum: ['admin', 'manager', 'teller']
  }
}, { timestamps: true });

employeeSchema.virtual('fullName').get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.static('findByEmail', async function findByEmail(email) {
  return this.findOne({ email });
});

module.exports = model('Employee', employeeSchema);
