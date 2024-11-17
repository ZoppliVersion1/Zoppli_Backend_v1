const Address = require('../models/addressModel');

// Retrieve addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.user._id;  // Assuming the user is authenticated
    const addresses = await Address.find({ user_id: userId });
    res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving addresses', error });
  }
};

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id;  // Assuming the user is authenticated
    const newAddress = new Address({ ...req.body, user_id: userId });
    const savedAddress = await newAddress.save();
    res.status(201).json({ success: true, data: savedAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding address', error });
  }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;  // Assuming the user is authenticated

    // Check if the address belongs to the user
    const address = await Address.findOne({ _id: addressId, user_id: userId });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating address', error });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user._id;  // Assuming the user is authenticated

    // Check if the address belongs to the user
    const address = await Address.findOne({ _id: addressId, user_id: userId });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Delete the address
    await Address.findByIdAndDelete(addressId);
    res.status(200).json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting address', error });
  }
};
