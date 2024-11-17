const Category = require('../models/categoriesModel');
const Dish = require('../models/dishModel');
const Menu = require('../models/menuModel');

// Retrieve all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve categories', error });
  }
};

// Create a new category (Admin only)
// Create one or more categories (Admin only)
exports.createCategory = async (req, res) => {
    try {
      const categories = req.body;
  
      // Check if it's an array of categories
      if (Array.isArray(categories)) {
        // Check if any of the category names already exist
        const existingCategories = await Category.find({
          name: { $in: categories.map(cat => cat.name) }
        });
  
        if (existingCategories.length > 0) {
          return res.status(400).json({ message: 'Some categories already exist.' });
        }
  
        // Insert multiple categories
        const newCategories = await Category.insertMany(categories);
        return res.status(201).json({ message: 'Categories created successfully', newCategories });
      }
  
      // If it's a single category object, handle it as before
      const { name, description } = categories;
  
      // Check if the category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }
  
      const category = new Category({ name, description });
      await category.save();
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category', error });
    }
  };
  

// Update a category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, description, updated_at: Date.now() },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

// Delete a category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};

// Retrieve dishes by category
exports.getDishesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const dishes = await Dish.find({ category_id: categoryId }).populate("");    ;
    
    if (!dishes.length) {
      return res.status(404).json({ message: 'No dishes found for this category' });
    }
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve dishes by category', error });
  }
};

// Retrieve menus by category
exports.getMenusByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const menus = await Menu.find({ menu_category: categoryId });
    if (!menus.length) {
      return res.status(404).json({ message: 'No menus found for this category' });
    }
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve menus by category', error });
  }
};


exports.searchCategories = async (req, res) => {
  try {
      const { name } = req.query;

      // Name search (case insensitive)
      let searchCriteria = {};
      if (name) {
          searchCriteria.name = { $regex: name, $options: 'i' };
      }

      const categories = await Category.find(searchCriteria);

      res.status(200).json(categories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};