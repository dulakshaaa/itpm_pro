import React, { useState } from "react";
import axios from "axios";

const CreatePet = () => {
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        age: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        let errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Pet name is required';
        }
        if (!formData.species.trim()) {
            errors.species = 'Species is required';
        }
        if (!formData.age) {
            errors.age = 'Age is required';
        } else if (formData.age < 1 || formData.age > 20) {
            errors.age = 'Age must be between 1 and 20';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post('http://localhost:3001/pet_api/add_pets', formData, config); // Update URL as needed
            console.log(response.data);
            alert('pet added successfully');
            window.location.href='http://localhost:3000/Client/createPet';
            // Handle post submit logic, like showing a success message or redirecting
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    

    return ( 
        <div className="createPetForm">
            <div className="formContainer">
                <h1>Create Pet Account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <label htmlFor="name">Pet Name </label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.name && <span className="error" style={{color:"red"}}>{validationErrors.name}</span>}
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="species">Species </label>
                        <input 
                            type="text" 
                            name="species" 
                            id="species" 
                            value={formData.species}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.species && <span className="error" style={{color:"red"}}>{validationErrors.species}</span>}
                    </div>
                    <div className="inputContainer">
                        <label htmlFor="age">Age </label>
                        <input 
                            type="number" 
                            name="age" 
                            id="age" 
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                            
                        />
                        {validationErrors.age && <span className="error" style={{color:"red"}}>{validationErrors.age}</span>}
                    </div>
                    <div className="submitButton">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
     );
}
 
export default CreatePet;
