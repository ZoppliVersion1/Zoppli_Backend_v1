const User = require('../models/userModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/sendEmail');
const zod = require('zod');
const path = require('path');
const fs = require("fs");
const crypto = require('crypto');

// Controller for registering the user with phone number only
exports.launchRegister = async (req, res) => {
    const { name,phone_number } = req.body;

    if (!phone_number) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({ phone_number });

        if (!user) {
            // Create a new user if not registered
            user = new User({ phone_number, name});
            await user.save();
        }

        res.status(200).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

// Controller for joining the waitlist with email
exports.joinWaitlist = async (req, res) => {
    const { email, phone_number } = req.body;

    if (!email || !phone_number) {
        return res.status(400).json({ error: 'Email and phone number are required' });
    }

    try {
        const user = await User.findOne({ phone_number });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user with waitlist email
        user.email = email;
        user.waitlist_joined = true;
        await user.save();

        res.status(200).json({ message: 'Successfully joined the waitlist', user });
    } catch (error) {
        console.error('Error joining waitlist:', error);
        res.status(500).json({ error: 'Failed to join the waitlist' });
    }
};


// User Registration
exports.registerUser = async (req, res) => {
    const userSchema = zod.object({
        name: zod.string().min(2),
        email: zod.string().email(),
        phone_number: zod.string().min(10),
        user_type: zod.enum(['customer', 'restaurant_owner', 'delivery_partner']),
        password: zod.string().min(8),
    });

    const validation = userSchema.safeParse(req.body);
    if (!validation.success) {
        // Return cleaner error messages
        const errorMessages = validation.error.issues.map(issue => ({
            path: issue.path[0],
            message: issue.message
        }));
        return res.status(400).json({ error: errorMessages });
    }

    const { name, email, phone_number, user_type, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password (consider lowering cost parameters if needed)
        const hashedPassword = await argon2.hash(password, {
            memoryCost: 2 ** 15,
            hashLength: 50,
            timeCost: 5,  // Adjusted to prevent long processing times
            parallelism: 2
        });

        // Create new user
        const newUser = new User({
            name,
            email,
            phone_number,
            user_type,
            password: hashedPassword,
        });

        await newUser.save();

        // Send email verification
        const token = jwt.sign({ _id: newUser._id  }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

        const replacements = {
            name: newUser.name,
            verificationUrl
        };

        try {
            await sendEmail(email, 'Verify your Email', 'verification', replacements);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(500).json({ error: 'Error sending verification email' });
        }

        res.status(201).json({ message: 'User registered successfully. Please check your email for verification link.' });
    } catch (error) {
        console.error('Register user error:', error);  // Log the error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById({ _id: decoded._id });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token or user does not exist' });
        }

        user.email_verified = true;
        await user.save();

        const filePath = path.join(__dirname, '../utils/templates', 'emailVerified.html');
        let html = fs.readFileSync(filePath, 'utf-8');
        html = html.replace('{{name}}', user.name);

        res.send(html);  // Send the HTML file to be displayed
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user.email_verified) {
            return res.status(403).json({ success: false, message: 'Email not verified' });
        }

        if (!user || !(await argon2.verify(user.password, password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate short-lived access token
        const accessToken = jwt.sign({ _id: user._id, role: user.user_type }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // Generate long-lived refresh token
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Store refresh token in DB
        if (user.refresh_tokens.length >= 3) {
            user.refresh_tokens.shift();  // Remove the oldest refresh token
        }

        user.refresh_tokens.push({ token: refreshToken, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });  // 7 days
        await user.save();

        res.status(200).json({
            success: true,
            accessToken,  // Send access token for immediate API calls
            refreshToken  // Send refresh token for generating new access tokens
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Password Reset (Request)
exports.resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    console.log("Inside request password change:",email)

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User with this email does not exist' });
        }

        // Generate a random 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Save the OTP and its expiry time in the user document (adjust as needed)
        user.reset_otp = otp;
        user.otp_expiry = Date.now() + 600000; // Set expiry to 10 Minutes from now
        await user.save();

        // Prepare email replacements
        const replacements = {
            name: user.name,
            otp, // Inject the OTP into the email template
            year: new Date().getFullYear()
        };

        // Send the OTP email
        await sendEmail(user.email, 'Password Reset Request', 'resetPassword', replacements);

        res.status(200).json({ message: 'Password reset email sent with OTP' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body; // Take OTP and new password from the request
    try {
        // Find the user by the OTP
        const user = await User.findOne({ reset_otp: otp });

        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP or user does not exist' });
        }

        // Check if the OTP has expired
        if (Date.now() > user.otp_expiry) {
            return res.status(400).json({ error: 'OTP has expired' });
        }

        // Hash the new password
        user.password = await argon2.hash(newPassword, {
            memoryCost: 2 ** 15,
            hashLength: 50,
            timeCost: 5,
            parallelism: 2,
        });

        // Clear the OTP and its expiry once the password has been reset
        user.reset_otp = null;
        user.otp_expiry = null;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error); // Log error for debugging
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }

    try {
        // Decode the refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        // Find user and verify refresh token in DB
        const user = await User.findById({_id: decoded._id});

        const storedToken = user.refresh_tokens.find(rt => rt.token === token);

        if (!storedToken) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        // Check if token is expired
        if (Date.now() > storedToken.expiresAt) {
            return res.status(403).json({ success: false, message: 'Refresh token expired' });
        }

        // Generate new access token
        const newAccessToken = jwt.sign({ _id: user._id,role:user.user_type }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });
    } catch (error) {
        res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};


// User Logout - Ensure you use authenticate middleware before this function
exports.logoutUser = async (req, res) => {

    try {
        // Find the user using `req.user._id` set by the middleware
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Clear all refresh tokens associated with the user (or handle it based on your logic)
        user.refresh_tokens = [];
        await user.save();

        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
