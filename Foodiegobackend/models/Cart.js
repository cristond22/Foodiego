const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }]
});

module.exports = mongoose.model('Cart', CartSchema);
