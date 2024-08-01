const jwt = require('jsonwebtoken');

const TokenController = {
    generateAccessToken: user => {
        return jwt.sign(
            {
                _id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' },
        );
    },
    generateRefreshToken: user => {
        return jwt.sign(
            {
                _id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' },
        );
    },
};

module.exports = TokenController;
