const DiscountOffer = require('../models/discountOfferModel');
const SpecialOffers = require('../models/specialOffersModel');

// Create a new discount offer
exports.createDiscountOffer = async (req, res) => {
    const { restaurant_id, dish_id, promotion_code, discount_amount, validity, minimum_order_value, conditions } = req.body;

    try {
        // Check if a promotion code already exists
        const existingDiscount = await DiscountOffer.findOne({ promotion_code });
        if (existingDiscount) {
            return res.status(400).json({ success: false, message: 'Promotion code already exists' });
        }

        // Create the new discount offer
        const newDiscount = new DiscountOffer({
            restaurant_id,
            dish_id,
            promotion_code,
            discount_amount,
            validity,
            minimum_order_value,
            conditions
        });

        await newDiscount.save();
        res.status(201).json({ success: true, message: 'Discount offer created successfully', discount: newDiscount });
    } catch (error) {
        console.error('Error creating discount offer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update a discount offer
exports.updateDiscountOffer = async (req, res) => {
    const { discount_id } = req.params;
    const updates = req.body;

    try {
        const updatedDiscount = await DiscountOffer.findByIdAndUpdate(discount_id, updates, { new: true });

        if (!updatedDiscount) {
            return res.status(404).json({ success: false, message: 'Discount offer not found' });
        }

        res.status(200).json({ success: true, message: 'Discount offer updated successfully', discount: updatedDiscount });
    } catch (error) {
        console.error('Error updating discount offer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete a discount offer
exports.deleteDiscountOffer = async (req, res) => {
    const { discount_id } = req.params;

    try {
        const deletedDiscount = await DiscountOffer.findByIdAndDelete(discount_id);

        if (!deletedDiscount) {
            return res.status(404).json({ success: false, message: 'Discount offer not found' });
        }

        res.status(200).json({ success: true, message: 'Discount offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting discount offer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Create a new special offer
exports.createSpecialOffer = async (req, res) => {
    const { dish_id, description, discount_percentage, valid_from, valid_until } = req.body;

    try {
        const newOffer = new SpecialOffers({
            dish_id,
            description,
            discount_percentage,
            valid_from,
            valid_until
        });

        await newOffer.save();
        res.status(201).json({ success: true, message: 'Special offer created successfully', offer: newOffer });
    } catch (error) {
        console.error('Error creating special offer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update a special offer
exports.updateSpecialOffer = async (req, res) => {
    const { offer_id } = req.params;
    const updates = req.body;

    try {
        const updatedOffer = await SpecialOffers.findByIdAndUpdate(offer_id, updates, { new: true });

        if (!updatedOffer) {
            return res.status(404).json({ success: false, message: 'Special offer not found' });
        }

        res.status(200).json({ success: true, message: 'Special offer updated successfully', offer: updatedOffer });
    } catch (error) {
        console.error('Error updating special offer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Delete a special offer
exports.deleteSpecialOffer = async (req, res) => {
    const { offer_id } = req.params;

    try {
        const deletedOffer = await SpecialOffers.findByIdAndDelete(offer_id);

        if (!deletedOffer) {
            return res.status(404).json({ success: false, message: 'Special offer not found' });
        }

        res.status(200).json({ success: true, message: 'Special offer deleted successfully' });
    } catch (error) {
        console.error('Error deleting special offer:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Apply a promotion code
exports.applyPromotionCode = async (req, res) => {
    const { promotion_code, order_total } = req.body;

    try {
        const discount = await DiscountOffer.findOne({
            promotion_code,
            'validity.start_date': { $lte: new Date() },
            'validity.end_date': { $gte: new Date() }
        });

        if (!discount || (discount.minimum_order_value && order_total < discount.minimum_order_value)) {
            return res.status(400).json({ success: false, message: 'Invalid promotion code or minimum order value not met' });
        }

        const discountAmount = discount.discount_amount;
        const finalTotal = order_total - discountAmount;

        res.status(200).json({ success: true, message: 'Promotion applied successfully', discountAmount, finalTotal });
    } catch (error) {
        console.error('Error applying promotion code:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
