const User = require('../models/User');

const { mongooseToObject } = require('../../utils/mongoose');
const bcrypt = require('bcrypt');

class UserController {
    // GET / user/register
    register(req, res, next) {
        res.render('users/register');
    }
    // POST / user/store
    store(req, res, next) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        if (req.body.password !== req.body.confirmPassword) {
            res.json('Mật khẩu và xác nhận mật khẩu không trùng nhau!');
            return;
        }

        const newUser = new User({
            ...req.body,
            password: hash,
            confirmPassword: hash,
        });

        console.log('newUser: ', newUser);
        newUser
            .save()
            .then(() => {
                res.redirect('/users/login');
            })
            .catch(next);
    }
    // GET / user/login
    login(req, res, next) {
        res.render('users/login');
    }

    // POST / user/loginSuccessfully
    async loginSuccessfully(req, res, next) {
        try {
            const user = await User.findOne({ email: req.body.email });
            console.log('user.email', user.email);
            if (!user) {
                res.status(404).json('Tên của bạn không có!');
            }
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password,
            );
            if (!isValidPassword) {
                res.status(404).json('Mật khẩu của bạn không đúng!');
            }
            if (user.email && isValidPassword) {
                res.status(200).json('Bạn đã đăng nhập thành công!');
            }
        } catch (err) {
            console.log('err: ', err);
        }
    }
}
module.exports = new UserController();
