const Doctor = require('../models/doctor_model');
const DoctorAvailableTime = require('../models/DoctorAvailableTime');
const Appointment = require('../models/appointment_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Create doctor
const createDoctor = async (req, res) => {
    try {
        const {
            doctorName,
            doctorEmail,
            doctorSpecialty,
            doctorContact,
            doctorAddress,
            doctorPassword
        } = req.body;

        const newDoctor = new Doctor({
            doctorName,
            doctorEmail,
            doctorSpecialty,
            doctorContact,
            doctorAddress,
            doctorPassword
        });

        await newDoctor.save();

        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create doctor',
            error: error.message
        });
    }
};


//doctor login

const loginDoctor = async (req, res) => {
    try {
        const { doctorEmail, doctorPassword } = req.body;

        // Check if doctor with given email exists
        const doctor = await Doctor.findOne({ doctorEmail });
        if (!doctor) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Directly compare the plain text passwords
        if (doctorPassword !== doctor.doctorPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ doctorId: doctor._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get appointment for logged doctor

const getDoctorAppointments = async (req, res) => {
    try {
        // Assuming you're using doctor's name; change to _id or another identifier as needed
        const doctorName = req.doctor.name; 

        // Fetch appointments from the database where doctorName matches the logged-in doctor's name
        const appointments = await Appointment.find({ doctorName });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//accept the appointment

const acceptAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        // Check if the appointment exists
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update the status to "accepted"
        appointment.status = 'accepted';

        // Save the updated appointment
        await appointment.save();

        res.json({ message: 'Appointment accepted successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Read all doctors
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update doctor details
const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const { doctorName, doctorEmail, doctorSpecialty, doctorContact, doctorAddress} = req.body;
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, { doctorName, doctorEmail, doctorSpecialty, doctorContact, doctorAddress }, { new: true });
        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(204).send(); // 204: No Content, successful deletion
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete doctor',
            error: error.message
        });
    }
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const addAvailableTime = async (req, res) => {
    try {
        const { doctorName, doctorSpecialty, times } = req.body;

        // Create a new instance of DoctorAvailableTime
        const newAvailableTime = new DoctorAvailableTime({ doctorName, doctorSpecialty, times });

        // Save the new available time
        await newAvailableTime.save();

        res.status(201).json({ message: "Available time added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getDoctorAvailableTimesByName = async (req, res) => {
    try {
        const { doctorName } = req.params;
        const doctorAvailableTimes = await DoctorAvailableTime.find({ doctorName });
        if (!doctorAvailableTimes) {
            return res.status(404).json({ message: "Doctor available times not found" });
        }
        res.json(doctorAvailableTimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAvailableTimes = async (req, res) => {
    try {
        const availableTimes = await DoctorAvailableTime.find();
        res.json(availableTimes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDoctorAvailableTime = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAvailableTime = await DoctorAvailableTime.findByIdAndDelete(id);
        if (!deletedAvailableTime) {
            return res.status(404).json({ message: "Doctor available time not found" });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDoctor,
    loginDoctor,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    addAvailableTime,
    getDoctorAvailableTimesByName,
    getDoctorAppointments,
    acceptAppointment,
    getAllAvailableTimes,
    deleteDoctorAvailableTime
};
