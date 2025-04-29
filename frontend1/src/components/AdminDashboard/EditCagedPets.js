import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditCagedPets = () => {

  const { cagedpetid } = useParams();
  
  const [petData, setPetData] = useState({
    petName: '',
    petType: '',
    ownerEmail: '',
    ownerContact: '',
    medicalHistory: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const getAllPets = async () => {
      try{
        const response = await axios.get(`http://localhost:3001/cagedPets_api/get_pet/${cagedpetid}`);
        setPetData(response.data)
      } catch (error){
        console.error('Error adding pet:', error);
      }
    }
    getAllPets()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetData({ ...petData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/cagedPets_api/update_pet/${cagedpetid}`, petData);
      setSuccessMessage(response.data.message);
      // Reset form fields after successful submission
      setPetData({
        petName: '',
        petType: '',
        ownerEmail: '',
        ownerContact: '',
        medicalHistory: ''
      });
    } catch (error) {
      console.error('Error adding pet:', error);
    }
  };

  return (
    <div className="createForm">
      <h1>Pet Details</h1>
      {successMessage && <div className="successMessage" style={{color: 'yellow'}}>{successMessage}</div>}
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
          <button type="submit">Update Pet</button>
        </div>
      </form>
    </div>
  );
};

export default EditCagedPets;
