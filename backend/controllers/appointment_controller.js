const Appointment = require('../models/appointment_model');

exports.createAppointment = async (req, res) => {
    try {
        const newAppointment = await Appointment.create(req.body);
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        // Optional filtering by query parameters (e.g., date, doctorId)
        const filters = {};
        if (req.query.date) {
            filters.date = req.query.date;
        }
        if (req.query.doctorId) {
            filters.doctorId = req.query.doctorId;
        }

        const appointments = await Appointment.find(filters);

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments,
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

