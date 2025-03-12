const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token || token.lenght === 0) {
            throw new Error('Please authenticate');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            throw new Error('Token is invalid');
        }

        if (decoded.exp < Date.now() / 1000) {
            throw new Error('Token is expired');
        }

        console.log(decoded)

        const user = await User.findOne({ _id: decoded.id });
        console.log(user)
        if (!user) {
            throw new Error('User not found');
        }

        req.user = Object.assign(user, { exp: decoded.exp });

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).send({ message: error.message });
    }

}
console.log("Cookies received:", req.cookies);
console.log("Authorization Header:", req.headers.authorization);


module.exports = auth;
