import React, { useState } from 'react';
import axios from 'axios';

const AddPetForm = () => {
  const [petData, setPetData] = useState({
    petName: '',
    petType: '',
    ownerEmail: '',
    ownerContact: '',
    medicalHistory: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validations
    if (!petData.petName.trim()) {
      setErrorMessage('Please enter the pet name.');
      return;
    }
    if (!petData.petType.trim()) {
      setErrorMessage('Please enter the pet type.');
      return;
    }
    if (!petData.ownerEmail.trim() || !isValidEmail(petData.ownerEmail)) {
      setErrorMessage('Please enter a valid email address for the owner.');
      return;
    }
    if (!petData.ownerContact.trim() || !isValidPhoneNumber(petData.ownerContact)) {
      setErrorMessage('Please enter a valid phone number for the owner.');
      return;
    }
    if (!petData.medicalHistory.trim()) {
      setErrorMessage('Please enter the medical history.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/cagedPets_api/add_pet', petData);
      console.log(response.data);
      // Reset form fields after successful submission
      setPetData({
        petName: '',
        petType: '',
        ownerEmail: '',
        ownerContact: '',
        medicalHistory: ''
      });
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error('Error adding pet:', error);
      }
    }
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Function to validate phone number format
  const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };

  return (
    <div className="createForm">
      <h1>Pet Details</h1>
      {errorMessage && <div className="errorMessage">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="createFormInput">
          <label htmlFor="petName">Pet Name:</label>
          <input
            type="text"
            name="petName"
            id="petName"
            value={petData.petName}
            onChange={handleChange}
          />
        </div>
        <div className="createFormInput">
          <label htmlFor="petType">Pet Type:</label>
          <input
            type="text"
            name="petType"
            id="petType"
            value={petData.petType}
            onChange={handleChange}
          />
        </div>
        <div className="createFormInput">
          <label htmlFor="ownerEmail">Owner's Email:</label>
          <input
            type="email"
            name="ownerEmail"
            id="ownerEmail"
            value={petData.ownerEmail}
            onChange={handleChange}
          />
        </div>
        <div className="createFormInput">
          <label htmlFor="ownerContact">Owner's Contact No:</label>
          <input
            type="text"
            name="ownerContact"
            id="ownerContact"
            value={petData.ownerContact}
            onChange={handleChange}
          />
        </div>
        <div className="createFormInput">
          <label htmlFor="medicalHistory">Medical History:</label>
          <textarea
            name="medicalHistory"
            id="medicalHistory"
            value={petData.medicalHistory}
            onChange={handleChange}
          />
        </div>
        <div className="createFormSubmit">
          <button type="submit">Add Pet</button>
        </div>
      </form>
      <style jsx>{`
        .errorMessage {
          color: yellow;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default AddPetForm;
