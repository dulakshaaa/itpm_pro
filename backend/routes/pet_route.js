// routes/petRoutes.js
const express = require('express');
const router = express.Router();
const PetController = require('../controllers/pet_controller');
const authMiddleware = require('../middlewares/user_middleware');

// Routes for managing pets
router.post('/add_pets', authMiddleware, PetController.addPet);
router.get('/getmy_pets', authMiddleware, PetController.getPetsByOwner);
router.get('/getmy_pet/:id', authMiddleware, PetController.getPetById);
router.get('/get_pets', PetController.getAllPets);
router.put('/update_pets/:id', authMiddleware, PetController.updatePet);
router.delete('/delete_pets/:id', authMiddleware, PetController.deletePet);
router.delete('/delete_pet/:id', PetController.deletePet);

module.exports = router;
