import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const Pets = () => {
    const [pets, setPets] = useState([]);
    const [petOwners, setPetOwners] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get("http://localhost:3001/pet_api/get_pets");
                setPets(response.data);
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get("http://localhost:3001/user_api/allusers");
                setPetOwners(response.data);
            } catch (error) {
                console.error("Error fetching pets:", error);
            }
        };

        fetchPets();
    }, []);

    const handleDelete = async (petId) => {
        try {
            // Display confirmation dialog before deleting the pet
            const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
            if (!confirmDelete) {
                return; // If user cancels, do nothing
            }

            // If user confirms, proceed with deletion
            await axios.delete(`http://localhost:3001/pet_api/delete_pet/${petId}`);
            setPets(pets.filter((pet) => pet._id !== petId));
        } catch (error) {
            console.error("Error deleting pet:", error);
        }
    };

    const filteredPets = pets.filter(pet => {

        const petowner = petOwners.filter( owner => (owner._id == pet.owner))

        return(
            pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.age == parseInt(searchTerm) ||
            petowner[0].fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const hanldeGenerateReport = () => {
        html2canvas(document.getElementById('toPrint'), {backgroundColor: '#000'}).then(canvas => {
            let image = canvas.toDataURL('image/png')
            let doc = new jsPDF('p', 'px', [1920,1500])
            doc.addImage(image, 'PNG', 50, 50, 1400, 400)
            doc.save()
        })
    }

    return (
        <>
            <div className="searchBar"></div>
            <div className="buttonCollection">
                <input type="text" name="petSearch" id="petSearch" placeholder="Search" onChange={e => setSearchTerm(e.target.value)} value={searchTerm}/>
                <button onClick={hanldeGenerateReport}>Print Report</button>
            </div>
            <table className="userDetailsTable" id="toPrint">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Species</th>
                        <th>Age</th>
                        <th>Owner</th>
                        <th data-html2canvas-ignore="true"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPets.map((pet) => (
                        <tr key={pet._id}>
                            <td>{pet.name}</td>
                            <td>{pet.species}</td>
                            <td>{pet.age}</td>
                            <td>{petOwners.map( owner => (owner._id == pet.owner ? owner.fullName : ""))}</td>
                            <td data-html2canvas-ignore="true"><button onClick={() => handleDelete(pet._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Pets;
