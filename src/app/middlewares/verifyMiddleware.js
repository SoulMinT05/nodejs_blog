const jwt = require('jsonwebtoken');

const verifyMiddleware = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET,
                (err, user) => {
                    if (err) {
                        res.status(403).json('Token đã hết hạn');
                    }
                    req.user = user;
                    next();
                },
            );
        } else {
            res.status(401).json('Bạn chưa được cấp quyền');
        }
    },
    // verifyTokenOfAdmin:
    // (req, res, next) => {
    //     const token = req.headers.token;
    //     console.log('token: ', token);
    //     if (token) {
    //         const accessToken = token.split(' ')[1];
    //         jwt.verify(
    //             accessToken,
    //             process.env.ACCESS_TOKEN_SECRET,
    //             (err, user) => {
    //                 if (err) {
    //                     res.status(403).json('Token đã hết hạn');
    //                 }
    //                 console.log('user: ', user);
    //                 console.log('req: ', req);
    //                 req.user = user;
    //                 next();
    //             },
    //         );
    //     } else {
    //         res.status(401).json('Bạn chưa được cấp quyền');
    //     }

    //     if (req.user._id == req.params.id || req.user.isAdmin === false) {
    //         console.log('req.user._id: ', req.user._id);
    //         console.log('req.user.isAdmin: ', req.user.isAdmin);
    //         next();
    //     } else {
    //         res.status(403).json('Bạn chưa được cấp quyền vào trang này');
    //     }
    // },
    verifyTokenOfAdmin: (req, res, next) => {
        verifyMiddleware.verifyToken(req, res, () => {
            if (req.user._id == req.params.id || req.user.isAdmin) {
                console.log('req.user._id: ', req.user._id);
                console.log('req.user.isAdmin: ', req.user.isAdmin);
                next();
            } else {
                res.status(403).json(
                    'Bạn không có quyền thực hiện hành động này',
                );
            }
        });
    },
};
module.exports = verifyMiddleware;
