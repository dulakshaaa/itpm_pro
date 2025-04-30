const mongoose = require('mongoose');
//add mongoose schema for caged pet records with medical history

const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
