import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

const CagedPets = () => {

    let navigate = useNavigate(); 

    const [cagedPets, setCagedPets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCagedPets = async () => {
            try {
                const response = await axios.get("http://localhost:3001/cagedPets_api/get_all_pets");
                setCagedPets(response.data);
            } catch (error) {
                console.error("Error fetching caged pets:", error);
            }
        };

        fetchCagedPets();
    }, []);

    const handleEdit = (petId) => {
        let path = `/AdminDashboard/editcagedpets/${petId}`; 
        navigate(path);
    };

    

    

    const handleDelete = async (petId) => {
        const shouldDelete = window.confirm("Are you sure you want to delete this pet?");
        if (shouldDelete) {
            try {
                await axios.delete(`http://localhost:3001/cagedPets_api/delete_pet/${petId}`);
                // Remove the deleted pet from the cagedPets state
                setCagedPets(cagedPets.filter(pet => pet._id !== petId));
            } catch (error) {
                console.error("Error deleting pet:", error);
            }
        }
    };

    const filteredCaggedPets = cagedPets.filter(pet => {
        return(
            pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.petType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.ownerContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.medicalHistory.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="searchBar">
            </div>
            <div className="buttonCollection">
                <input type="text" name="petSearch" id="petSearch" placeholder="Search" onChange={e => setSearchTerm(e.target.value)} value={searchTerm} />
                <button onClick={hanldeGenerateReport}>Print Report</button>
            </div>
            <table className="userDetailsTable" id="toPrint">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Owner Email</th>
                        <th>Owner Contact No</th>
                        <th>Medical History</th>
                        <th data-html2canvas-ignore="true"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCaggedPets.map(pet => (
                        <tr key={pet._id}>
                            <td>{pet.petName}</td>
                            <td>{pet.petType}</td>
                            <td>{pet.ownerEmail}</td>
                            <td>{pet.ownerContact}</td>
                            <td>{pet.medicalHistory}</td>
                            <td data-html2canvas-ignore="true">
                                <button onClick={() => handleEdit(pet._id)}>Edit</button>
                                <button onClick={() => handleDelete(pet._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
     );
}
 
export default CagedPets;
