import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

const CreateMedicalRecord = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [medicalRecord, setMedicalRecord] = useState({
        FullName: '',
        date: '',
        diagnosis: '',
        treatment: ''
    });

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validate date field
        if (!medicalRecord.date.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Date is required!'
            });
            return;
        }

        // Validate other form fields
        if (!medicalRecord.FullName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Full Name is required!'
            });
            return;
        }
        if (!medicalRecord.diagnosis.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Diagnosis is required!'
            });
            return;
        }
        if (!medicalRecord.treatment.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Treatment is required!'
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/medicalRecord_api/add_record', medicalRecord);
            
            // Show success message using SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: response.data.message || 'Medical record created successfully!'
            });

            // Reset form fields after successful submission
            setMedicalRecord({
                FullName: '',
                date: '',
                diagnosis: '',
                treatment: ''
            });
            setSuccessMessage(response.data.message);
            setErrorMessage("");
        } catch (error) {
            console.error('Error adding medical record:', error);
            
            // Show error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to create medical record. Please try again.'
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicalRecord({ ...medicalRecord, [name]: value });
    };

    return (
        <div className="createForm">
            <h1>Create Medical Record</h1>
            {successMessage && <div className="successMessage" style={{ color: 'yellow' }}>{successMessage}</div>}
            {errorMessage && <div className="errorMessage" style={{ color: 'red' }}>{errorMessage}</div>}
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
                    <button type="submit">Create Record</button>
                </div>
            </form>
        </div>
    );
};

export default CreateMedicalRecord;