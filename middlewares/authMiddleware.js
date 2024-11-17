const jwt = require('jsonwebtoken');

// Middleware to verify JWT and role-based access
const authenticate = (roles = []) => {
    return async (req, res, next) => {
        // `roles` param can be a string or an array of allowed roles
        // If `roles` is empty, allow all roles (no role restrictions)

        const token = req.header('Authorization')?.split(' ')[1];  // Extract the token from Authorization header

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        try {
            // Verify the token and decode it
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = decoded;  // Attach the decoded payload (including user_id and role) to the req object

            // If `roles` is defined, check if the user role matches, allowing "admin" to bypass restrictions
            if (roles.length && !roles.includes(req.user.role) && req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied: Unauthorized role' });
            }

            next();  // User is authenticated and authorized, proceed to the next handler
        } catch (error) {
            // Token verification failed (invalid or expired)
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    };
};

module.exports = authenticate;