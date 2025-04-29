const MedicalRecord = require('../models/mrecord_model');

// Create a new medical record
const createMedicalRecord = async (req, res) => {
  try {
    const { FullName, date, diagnosis, treatment } = req.body;
    const newMedicalRecord = new MedicalRecord({ FullName, date, diagnosis, treatment });
    await newMedicalRecord.save();
    res.status(201).json(newMedicalRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read all medical records
const getAllMedicalRecords = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find();
    res.json(medicalRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get one medical record
const getSingleMedicalRecord = async (req, res) => {
  try {
    const medicalRecordId = req.params.id;
    const singleMedicalRecords = await MedicalRecord.findById(medicalRecordId);
    res.json(singleMedicalRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a medical record
const updateMedicalRecord = async (req, res) => {
  try {
    const medicalRecordId = req.params.id;
    const { FullName, date, diagnosis, treatment } = req.body;
    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate(
      medicalRecordId,
      { FullName, date, diagnosis, treatment },
      { new: true }
    );
    if (!updatedMedicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.json(updatedMedicalRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a medical record
const deleteMedicalRecord = async (req, res) => {
  try {
    const medicalRecordId = req.params.id;
    const deletedMedicalRecord = await MedicalRecord.findByIdAndDelete(medicalRecordId);
    if (!deletedMedicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedicalRecord,
  getAllMedicalRecords,
  updateMedicalRecord,
  deleteMedicalRecord,
  getSingleMedicalRecord,
};
