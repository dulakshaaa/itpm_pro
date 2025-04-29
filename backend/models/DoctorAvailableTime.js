const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, required: true },
    times: { type: String, required: true },

    
    // Add other fields as needed
});

module.exports = mongoose.model('DoctorAvailableTime', doctorSchema);
