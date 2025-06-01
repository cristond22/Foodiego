const express = require("express");
const router = express.Router();
const Food = require("../models/Food"); // Ensure Food model exists

// GET all foods
router.get("/", async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST add a new food
// POST add a new food
router.post("/", async (req, res) => {
    const { name, description, price, stock, image } = req.body;
    try {
        const newFood = new Food({ name, description, price, stock, image });
        await newFood.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// PUT update food
router.put("/:id", async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE food
router.delete("/:id", async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: "Food deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
