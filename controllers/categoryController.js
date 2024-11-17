const Category = require('../models/categoriesModel');

// Search for categories by name
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
