const Cart = require('../models/cartModel');
const Dish = require('../models/dishModel');

// Retrieve the current user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.user._id, status: 'active' }).populate('items.dish_id');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add an item to the cart
exports.addItemToCart = async (req, res) => {
  const { dish_id, quantity } = req.body;

  if (!dish_id || !quantity) {
    return res.status(400).json({ message: 'Dish ID and quantity are required' });
  }

  try {
    const dish = await Dish.findById(dish_id);
    if (!dish) return res.status(404).json({ message: 'Dish not found' });

    let cart = await Cart.findOne({ user_id: req.user._id, status: 'active' });

    if (!cart) {
      cart = new Cart({
        user_id: req.user._id,
        restaurant_id: dish.restaurant_id,
        items: [{ dish_id, restaurant_id: dish.restaurant_id, quantity, price: dish.price, total_price: quantity * dish.price }],
        subtotal: quantity * dish.price,
        delivery_fee: 50,  // Example delivery fee
        tax_amount: (quantity * dish.price) * 0.1,  // Example 10% tax
        total_amount: (quantity * dish.price) + 50 + ((quantity * dish.price) * 0.1)  // Subtotal + delivery fee + tax
      });
    } else {
      // Check if the dish is from the same restaurant
      if (cart.restaurant_id.toString() !== dish.restaurant_id.toString()) {
        return res.status(400).json({ message: 'All items must be from the same restaurant' });
      }

      const itemIndex = cart.items.findIndex(item => item.dish_id.toString() === dish_id);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].total_price += quantity * dish.price;
      } else {
        cart.items.push({ dish_id, restaurant_id: dish.restaurant_id, quantity, price: dish.price, total_price: quantity * dish.price });
      }

      cart.subtotal += quantity * dish.price;
      cart.tax_amount = cart.subtotal * 0.1;
      cart.total_amount = cart.subtotal + cart.delivery_fee + cart.tax_amount;
    }

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an item in the cart
exports.updateCartItem = async (req, res) => {
  const { dish_id, quantity } = req.body;

  if (!dish_id || !quantity) {
    return res.status(400).json({ message: 'Dish ID and quantity are required' });
  }

  try {
    const cart = await Cart.findOne({ user_id: req.user._id, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.dish_id.toString() === dish_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const item = cart.items[itemIndex];
    const oldTotalPrice = item.total_price;
    item.quantity = quantity;
    item.total_price = quantity * item.price;

    cart.subtotal = cart.subtotal - oldTotalPrice + item.total_price;
    cart.tax_amount = cart.subtotal * 0.1;
    cart.total_amount = cart.subtotal + cart.delivery_fee + cart.tax_amount;

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an item from the cart
exports.deleteCartItem = async (req, res) => {
  const { dish_id } = req.body;

  if (!dish_id) {
    return res.status(400).json({ message: 'Dish ID is required' });
  }

  try {
    const cart = await Cart.findOne({ user_id: req.user._id, status: 'active' });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.dish_id.toString() === dish_id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const item = cart.items[itemIndex];
    cart.subtotal -= item.total_price;
    cart.items.splice(itemIndex, 1);
    cart.tax_amount = cart.subtotal * 0.1;
    cart.total_amount = cart.subtotal + cart.delivery_fee + cart.tax_amount;

    const updatedCart = await cart.save();
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
