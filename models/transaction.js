const { Schema, model } = require('mongoose');
const moment = require('moment');

// TRANSACTION model schema
const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  type: {
    type: String,
    required: true,
    default: 'credit'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

transactionSchema.static(
  'getLastTenTransactions',
  function getLastTenTransactions(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    return this.find({ user: userId })
      // fetch latest 10
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }
);

transactionSchema.virtual('displayDateTime').get(function getDisplayDateTime() {
  return moment(this.createdAt).format('LLL');
});

transactionSchema.index({ createdAt: -1, user: 1 });

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
