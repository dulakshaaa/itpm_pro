const Pet = require('../models/cagedPet_model');

const createPet = async (req, res) => {
  try {
    // Check if all cages are filled
    const occupiedCagesCount = await Pet.countDocuments({ caged: true });
    const totalCages = 3;
    if (occupiedCagesCount >= totalCages) {
      return res.status(400).json({ message: 'All cages are filled. Cannot add more pets.' });
    }

    // Proceed with creating the pet if there are available cages
    const pet = new Pet(req.body);
    await pet.save();
    res.status(201).json({ message: 'Pet created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Read all pets
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read a single pet by ID
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a pet by ID
const updatePet = async (req, res) => {
  try {
    const { petName, petType, ownerEmail, ownerContact, medicalHistory } = req.body;
    const pet = await Pet.findByIdAndUpdate(req.params.id, { petName, petType, ownerEmail, ownerContact, medicalHistory }, { new: true });
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a pet by ID
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPet,
  getAllPets,
  getPetById,
  updatePet,
  deletePet
};
