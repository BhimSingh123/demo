const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth_middleware');  // Corrected path

// GET /api/profile - Fetch user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        res.send({
            _id: user._id,
            username: user.username,
            email: user.email,
            number: user.number,
            referralCode: user.referralCode,
            joinedDate: user.joinedDate
            // Add other fields as needed
        });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
