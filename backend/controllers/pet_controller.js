// controllers/PetController.js
const Pet = require('../models/pet_model');

exports.addPet = async (req, res) => {
    try {
        const { name, species, age } = req.body;
        const newPet = new Pet({
            name,
            species,
            age,
            owner: req.user.userId // Assume user ID is extracted from JWT payload
        });
        const savedPet = await newPet.save();
        res.status(201).json(savedPet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPetsByOwner = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.user.userId });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await Pet.findById(id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, species, age } = req.body;
        const updatedPet = await Pet.findByIdAndUpdate(id, { name, species, age }, { new: true });
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPet = await Pet.findByIdAndDelete(id);
        if (!deletedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
