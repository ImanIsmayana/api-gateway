const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    const accessToken = token.split(' ')[1]; // Extract the token part

    try {
        // Decode and verify the JWT
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        req.prefix = decoded.prefix;
        req.user_id = decoded.user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateJWT;