const mongoose = require('mongoose');
//add
const petSchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  ownerContact: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String,
    required: true
  }
});

const Pet = mongoose.model('cagedPet', petSchema);

module.exports = Pet;
