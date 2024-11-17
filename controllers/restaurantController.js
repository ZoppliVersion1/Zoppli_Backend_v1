const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const Restaurant = require("../models/restaurantModel");
const Dish = require("../models/dishModel");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Helper function to get dishes and the lowest price for a restaurant
const getDishesAndLowestPrice = async (restaurantId) => {
  const dishes = await Dish.find({ restaurant_id: restaurantId });
  if (dishes.length === 0) return { dishes: [], lowestPrice: 'No dishes available' };

  const lowestPriceDish = dishes.reduce((prev, current) => (prev.price < current.price ? prev : current));
  return { dishes, lowestPrice: lowestPriceDish.price };
};

// Helper function to clean up fields
const cleanField = (field) => {
  return field.trim().replace(/^"|"$/g, ''); // Remove extra quotes and trim whitespace
};

// Get all restaurants with pagination and dishes
exports.getAllRestaurants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find()
      .populate("owner_id", "-password -refresh_tokens")
      .populate("address_id")
      .populate("menu_id")
      .skip(skip)
      .limit(limit);

    const restaurantsWithDetails = await Promise.all(
      restaurants.map(async (restaurant) => {
        const { dishes, lowestPrice } = await getDishesAndLowestPrice(restaurant._id);
        return {
          ...restaurant.toObject(),
          dishes,
          lowestPrice: lowestPrice || 'No dishes available',
          operating_hours: restaurant.operating_hours || {},
        };
      })
    );

    res.status(200).json(restaurantsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get details of a specific restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("owner_id", "-password -refresh_tokens")
      .populate("address_id")
      .populate("menu_id");
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new restaurant with multiple image uploads
exports.createRestaurant = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;  // Enable handling multiple files

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Form parsing error" });
    }

    // Clean and parse fields
    const cleanedFields = {
      name: cleanField(fields.name[0]),
      owner_id: cleanField(fields.owner_id[0]),
      menu_id: JSON.parse(cleanField(fields.menu_id[0])),
      gst_number: cleanField(fields.gst_number[0]),
      fssai_number: cleanField(fields.fssai_number[0]),
      address_id: cleanField(fields.address_id[0]),
      operating_hours: JSON.parse(cleanField(fields.operating_hours[0])),
      delivery_time_estimate: cleanField(fields['delivery_time_estimate\t'][0])
    };

    try {
      const image_urls = [];

      // Check if multiple files are uploaded as an array
      if (files.image) {
        const images = Array.isArray(files.image) ? files.image : [files.image];
        
        for (const image of images) {
          if (image.filepath) {
            const result = await cloudinary.uploader.upload(image.filepath, { folder: 'restaurant_images' });
            image_urls.push(result.secure_url); // Add each image URL to the array
          }
        }
      }

      const newRestaurant = new Restaurant({
        ...cleanedFields,
        image_urls,  // Store the array of image URLs
      });

      const savedRestaurant = await newRestaurant.save();
      res.status(201).json({ success: true, message: 'Restaurant created successfully', restaurant: savedRestaurant });
    } catch (error) {
      console.error('Error creating restaurant:', error);
      res.status(400).json({ message: error.message });
    }
  });
};

// Update restaurant details with optional multiple image uploads
exports.updateRestaurant = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;  // Enable handling multiple files

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parsing error" });

    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

      // Update fields as before
      restaurant.name = fields.name ? cleanField(fields.name[0]) : restaurant.name;
      restaurant.owner_id = fields.owner_id ? cleanField(fields.owner_id[0]) : restaurant.owner_id;
      restaurant.menu_id = fields.menu_id ? JSON.parse(cleanField(fields.menu_id[0])) : restaurant.menu_id;
      restaurant.gst_number = fields.gst_number ? cleanField(fields.gst_number[0]) : restaurant.gst_number;
      restaurant.fssai_number = fields.fssai_number ? cleanField(fields.fssai_number[0]) : restaurant.fssai_number;
      restaurant.address_id = fields.address_id ? cleanField(fields.address_id[0]) : restaurant.address_id;
      restaurant.operating_hours = fields.operating_hours ? JSON.parse(cleanField(fields.operating_hours[0])) : restaurant.operating_hours;
      restaurant.delivery_time_estimate = fields['delivery_time_estimate\t'] ? cleanField(fields['delivery_time_estimate\t'][0]) : restaurant.delivery_time_estimate;

      const new_image_urls = [];

      if (files.image) {
        const images = Array.isArray(files.image) ? files.image : [files.image];
        
        for (const image of images) {
          if (image.filepath) {
            const result = await cloudinary.uploader.upload(image.filepath, { folder: 'restaurant_images' });
            new_image_urls.push(result.secure_url);
          }
        }
      }

      // Append new images to the existing image_urls array
      restaurant.image_urls = restaurant.image_urls.concat(new_image_urls);

      const updatedRestaurant = await restaurant.save();
      res.status(200).json({ success: true, message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      res.status(500).json({ message: error.message });
    }
  });
};


// Update restaurant details with optional multiple image uploads
exports.updateRestaurant = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;  // Enable handling multiple files

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Form parsing error" });

    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

      // Update fields as before
      restaurant.name = fields.name ? cleanField(fields.name[0]) : restaurant.name;
      restaurant.owner_id = fields.owner_id ? cleanField(fields.owner_id[0]) : restaurant.owner_id;
      restaurant.menu_id = fields.menu_id ? JSON.parse(cleanField(fields.menu_id[0])) : restaurant.menu_id;
      restaurant.gst_number = fields.gst_number ? cleanField(fields.gst_number[0]) : restaurant.gst_number;
      restaurant.fssai_number = fields.fssai_number ? cleanField(fields.fssai_number[0]) : restaurant.fssai_number;
      restaurant.address_id = fields.address_id ? cleanField(fields.address_id[0]) : restaurant.address_id;
      restaurant.operating_hours = fields.operating_hours ? JSON.parse(cleanField(fields.operating_hours[0])) : restaurant.operating_hours;
      restaurant.delivery_time_estimate = fields['delivery_time_estimate\t'] ? cleanField(fields['delivery_time_estimate\t'][0]) : restaurant.delivery_time_estimate;

      const new_image_urls = [];

      // Check if new images are uploaded
      if (files.image) {
        const images = Array.isArray(files.image) ? files.image : [files.image];
        
        for (const image of images) {
          if (image.filepath) {
            const result = await cloudinary.uploader.upload(image.filepath, { folder: 'restaurant_images' });
            new_image_urls.push(result.secure_url);
          }
        }
      }

      // Option 1: Append new images to the existing images
      restaurant.image_urls = restaurant.image_urls.concat(new_image_urls);

      // Option 2: Replace existing images with the new ones
      // restaurant.image_urls = new_image_urls;

      const updatedRestaurant = await restaurant.save();
      res.status(200).json({ success: true, message: 'Restaurant updated successfully', restaurant: updatedRestaurant });
    } catch (error) {
      console.error('Error updating restaurant:', error);
      res.status(500).json({ message: error.message });
    }
  });
};


// Delete a restaurant by ID
exports.deleteRestaurant = async (req, res) => {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deletedRestaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search for restaurants by name, address, price range, and rating
exports.searchRestaurants = async (req, res) => {
  try {
    const { name, minPrice, maxPrice, minRating } = req.query;
    let searchCriteria = {};

    if (name) searchCriteria.name = { $regex: name, $options: 'i' };
    if (minRating) searchCriteria.overall_rating = { $gte: minRating };

    let restaurants = await Restaurant.find(searchCriteria);

    if (minPrice || maxPrice) {
      const dishes = await Dish.find({
        restaurant_id: { $in: restaurants.map(r => r._id) },
        price: { $gte: minPrice || 0, $lte: maxPrice || Infinity }
      });
      const filteredRestaurantIds = dishes.map(dish => dish.restaurant_id.toString());
      restaurants = restaurants.filter(r => filteredRestaurantIds.includes(r._id.toString()));
    }

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
