const express = require('express');
const router = express.Router();
const cagedPetController = require('../controllers/cagedPet_controller');

// CRUD operations for patients
router
  .route('/pets')
  .post(cagedPetController.createPet)
  .get(cagedPetController.getAllPets);

router
  .route('/pets/:id')
  .get(cagedPetController.getPetById)
  .put(cagedPetController.updatePet)
  .delete(cagedPetController.deletePet);

module.exports = router;
