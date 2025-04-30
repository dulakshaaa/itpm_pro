const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment_controller');
//add appointment routes for CRUD operations
router.post('/appointments_add', appointmentController.createAppointment);
router.get('/appointments_get', appointmentController.getAllAppointments);
router.get('/appointments_getOne/:id', appointmentController.getAppointmentById);
router.put('/appointments_update/:id', appointmentController.updateAppointment);
router.delete('/appointments_delete/:id', appointmentController.deleteAppointment);
//implement CRUD routes for appointments with controller integration


module.exports = router;
