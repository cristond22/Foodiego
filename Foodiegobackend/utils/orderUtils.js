// utils/orderUtils.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Food = require('../models/Food');

async function processOrderFromCart(userId, metadata, stripeAmount,sessionId) {
    console.log('Looking for cart with userId:', userId);
    const allCarts = await Cart.find();
console.log(JSON.stringify(allCarts, null, 2))
    const cart = await Cart.findOne({ userId }).populate('items.foodId');
    console.log('Cart contents:', cart);
    if (!cart || cart.items.length === 0) {
      console.log('Cart empty or no cart found, throwing error');
      throw new Error('Cart is empty');
    }
  
    let totalAmount = 0;
    for (let item of cart.items) {
      console.log(`Ordering item: ${item.foodId.name}, Quantity: ${item.quantity}`);
      console.log('Checking stock for:', item.foodId.name);
      if (item.foodId.stock < item.quantity) {
        console.log('Insufficient stock for:', item.foodId.name);
        throw new Error(`${item.foodId.name} is out of stock`);
      }
      totalAmount += item.foodId.price * item.quantity;
      item.foodId.stock -= item.quantity;
      await item.foodId.save();
    }
  
    const   orderItems = cart.items.map(item => ({
      foodId: item.foodId._id,
      quantity: item.quantity,
      price: item.foodId.price
    }));
  
    const order = new Order({
      userId,
      items: orderItems,
      status: 'completed',
      shippingAddress: {
      name: metadata.name,
      address: metadata.address,
      city: metadata.city,
      zipCode: metadata.zipCode,
      country: metadata.country,
      phone: metadata.phone,
    },
    paymentDetails: {
      method: 'Stripe',
      amount: stripeAmount / 100, // Stripe amount is in paise
    },
    totalAmount: stripeAmount / 100,
    sessionId,  // ← From Stripe session
  });
  
    console.log('Saving order...');
    await order.save();
  
    console.log('Deleting cart for user:', userId);
    await Cart.findOneAndDelete({ userId });
  
    return order;
  }
  

module.exports = { processOrderFromCart };
