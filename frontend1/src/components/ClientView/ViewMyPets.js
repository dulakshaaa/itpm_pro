import React, { useState, useEffect } from "react";
import axios from "axios";

const UserPets = () => {
    const [userPets, setUserPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editPetId, setEditPetId] = useState(null);

    useEffect(() => {
        const fetchUserPets = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get("http://localhost:3001/pet_api/getmy_pets", config);
                setUserPets(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user pets:", error);
                setLoading(false);
            }
        };
        fetchUserPets();
    }, []);

    const handleEdit = (petId) => {
        setEditPetId(petId);
    };

    const handleSave = async (petId) => {
        const updatedPet = userPets.find(pet => pet._id === petId);
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:3001/pet_api/update_pets/${petId}`, updatedPet, config);
            setEditPetId(null);
        } catch (error) {
            console.error("Error updating pet:", error);
        }
    };

    const handleInputChange = (e, petId, field) => {
        const updatedUserPets = userPets.map(pet => {
            if (pet._id === petId) {
                return {
                    ...pet,
                    [field]: e.target.value
                };
            }
            return pet;
        });
        setUserPets(updatedUserPets);
    };

    const handleDelete = async (petId) => {
        if (window.confirm("Are you sure you want to delete this pet?")) {
            try {
                const token = localStorage.getItem("token");
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.delete(`http://localhost:3001/pet_api/delete_pet/${petId}`, config);
                setUserPets(userPets.filter(pet => pet._id !== petId));
            } catch (error) {
                console.error("Error deleting pet:", error);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return ( 
        <div className="createPetForm">
            <div className="formContainer">
                <h1>User Pets</h1>
                <table className="userDetailsTable">
                    <thead style={{color:'black'}}>
                        <tr>
                            <th>Name</th>
                            <th>Species</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{color:'black'}}>
                        {userPets.map(pet => (
                            <tr key={pet._id}>
                                <td>
                                    {editPetId === pet._id ? (
                                        <input 
                                            type="text" 
                                            value={pet.name} 
                                            onChange={(e) => handleInputChange(e, pet._id, 'name')} 
                                        />
                                    ) : (
                                        pet.name
                                    )}
                                </td>
                                <td>
                                    {editPetId === pet._id ? (
                                        <input 
                                            type="text" 
                                            value={pet.species} 
                                            onChange={(e) => handleInputChange(e, pet._id, 'species')} 
                                        />
                                    ) : (
                                        pet.species
                                    )}
                                </td>
                                <td>
                                    {editPetId === pet._id ? (
                                        <input 
                                            type="number" 
                                            value={pet.age} 
                                            onChange={(e) => handleInputChange(e, pet._id, 'age')} 
                                        />
                                    ) : (
                                        pet.age
                                    )}
                                </td>
                                <td>
                                    {editPetId === pet._id ? (
                                        <button onClick={() => handleSave(pet._id)}>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(pet._id)}>Edit</button>
                                            <button onClick={() => handleDelete(pet._id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserPets;
