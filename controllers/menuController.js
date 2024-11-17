const Menu = require('../models/menuModel');
const Restaurant = require('../models/restaurantModel');

// Retrieve all menus for a specific restaurant
exports.getMenusByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const menus = await Menu.find({ restaurant_id: restaurantId });
        
        if (!menus.length) return res.status(404).json({ message: 'No menus found for this restaurant' });
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new menu (Admin/Owner)
exports.createMenu = async (req, res) => {
    const { menu_name, menu_description, menu_category, available_days,category_id  } = req.body;
    const restaurantId = req.params.restaurantId;

    // Ensure required fields are present
    if (!menu_name || !menu_category || !available_days || !available_days.length) {
        return res.status(400).json({ message: 'Menu name, category, and available days are required.' });
    }

    // Find the restaurant to ensure it exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
    }

    try {
        // Create a new menu document
        const newMenu = new Menu({
            menu_name,
            menu_description,
            menu_category,
            available_days,
            restaurant_id: restaurantId,
            category_id 
        });

        // Save the new menu
        const savedMenu = await newMenu.save();

        // Update the restaurant with the new menu_id
        restaurant.menu_id.push(savedMenu._id); // Push the new menu ID to the restaurant's menu_id array
        await restaurant.save(); // Save the restaurant document

        // Respond with the saved menu
        res.status(201).json(savedMenu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Update an existing menu (Admin/Owner)
exports.updateMenu = async (req, res) => {
    const menuId = req.params.menuId;
    const { menu_name, menu_description, menu_category, available_days, category_id } = req.body; // Accept category_id

    try {
        // Find the menu and update the fields
        const updatedMenu = await Menu.findByIdAndUpdate(menuId, {
            menu_name,
            menu_description,
            menu_category,
            available_days,
            category_id // Update category_id if provided
        }, { new: true });

        if (!updatedMenu) return res.status(404).json({ message: 'Menu not found' });
        res.status(200).json(updatedMenu);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a menu (Admin/Owner)
exports.deleteMenu = async (req, res) => {
    const menuId = req.params.menuId;

    try {
        const deletedMenu = await Menu.findByIdAndDelete(menuId);
        if (!deletedMenu) return res.status(404).json({ message: 'Menu not found' });
        res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
