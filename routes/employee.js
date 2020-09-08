const router = require('express').Router();

// employee controller
const empController = require('../controllers/employee');
// authentication middleware functions
const { checkStaffLogin, checkIfManager } = require('../middlewares/auth');

// GET => /admin
router.get('/', checkStaffLogin, empController.getAdminDashboardHandler);

// GET => /admin/signup
router.get('/signup', empController.getSignupHandler);

// POST => /admin/signup
router.post('/signup', empController.postSignupHandler);

// GET => /admin/login
router.get('/login', empController.getLoginHandler);

// POST => /admin/login
router.post('/login', empController.postLoginHandler);

// POST => /admin/logout
router.post('/logout', checkStaffLogin, empController.postLogoutHandler);

// GET => /admin/users
router.get('/users', checkStaffLogin, empController.getUsersList);

// GET => /admin/users/:userId
router.get('/users/:userId', checkStaffLogin, empController.getUserProfileHandler);

// GET (API) => /admin/users/:userId/transactions
router.get('/users/:userId/transactions', checkStaffLogin, empController.getUserTransactionsHandler);

// GET => /admin/users/:userId/transactions/download
router.get('/users/:userId/transactions/download', checkStaffLogin, checkIfManager, empController.downloadTransactionSheetHandler);

module.exports = router;
