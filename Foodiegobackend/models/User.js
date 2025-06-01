// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

env = require('dotenv');
env.config();

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
    type: String,
    enum: ["admin", "customer"], // ✅ Allow both roles
    default: "customer"
    }
    });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate JWT Token
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', UserSchema);

