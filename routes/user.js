const debug = require('debug')('app');
const router = require('express').Router();

const userController = require('../controllers/user');
const { checkUserLogin } = require('../middlewares/auth');
const UserService = require('../services/userService');

// GET '/'
// dashboard page
router.get('/', checkUserLogin, userController.getDashboardHandler);

// GET '/signup'
// signup page
router.get('/signup', async (req, res) => {
  res.render('user/signup', { title: 'Signup' });
  delete req.error;
});

router.get('/login', userController.getLoginHandler);

router.post('/signup', async (req, res) => {
  try {
    await UserService.signupUser(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    debug(error);
    res.redirect('/signup');
  }
});

router.post('/login', userController.postLoginHandler);

router.post('/logout', checkUserLogin, userController.postLogout);

// GET => passbook page
router.get('/passbook', checkUserLogin, userController.getPassbookHandler);

// GET (API) => /balance
router.get('/account/balance', checkUserLogin, userController.enquireBalance)

// POST => /account/transaction/deposit
router.post('/account/transaction/:transactionType', checkUserLogin, userController.postTransactionHandler);

module.exports = router;
