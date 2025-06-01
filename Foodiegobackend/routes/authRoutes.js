const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// ✅ Register User (Customer/Admin)
router.post("/register", async (req, res) => {
    console.log("📥 Incoming /register payload:", req.body);

    const { name, email, password, role } = req.body;

    try {
        const newUser = new User({
            name,
            email,
            password, // ✅ RAW password only — will be hashed by pre-save hook
            role: role || "customer"
        });

        await newUser.save();

        // 🧪 DEBUG: Confirm password is hashed in DB
        const savedUser = await User.findOne({ email });
        console.log("🧠 Saved user in DB (after hashing):", savedUser);

        res.status(201).json({ message: "User registered successfully", role: newUser.role });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        res.status(400).json({ error: err.message });
    }
});

// ✅ Login User
router.post("/login", async (req, res) => {
    console.log("🔐 Login request body:", req.body);
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        console.log("🔍 Comparing password:", password, "vs", user.password);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("✅ Password match result:", isMatch);

        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ message: "Login successful", token, role: user.role, name: user.name, userId: user._id});
    } catch (err) {
        console.error("❌ Error during login:", err);
        res.status(500).json({ error: err.message });
    }
});``

module.exports = router;
