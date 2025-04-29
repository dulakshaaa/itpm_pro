const express = require('express');
const router = express.Router();
const petController = require('../controllers/cagedPet_controller');

// Routes for pets
router.post('/add_pet', petController.createPet);
router.get('/get_all_pets', petController.getAllPets);
router.get('/get_pet/:id', petController.getPetById);
router.put('/update_pet/:id', petController.updatePet);
router.delete('/delete_pet/:id', petController.deletePet);

module.exports = router;
