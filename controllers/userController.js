const cloudinary = require('cloudinary').v2;
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const User = require("../models/userModel");
const Address = require("../models/addressModel");



exports.getLoggedInUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('address').select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

exports.updateLoggedInUser = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Form parsing error' });
        }

        try {
            // Find the logged-in user
            const user = await User.findById({_id:req.user._id}).select('-password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Update user fields
            if (fields.name) user.name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            if (fields.phone_number) user.phone_number = Array.isArray(fields.phone_number) ? fields.phone_number[0] : fields.phone_number;

            // Handle image upload to Cloudinary
            if (files.user_photo) {
                const imageFile = files.user_photo[0];
                const result = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'user_photos' });
                user.user_photo = result.secure_url;
            }

            // Find or create the address associated with the user
            let address = await Address.findById({ _id: req.user._id });

            // Convert fields to strings if necessary
            const street = Array.isArray(fields.street) ? fields.street[0] : fields.street;
            const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
            const state = Array.isArray(fields.state) ? fields.state[0] : fields.state;
            const zip_code = Array.isArray(fields.zip_code) ? fields.zip_code[0] : fields.zip_code;
            const latitude = Array.isArray(fields.latitude) ? fields.latitude[0] : fields.latitude;
            const longitude = Array.isArray(fields.longitude) ? fields.longitude[0] : fields.longitude;

            if (street || city || state || zip_code || latitude || longitude) {
                if (address) {
                    // Update the existing address
                    address.street = street || address.street;
                    address.city = city || address.city;
                    address.state = state || address.state;
                    address.zip_code = zip_code || address.zip_code;
                    address.latitude = latitude || address.latitude;
                    address.longitude = longitude || address.longitude;

                    await address.save();
                } else {
                    // Create a new address if not found
                    address = new Address({
                        user_id: req.user._id,
                        street,
                        city,
                        state,
                        zip_code,
                        latitude,
                        longitude
                    });
                    await address.save();
                }
                // Ensure the user's address field is updated with the new address ObjectId
                user.address = address._id;
            }

            // Save the user after the address update
            await user.save();
            res.status(200).json({ success: true, message: 'Profile and address updated successfully', user, address });

        } catch (error) {
            console.error('Error updating user and address:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
};

exports.manageUserProfile = async (req, res) => {
    const { _id } = req.params;

    try {
        const user = await User.findById(_id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.deleteLoggedInUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};