const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/mrecord_controller');

// Routes for medical records
router.post('/add_record', medicalRecordController.createMedicalRecord);
router.get('/get_one_record/:id', medicalRecordController.getSingleMedicalRecord);
router.get('/get_all_records', medicalRecordController.getAllMedicalRecords);
router.put('/update_record/:id', medicalRecordController.updateMedicalRecord);
router.delete('/delete_record/:id', medicalRecordController.deleteMedicalRecord);

module.exports = router;
