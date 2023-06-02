const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/todo/:slug', authController.isLoggedIn, viewsController.getTodo);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/sigin', authController.isLoggedIn, viewsController.getSiginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
