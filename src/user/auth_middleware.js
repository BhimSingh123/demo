const jwt = require('jsonwebtoken');
const User = require('./user_model'); // Adjust the path as necessary
const authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the request header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({status:false,
                 message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user by ID
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).send({ 
                status:false,
                message: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({status:false,
             mesage: 'Invalid token' });
    }
};

module.exports = authMiddleware;
