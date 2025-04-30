const mongoose = require('mongoose');
 //create Pet schema with user reference and basic validations
const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    species: { type: String, required: true },
    age: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Pet', petSchema);
