const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 }, // ✅ Added stock field
    image: { type: String, default: "https://via.placeholder.com/150" },
});

module.exports = mongoose.model("Food", FoodSchema);

