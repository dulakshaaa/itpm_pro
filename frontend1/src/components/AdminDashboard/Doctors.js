import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [editableDoctorId, setEditableDoctorId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get("http://localhost:3001/doctor_api/doctors_get");
                setDoctors(response.data);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch doctors. Please try again.',
                });
                console.error("Error fetching doctors:", error);
            }
        };

        fetchDoctors();
    }, []);

    const handleEdit = (doctorId) => {
        setEditableDoctorId(doctorId);
    };

    const handleSave = async (doctorId) => {
        const doctorToUpdate = doctors.find((doctor) => doctor._id === doctorId);
        
        try {
            await axios.put(`http://localhost:3001/doctor_api/doctors_update/${doctorId}`, doctorToUpdate);
            
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Doctor information has been updated.',
                timer: 1500,
                showConfirmButton: false
            });

            setEditableDoctorId(null);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Unable to update doctor information. Please try again.',
                confirmButtonText: 'OK'
            });
            console.error("Error updating doctor:", error);
        }
    };

    const handleDelete = async (doctorId) => {
        // Show confirmation dialog before deleting
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this doctor profile?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3001/doctor_api/doctors_delete/${doctorId}`);
                    
                    // Remove the doctor from the local state
                    setDoctors(doctors.filter((doctor) => doctor._id !== doctorId));

                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Doctor profile has been deleted.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: 'Unable to delete doctor profile. Please try again.',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error deleting doctor:", error);
                }
            }
        });
    };
    
    const filteredDoctors = doctors.filter(doctor => {
        return(
            doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.doctorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.doctorContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.doctorAddress.toLowerCase().includes(searchTerm.toLowerCase())
        )
    });

    const handleGenerateReport = () => {
        // Add confirmation and success notification for report generation
        Swal.fire({
            title: 'Generating Report',
            text: 'Please wait while the report is being prepared...',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                
                html2canvas(document.getElementById('toPrint'), {backgroundColor: '#fff'}).then(canvas => {
                    let image = canvas.toDataURL('image/png')
                    let doc = new jsPDF('p', 'px', [1920, 1500])
                    doc.addImage(image, 'PNG', 50, 50, 1400, 400)
                    doc.save('doctors_report.pdf')
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Report Generated',
                        text: 'Your doctors report has been downloaded.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Report Generation Failed',
                        text: 'Unable to generate report. Please try again.',
                        confirmButtonText: 'OK'
                    });
                    console.error("Error generating report:", error);
                });
            }
        });
    }

    return (
        <>
            <div className="buttonCollection">
                <input 
                    type="text" 
                    name="doctorSearch" 
                    id="doctorSearch" 
                    placeholder="Search" 
                    onChange={e => setSearchTerm(e.target.value)} 
                    value={searchTerm} 
                    className="search-input"
                />
                <button 
                    onClick={() => {
                        let path = `/AdminDashboard/createDoctor`;
                        navigate(path);
                    }}
                    className="create-doctor-button"
                >
                    Create Doctor Account
                </button>
                <button 
                    onClick={handleGenerateReport}
                    className="report-button"
                >
                    Print Report
                </button>
            </div>
            <table className="userDetailsTable" id="toPrint">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact No</th>
                        <th>Specialty</th>
                        <th>Address</th>
                        <th data-html2canvas-ignore="true">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDoctors.map((doctor) => (
                        <tr key={doctor._id}>
                            <td>
                                {editableDoctorId === doctor._id ? (
                                    <input
                                        type="text"
                                        value={doctor.name || doctor.doctorName}
                                        onChange={(e) => {
                                            // Update the doctor's name in the state
                                            setDoctors((prevDoctors) => {
                                                return prevDoctors.map((prevDoctor) => {
                                                    if (prevDoctor._id === doctor._id) {
                                                        return { ...prevDoctor, name: e.target.value };
                                                    }
                                                    return prevDoctor;
                                                });
                                            });
                                        }}
                                    />
                                ) : (
                                    doctor.name || doctor.doctorName
                                )}
                            </td>
                            <td>
                                {editableDoctorId === doctor._id ? (
                                    <input
                                        type="email"
                                        value={doctor.email || doctor.doctorEmail}
                                        onChange={(e) => {
                                            // Update the doctor's email in the state
                                            setDoctors((prevDoctors) => {
                                                return prevDoctors.map((prevDoctor) => {
                                                    if (prevDoctor._id === doctor._id) {
                                                        return { ...prevDoctor, email: e.target.value };
                                                    }
                                                    return prevDoctor;
                                                });
                                            });
                                        }}
                                    />
                                ) : (
                                    doctor.email || doctor.doctorEmail
                                )}
                            </td>
                            <td>
                                {editableDoctorId === doctor._id ? (
                                    <input
                                        type="text"
                                        value={doctor.phoneNumber || doctor.doctorContact}
                                        onChange={(e) => {
                                            // Update the doctor's phone number in the state
                                            setDoctors((prevDoctors) => {
                                                return prevDoctors.map((prevDoctor) => {
                                                    if (prevDoctor._id === doctor._id) {
                                                        return { ...prevDoctor, phoneNumber: e.target.value };
                                                    }
                                                    return prevDoctor;
                                                });
                                            });
                                        }}
                                    />
                                ) : (
                                    doctor.phoneNumber || doctor.doctorContact
                                )}
                            </td>
                            <td>
                                {editableDoctorId === doctor._id ? (
                                    <input
                                        type="text"
                                        value={doctor.specialty || doctor.doctorSpecialty}
                                        onChange={(e) => {
                                            // Update the doctor's specialty in the state
                                            setDoctors((prevDoctors) => {
                                                return prevDoctors.map((prevDoctor) => {
                                                    if (prevDoctor._id === doctor._id) {
                                                        return { ...prevDoctor, specialty: e.target.value };
                                                    }
                                                    return prevDoctor;
                                                });
                                            });
                                        }}
                                    />
                                ) : (
                                    doctor.specialty || doctor.doctorSpecialty
                                )}
                            </td>
                            <td>
                                {editableDoctorId === doctor._id ? (
                                    <input
                                        type="text"
                                        value={doctor.address || doctor.doctorAddress}
                                        onChange={(e) => {
                                            // Update the doctor's address in the state
                                            setDoctors((prevDoctors) => {
                                                return prevDoctors.map((prevDoctor) => {
                                                    if (prevDoctor._id === doctor._id) {
                                                        return { ...prevDoctor, address: e.target.value };
                                                    }
                                                    return prevDoctor;
                                                });
                                            });
                                        }}
                                    />
                                ) : (
                                    doctor.address || doctor.doctorAddress
                                )}
                            </td>
                            <td data-html2canvas-ignore="true">
                                {editableDoctorId === doctor._id ? (
                                    <button 
                                        onClick={() => handleSave(doctor._id)}
                                        className="save-button"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleEdit(doctor._id)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button 
                                    onClick={() => handleDelete(doctor._id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Doctors;