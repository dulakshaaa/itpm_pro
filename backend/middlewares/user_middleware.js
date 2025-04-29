const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the JWT token from the request headers
    const token = req.headers.authorization;

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);

        // Attach the decoded user ID to the request object
        req.user = decodedToken;

        // Move to the next middleware
        next();
    } catch (error) {
        // If token is invalid or expired
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authMiddleware;
