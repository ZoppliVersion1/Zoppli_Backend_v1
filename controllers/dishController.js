const mongoose = require('mongoose');
const Dish = require('../models/dishModel');
const Restaurant = require('../models/restaurantModel');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

// Add a new dish to a specific restaurant
exports.addDish = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Form parsing error' });
        }

        try {
            const restaurant_id = fields.restaurant_id;
            const menu_id = fields.menu_id;
            const category_id = fields.category_id;
            const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
            const ingredients = Array.isArray(fields.ingredients) ? fields.ingredients : [fields.ingredients];
            const allergens = Array.isArray(fields.allergens) ? fields.allergens : [fields.allergens];
            const calories = fields.calories ? Number(fields.calories) : 0;
            const price = fields.price ? Number(fields.price) : 0;
            const tax_amount = fields.tax_amount ? Number(fields.tax_amount) : 0;
            const delivery_fee = fields.delivery_fee ? Number(fields.delivery_fee) : 0;
            const availability = fields.availability === 'true';

            // Validate required fields
            if (!restaurant_id || !menu_id || !category_id || !name || !price) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const restaurant = await Restaurant.findById(restaurant_id);
            if (!restaurant) {
                return res.status(404).json({ success: false, message: 'Restaurant not found' });
            }

            const total_price = price + tax_amount + delivery_fee;
            let image_url = '';

            // Handle image upload
            if (files.image) {
                const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
                if (imageFile && imageFile.filepath) {
                    try {
                        const result = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'dish_images' });
                        image_url = result.secure_url;
                    } catch (uploadError) {
                        return res.status(500).json({ success: false, message: 'Image upload failed', error: uploadError.message });
                    }
                }
            }

            const newDish = new Dish({
                menu_id,
                restaurant_id,
                category_id,
                name,
                description,
                ingredients,
                allergens,
                calories,
                price,
                tax_amount,
                delivery_fee,
                total_price,
                availability,
                image_url
            });

            await newDish.save();
            res.status(201).json({ success: true, message: 'Dish added successfully', dish: newDish });
        } catch (error) {
            console.error('Error adding dish:', error);
            res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        }
    });
};

// Update an existing dish
exports.updateDish = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Form parsing error' });
        }

        try {
            let dish = await Dish.findById(req.params.dish_id);
            if (!dish) {
                return res.status(404).json({ success: false, message: 'Dish not found' });
            }

            dish.name = fields.name || dish.name;
            dish.description = fields.description || dish.description;
            dish.ingredients = fields.ingredients ? (Array.isArray(fields.ingredients) ? fields.ingredients : [fields.ingredients]) : dish.ingredients;
            dish.calories = fields.calories ? Number(fields.calories) : dish.calories;
            dish.price = fields.price ? Number(fields.price) : dish.price;
            dish.tax_amount = fields.tax_amount ? Number(fields.tax_amount) : dish.tax_amount;
            dish.delivery_fee = fields.delivery_fee ? Number(fields.delivery_fee) : dish.delivery_fee;
            dish.total_price = dish.price + dish.tax_amount + dish.delivery_fee;
            dish.availability = fields.availability === 'true' ? true : fields.availability === 'false' ? false : dish.availability;
            dish.category_id = fields.category_id || dish.category_id;

            // Handle image update
            if (files.image) {
                const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
                if (imageFile.filepath) {
                    const result = await cloudinary.uploader.upload(imageFile.filepath, { folder: 'dish_images' });
                    dish.image_url = result.secure_url;
                }
            }

            await dish.save();
            res.status(200).json({ success: true, message: 'Dish updated successfully', dish });
        } catch (error) {
            console.error('Error updating dish:', error);
            res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        }
    });
};

// Delete a dish
exports.deleteDish = async (req, res) => {
    try {
        const dish = await Dish.findById(req.params.dish_id);
        if (!dish) {
            return res.status(404).json({ success: false, message: 'Dish not found' });
        }

        await dish.remove();
        res.status(200).json({ success: true, message: 'Dish deleted successfully' });
    } catch (error) {
        console.error('Error deleting dish:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Fetch dishes by restaurant
exports.getDishesByRestaurant = async (req, res) => {
    const { restaurant_id } = req.query;

    if (!restaurant_id) {
        return res.status(400).json({ error: 'restaurant_id is required' });
    }

    try {
        const dishes = await Dish.find({ restaurant_id }).populate('category_id', 'name');
        res.status(200).json({ success: true, dishes });
    } catch (error) {
        console.error('Error fetching dishes:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Fetch dishes by menu
exports.getDishesByMenu = async (req, res) => {
    const { menu_id } = req.params;
    const { category_id } = req.query;

    try {
        let filter = { menu_id, availability: true };
        if (category_id) filter.category_id = category_id;

        const dishes = await Dish.find(filter).populate('category_id', 'name');
        res.status(200).json({ success: true, dishes });
    } catch (error) {
        console.error('Error fetching dishes:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Search dishes
exports.searchDishes = async (req, res) => {
    const { name, minPrice, maxPrice } = req.query;

    try {
        let searchCriteria = {};
        if (name) searchCriteria.name = { $regex: name, $options: 'i' };
        if (minPrice || maxPrice) searchCriteria.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };

        const dishes = await Dish.find(searchCriteria).populate('restaurant_id').populate('category_id', 'name');
        res.status(200).json({ success: true, dishes });
    } catch (error) {
        console.error('Error searching dishes:', error);
        res.status(500).json({ message: error.message });
    }
};
