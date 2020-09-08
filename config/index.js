module.exports = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'secret',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/mydb',
  saltRounds: process.env.SALT_ROUNDS || 10,
  sendgridAPIKey: process.env.SENDGRID_API_KEY
};
