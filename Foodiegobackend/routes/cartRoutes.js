const express = require('express');
const Cart = require('../models/Cart');
const Food = require('../models/Food');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ✅ GET current cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId');
        if (!cart) return res.status(200).json({ items: [] });
        res.json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Add to Cart
// ✅ Add to Cart with Quantity Fix
router.post('/add', authMiddleware, async (req, res) => {
    try {
        let { foodId, quantity } = req.body;
        quantity = parseInt(quantity, 10); // 👈 ensure it's a number

        console.log('🛒 Add to cart:', { userId: req.user.id, foodId, quantity });

        if (!foodId || !quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid foodId or quantity' });
        }

        const food = await Food.findById(foodId);
        if (!food || food.stock < quantity) {
            return res.status(400).json({ message: 'Item out of stock' });
        }

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ foodId, quantity });
        }

        await cart.save();
        await cart.populate('items.foodId');
        res.json(cart);
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    if (!foodId || quantity < 1) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Item not found in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.foodId');
    res.json(cart);
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Remove from Cart
router.post('/remove', authMiddleware, async (req, res) => {
    try {
        const { foodId } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) return res.status(400).json({ message: 'Cart is empty' });

        cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
        await cart.save();
        await cart.populate('items.foodId'); // ✅ Return populated cart again
        res.json(cart);
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;   


