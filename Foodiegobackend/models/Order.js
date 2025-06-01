const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true }
  }],
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  paymentDetails: {
    method: String,
    amount: Number,
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  sessionId: { type: String, unique: true, sparse: true } // `sparse` allows it to be optional
});

module.exports = mongoose.model('Order', OrderSchema);
