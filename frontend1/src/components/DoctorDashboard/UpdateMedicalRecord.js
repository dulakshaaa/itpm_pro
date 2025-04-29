import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

const UpdateMedicalRecord = () => {
    let navigate = useNavigate(); 

    const [successMessage, setSuccessMessage] = useState("");
    const [medicalRecord, setMedicalRecord] = useState({
        FullName: '',
        date: '',
        diagnosis: '',
        treatment: ''
    })

    const { recordID } = useParams()

    const handleFormSubmit = async (e) => {
        e.preventDefault(); // Add preventDefault to prevent default form submission

        // Validate form fields
        const { FullName, date, diagnosis, treatment } = medicalRecord;

        if (!FullName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Full Name is required!'
            });
            return;
        }

        if (!date) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Date is required!'
            });
            return;
        }

        if (!diagnosis.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Diagnosis is required!'
            });
            return;
        }

        if (!treatment.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Treatment is required!'
            });
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3001/medicalRecord_api/update_record/${recordID}`, medicalRecord)
            
            // Show success message using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message || 'Medical record updated successfully!'
            });

            // Reset form fields after successful submission
            setMedicalRecord({
                FullName: '',
                date: '',
                diagnosis: '',
                treatment: ''
            });
            
            // Navigate back to medical records list
            navigate("/DoctorDashboard/MedicalRecords");
        } catch (error) {
            console.error("Update medical record submit error ", error);
            
            // Show error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update medical record. Please try again.'
            });
        }
    }

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/medicalRecord_api/get_one_record/${recordID}`);
                setMedicalRecord(response.data)
            } catch (error) {
                console.error("Update medical record retrieve error", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to retrieve medical record!'
                });
            }
        }
        fetchRecords()
    }, [recordID])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setMedicalRecord({...medicalRecord, [name]:value })
    }
    
    return ( 
        <div className="createForm">
            <h1>Update Medical Record</h1>
            {successMessage && <div className="successMessage" style={{color: 'yellow'}}>{successMessage}</div>}
            <form onSubmit={handleFormSubmit}>
                <div className="createFormInput">
                    <label htmlFor="FullName">Full Name :</label>
                    <input type="text" id="FullName" name="FullName" value={medicalRecord.FullName} onChange={handleChange} />
                </div>
                <div className="createFormInput">
                    <label htmlFor="date">Date :</label>
                    <input type="date" id="date" name="date" value={medicalRecord.date} onChange={handleChange} />
                </div>
                <div className="createFormInput">
                    <label htmlFor="diagnosis">Diagnosis :</label>
                    <input type="text" id="diagnosis" name="diagnosis" value={medicalRecord.diagnosis} onChange={handleChange} />
                </div>
                <div className="createFormInput">
                    <label htmlFor="treatment">Treatment :</label>
                    <input type="text" id="treatment" name="treatment" value={medicalRecord.treatment} onChange={handleChange} />
                </div>
                <div className="createFormSubmit">
                    <button type="submit">Update Record</button>
                </div>
            </form>
        </div>
     );
}
 
export default UpdateMedicalRecord;