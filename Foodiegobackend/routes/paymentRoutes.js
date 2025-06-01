const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { processOrderFromCart } = require('../utils/orderUtils');
const Order = require('../models/Order');
/*
// ✅ Stripe Webhook Handler Exported for use in server.js
const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.status(200).send('Webhook Received');

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;

    try {
      await processOrderFromCart(userId, session.metadata, session.amount_total, session.id);
      console.log("✅ Order processed from Stripe webhook",session);
    } catch (err) {
      console.error("❌ Error creating order from webhook:", err.message);
    }
  }
};*/

// ✅ Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  const { cartItems, userId, email, shippingAddress } = req.body;

  if (!userId || !cartItems || !shippingAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const line_items = cartItems.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      metadata: {
        userId: userId.toString(),
        ...shippingAddress
      },
      line_items,
      success_url: 'http://localhost:3000/order-success',
      cancel_url: 'http://localhost:3000/checkout',
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("❌ Stripe session creation failed:", err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
router.get('/my-orders/:userId', async (req, res) => {
  try {
    const rawOrders = await Order.find({ userId: req.params.userId });
    console.log('🟨 Raw Orders (Before Populate):', JSON.stringify(rawOrders, null, 2));

    const populatedOrders = await Order.find({ userId: req.params.userId }).populate('items.foodId');
    console.log('🟦 Populated Orders:', JSON.stringify(populatedOrders, null, 2));

    res.json(populatedOrders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});


router.get('/by-session/:sessionId', async (req, res) => {
  try {
    const order = await Order.findOne({ sessionId: req.params.sessionId });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = {
  router,
  webhookHandler, // 👈 this must be exported for use in server.js
};