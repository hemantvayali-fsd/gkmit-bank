const mongoose = require('mongoose');
const debug = require('debug')('app');

mongoose.Promise = global.Promise;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';

module.exports = () => {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => {
    debug('Successfully Connected to DB');
  }).catch((error) => {
    debug(error);
    setTimeout(() => {
      process.exit(1);
    }, 0);
  });
};
