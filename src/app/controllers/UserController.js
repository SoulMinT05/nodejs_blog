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
    // GET / user/create
    create(req, res, next) {
        res.render('users/create');
    }
    // POST / user/createStore
    createStore(req, res, next) {
        const salt = bcrypt.genSaltSync(10);
        const userPassword = req.body.password || '123456';
        const userConfirmPassword = userPassword;

        const hash = bcrypt.hashSync(userPassword, salt);

        const newUser = new User({
            ...req.body,
            password: hash,
            confirmPassword: hash,
        });

        console.log('newUser: ', newUser);
        newUser
            .save()
            .then(() => {
                res.redirect('back');
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

    // GET / show/:slug
    show(req, res, next) {
        User.findOne({ slug: req.params.slug })
            .lean()
            .then(user => {
                res.render('users/userDetail', {
                    user,
                });
            })
            .catch(next);
    }
    // GET / users/:id/edit
    edit(req, res, next) {
        User.findById(req.params.id)
            .lean()
            .then(user => res.render('users/edit', { user }))
            .catch(next);
    }
    // PUT / users/:id
    update(req, res, next) {
        User.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/users'))
            .catch(next);
    }
    // DELETE / users/:id
    delete(req, res, next) {
        User.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
}
module.exports = new UserController();
