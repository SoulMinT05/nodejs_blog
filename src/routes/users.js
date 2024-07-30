const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/register', userController.register);
router.post('/store', userController.store);
router.get('/login', userController.login);
router.post('/loginSuccessfully', userController.loginSuccessfully);

module.exports = router;
