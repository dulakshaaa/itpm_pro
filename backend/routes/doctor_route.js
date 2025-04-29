const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor_controller');
const doctmiddleware =require('../middlewares/doctor_middleware')

// Routes for doctors
router.post('/doctors_add', doctorController.createDoctor);
router.post('/doctors_login', doctorController.loginDoctor);
router.get('/doctors_get', doctorController.getAllDoctors);
router.get('/get_appointments',doctmiddleware,doctorController.getDoctorAppointments);

router.get('/doctor_get/:id', doctorController.getDoctorById);
router.put('/doctors_update/:id', doctorController.updateDoctor);
router.delete('/doctors_delete/:id', doctorController.deleteDoctor);
router.post('/addAvailable_time', doctorController.addAvailableTime);
router.get('/doctor_available_times/:doctorName',doctorController.getDoctorAvailableTimesByName);
router.put('/appointments/accept/:appointmentId', doctorController.acceptAppointment);

router.get('/getAllTimes',doctorController.getAllAvailableTimes);
router.delete('/delete/:id',doctorController.deleteDoctorAvailableTime);

module.exports = router;
