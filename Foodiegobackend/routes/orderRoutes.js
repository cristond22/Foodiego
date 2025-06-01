// routes/orderRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { processOrderFromCart } = require('../utils/orderUtils');
const Order = require('../models/Order'); 
const router = express.Router();

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
};

// ✅ Crea

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


// ✅ My Orders Route (fetch orders by user)

module.exports = router;
