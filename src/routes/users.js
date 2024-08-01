const express = require('express');
const router = express.Router();

const verifyMiddleware = require('../app/middlewares/verifyMiddleware');
const userController = require('../app/controllers/UserController');

router.get('/register', userController.register);
router.get('/create', userController.create);
router.post('/store', userController.store);
router.post('/createStore', userController.createStore);
router.get('/:id/edit', userController.edit);
router.put('/:id', userController.update);
router.delete(
    '/:id',
    verifyMiddleware.verifyTokenOfAdmin,
    userController.delete,
);

router.get('/login', userController.login);
router.post('/loginSuccessfully', userController.loginSuccessfully);
router.get('/:slug', userController.show);

module.exports = router;
