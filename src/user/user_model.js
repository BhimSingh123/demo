const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'] },// Email validation
    number: {
        type: String,
        required: true,
        unique: true,
        minlength: [10, 'Number must be at least 10 digits long'],
        maxlength: [12, 'Number must be at most 15 digits long'],
        validate: {
            validator: function(v) {
                return /^\d+$/.test(v); // Ensure the number only contains digits
            },
            message: props => `${props.value} is not a valid number!`
        }
    },

    referralCode: { type: String, default: () => generateReferralCode() },
    joinedDate: { type: Date, default: Date.now },  
    password: { type: String, required: true },
   referredBy: { type: String },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
    
    
    // Optional field to store the referral code of the user who referred this user
}, { collection: 'user_database' }); // Specify the collection name

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to hash passwords before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Generate a referral code (example function, implement as needed)
function generateReferralCode() {
    return 'REF' + Math.floor(Math.random() * 10000);
}
const User = mongoose.model('User', userSchema);

module.exports = User;