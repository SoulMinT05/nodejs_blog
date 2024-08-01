const User = require('../models/User');
const TokenController = require('../controllers/TokenController');

const jwt = require('jsonwebtoken');
const { mongooseToObject } = require('../../utils/mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

let refreshTokens = [];
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
        const isAdmin = req.body.isAdmin || false;

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
            console.log('user', user);
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
                const accessToken = TokenController.generateAccessToken(user);
                const refreshToken = TokenController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, confirmPassword, ...others } = user._doc;
                res.status(200).json({
                    others,
                    accessToken,
                    refreshToken,
                });
            }
        } catch (err) {
            console.log('err: ', err);
        }
    }

    // POST / refreshToken
    refreshToken(req, res, next) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            res.status(401).json('Bạn không quyền vì không có refreshToken');
        if (!refreshTokens.includes(refreshToken))
            res.status(403).json('Refresh token không có');
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) return console.log('err: ', err);
                refreshTokens = refreshTokens.filter(
                    token => token !== refreshToken,
                );
                // Create new access token, refresh token
                const newAccessToken =
                    TokenController.generateAccessToken(user);
                const newRefreshToken =
                    TokenController.generateRefreshToken(user);
                refreshTokens.push(newRefreshToken);
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                res.status(200).json({
                    accessToken: newAccessToken,
                });
            },
        );
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
        console.log('DELETEETEEEE');
        User.delete({ _id: req.params.id })
            .then(() => {
                // res.redirect('back');
                res.status(200).json('Xoá tài khoản người dùng thành công');
            })
            .catch(next);
    }
}
module.exports = new UserController();

// const User = require('../models/User');
// const TokenController = require('../controllers/TokenController');

// const jwt = require('jsonwebtoken');
// const { mongooseToObject } = require('../../utils/mongoose');
// const bcrypt = require('bcrypt');
// require('dotenv').config();

// let refreshTokens = [];
// const UserController = {
//     // GET / user/register
//     register: (req, res, next) => {
//         res.render('users/register');
//     },
//     // POST / user/store
//     store: (req, res, next) => {
//         const salt = bcrypt.genSaltSync(10);
//         const hash = bcrypt.hashSync(req.body.password, salt);

//         if (req.body.password !== req.body.confirmPassword) {
//             res.json('Mật khẩu và xác nhận mật khẩu không trùng nhau!');
//             return;
//         }

//         const newUser = new User({
//             ...req.body,
//             password: hash,
//             confirmPassword: hash,
//         });

//         console.log('newUser: ', newUser);
//         newUser
//             .save()
//             .then(() => {
//                 res.redirect('/users/login');
//             })
//             .catch(next);
//     },
//     // GET / user/create
//     create: (req, res, next) => {
//         res.render('users/create');
//     },
//     // POST / user/createStore
//     createStore: (req, res, next) => {
//         const salt = bcrypt.genSaltSync(10);
//         const userPassword = req.body.password || '123456';
//         const userConfirmPassword = userPassword;
//         const isAdmin = req.body.isAdmin || false;

//         const hash = bcrypt.hashSync(userPassword, salt);
//         const newUser = new User({
//             ...req.body,
//             password: hash,
//             confirmPassword: hash,
//         });

//         console.log('newUser: ', newUser);
//         newUser
//             .save()
//             .then(() => {
//                 res.redirect('back');
//             })
//             .catch(next);
//     },

//     // GET / user/login
//     login: (req, res, next) => {
//         res.render('users/login');
//     },

//     // POST / user/loginSuccessfully

//     loginSuccessfully: async (req, res, next) => {
//         try {
//             const user = await User.findOne({ email: req.body.email });
//             console.log('user', user);
//             if (!user) {
//                 res.status(404).json('Tên của bạn không có!');
//             }
//             const isValidPassword = await bcrypt.compare(
//                 req.body.password,
//                 user.password,
//             );
//             if (!isValidPassword) {
//                 res.status(404).json('Mật khẩu của bạn không đúng!');
//             }
//             if (user.email && isValidPassword) {
//                 console.log('req.user: ', req.user);
//                 const accessToken = TokenController.generateAccessToken(user);
//                 const refreshToken = TokenController.generateRefreshToken(user);
//                 refreshTokens.push(refreshToken);
//                 res.cookie('refreshToken', refreshToken, {
//                     httpOnly: true,
//                     secure: false,
//                     path: '/',
//                     sameSite: 'strict',
//                 });
//                 const { password, confirmPassword, ...others } = user._doc;
//                 res.status(200).json({
//                     others,
//                     accessToken,
//                     refreshToken,
//                 });
//             }
//         } catch (err) {
//             console.log('err: ', err);
//         }
//     },

//     // POST / refreshToken
//     refreshToken: (req, res, next) => {
//         const refreshToken = req.cookies.refreshToken;
//         if (!refreshToken)
//             res.status(401).json('Bạn không quyền vì không có refreshToken');
//         jwt.verify(
//             refreshToken,
//             process.env.REFRESH_TOKEN_SECRET,
//             (err, user) => {
//                 if (err) return console.log('err: ', err);
//                 // Create new access token, refresh token
//                 const newAccessToken =
//                     TokenController.generateAccessToken(user);
//                 const newRefreshToken =
//                     TokenController.generateRefreshToken(user);
//                 res.cookie('refreshToken', newRefreshToken, {
//                     httpOnly: true,
//                     secure: false,
//                     path: '/',
//                     sameSite: 'strict',
//                 });
//                 res.status(200).json({
//                     accessToken: newAccessToken,
//                 });
//             },
//         );
//     },

//     // GET / show/:slug
//     show: (req, res, next) => {
//         User.findOne({ slug: req.params.slug })
//             .lean()
//             .then(user => {
//                 res.render('users/userDetail', {
//                     user,
//                 });
//             })
//             .catch(next);
//     },
//     // GET / users/:id/edit
//     edit: (req, res, next) => {
//         User.findById(req.params.id)
//             .lean()
//             .then(user => res.render('users/edit', { user }))
//             .catch(next);
//     },
//     // PUT / users/:id
//     update: (req, res, next) => {
//         User.updateOne({ _id: req.params.id }, req.body)
//             .then(() => res.redirect('/me/stored/users'))
//             .catch(next);
//     },
//     // DELETE / users/:id
//     delete: (req, res, next) => {
//         console.log('DELETEETEEEE');
//         User.delete({ _id: req.params.id })
//             .then(() => {
//                 // res.redirect('back');
//                 res.status(200).json('Xoá tài khoản người dùng thành công');
//             })
//             .catch(next);
//     },
// };
// module.exports = UserController;
