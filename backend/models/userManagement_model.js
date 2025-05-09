const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
    nationalIdentityCardNumber: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);
