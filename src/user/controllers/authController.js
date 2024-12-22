const User = require('../user_model'); // Adjust the path as necessary
const jwt = require('jsonwebtoken');
// require('dotenv').config();


const register = async (req, res) => {
    try {
        const { username, email, number, password, referredBy } = req.body;

        // Check if email or number is already registered
        const existingUser = await User.findOne({ $or: [{ email }, { number }] });
        if (existingUser) {
            let errorMessage = 'Email or number already registered';
            if (existingUser.email === email) {
                errorMessage = 'Email already registered';
            } else if (existingUser.number === number) {
                errorMessage = 'Number already registered';
            }
            return res.status(400).send({
                 status: false,
                 message: errorMessage });
        }

        const user = new User({ username, email, number, password, referredBy });
        await user.save();
        res.status(201).send({
            status:true,
            message: 'User registered successfully!',
            referralCode: user.referralCode

        });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const errorMessage = field === 'email' ? 'Email already registered' : 'Number already registered';
            return res.status(400).send({ 
                status:false,
                message: errorMessage });
        }

        if (error.errors) {
            const fieldErrors = Object.keys(error.errors).map(field => error.errors[field].message);
            return res.status(400).send({ status: false, message: fieldErrors.join(', ') });
        }
        res.status(400).send({
            status:error.status,
             message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid login credentials');
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error('Invalid login credentials');
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ 
            status:true,
            message:'Login success',
            token : token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                number: user.number,
                referralCode: user.referralCode,
                joingTime:user.joinedDate
            }

         });
    } catch (error) {
        res.status(400).send({ status:false,
            message:error.message
         });
    }
};

module.exports = { register, login };
