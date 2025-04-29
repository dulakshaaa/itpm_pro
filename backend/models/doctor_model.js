// models/Doctor.js

const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    doctorEmail: {
        type: String,
        required: true,
        unique: true
    },
    doctorContact: {
        type: String,
        required: true
    },
    doctorSpecialty: {
        type: String,
        required: true
    },
    doctorAddress: {
        type: String,
        required: true
    },
    doctorPassword: {
        type: String,
        required: true
    }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
