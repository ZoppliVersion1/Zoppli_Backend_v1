const formidable = require('formidable');
const RestaurantReview = require('../models/restaurantReviewModel');
const Restaurant = require('../models/restaurantModel');  // Assuming you have a Restaurant model
const cloudinary = require('cloudinary').v2;

// Add a review with photos and rating
exports.addReview = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Form parsing error' });
        }

        // Extract fields and ensure single values (not arrays)
        const restaurant_id = Array.isArray(fields.restaurant_id) ? fields.restaurant_id[0] : fields.restaurant_id;
        const review_text = Array.isArray(fields.review_text) ? fields.review_text[0] : fields.review_text;
        const rating = Array.isArray(fields.rating) ? parseFloat(fields.rating[0]) : parseFloat(fields.rating);

        // Ensure rating is within range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }

        try {
            // Check if the restaurant exists
            const restaurant = await Restaurant.findById(restaurant_id);
            if (!restaurant) {
                return res.status(404).json({ success: false, message: 'Restaurant not found' });
            }

            // Upload photos to Cloudinary if provided
            let photoUrls = [];
            if (files.photos) {
                const photos = Array.isArray(files.photos) ? files.photos : [files.photos];
                for (const photo of photos) {
                    const result = await cloudinary.uploader.upload(photo.filepath, { folder: 'restaurant_reviews' });
                    photoUrls.push(result.secure_url);
                }
            }

            // Create a new review
            const newReview = new RestaurantReview({
                restaurant_id,
                customer_id: req.user._id,  // Assuming user is authenticated and req.user._id contains the user ID
                review_text,
                rating,
                photos: photoUrls,
            });

            await newReview.save();

            // Update the restaurant's average rating
            await updateAverageRating(restaurant_id);

            res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
};

// Get reviews for a restaurant
exports.getReviewsByRestaurant = async (req, res) => {
    try {
        const reviews = await RestaurantReview.find({ restaurant_id: req.params.restaurant_id })
            .populate('customer_id', 'name')  // Populate customer name in the reviews
            .sort({ created_at: -1 });  // Sort by most recent

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update average rating and overall rating for a restaurant
const updateAverageRating = async (restaurant_id) => {
    try {
        const reviews = await RestaurantReview.find({ restaurant_id });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);  // Round to 1 decimal

        // Update the restaurant's overall rating
        await Restaurant.findByIdAndUpdate(restaurant_id, { overall_rating: averageRating });
    } catch (error) {
        console.error('Error updating average rating:', error);
    }
};
