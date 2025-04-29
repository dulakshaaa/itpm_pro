import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

const MedicalRecords = () => {
    let navigate = useNavigate(); 
    const [medicalRecords, setMedicalRecords] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const getAllMedicalRecords = async () => {
            try {
                const response = await axios.get("http://localhost:3001/medicalRecord_api/get_all_records")
                setMedicalRecords(response.data);
            } catch (error) {
                console.error("Error getting medical records", error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to fetch medical records!'
                });
            }
        }
        getAllMedicalRecords()
    }, [])

    const handleDeleteButton = async (recordID) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You won\'t be able to revert this!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`http://localhost:3001/medicalRecord_api/delete_record/${recordID}`)
                
                Swal.fire(
                    'Deleted!',
                    'Medical record has been deleted.',
                    'success'
                );

                // Navigate to DoctorDashboard after successful deletion
                navigate("/DoctorDashboard");
            }
        } catch (error) {
            console.error("Error deleting medical record", error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to delete medical record!'
            });
        }
    }

    const handleAddRecordButton = () => {
        navigate(`/DoctorDashboard/CreateMedicalRecord`)
    }

    const handleUpdateButton = (recordID) => {
        navigate(`/DoctorDashboard/UpdateMedicalRecord/${recordID}`)
    }

    const filteredRecords = medicalRecords.filter(record => {
        return (
            record.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.treatment.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })

    const handleGenerateReport = () => {
        html2canvas(document.getElementById('toPrint'), {backgroundColor: '#000'}).then(canvas => {
            let image = canvas.toDataURL('image/png')
            let doc = new jsPDF('p', 'px', [1920,1500])
            doc.addImage(image, 'PNG', 50, 50, 1400, 400)
            doc.save('medical_records_report.pdf')
        }).catch(error => {
            console.error("Error generating report", error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to generate report!'
            });
        })
    }

    return ( 
        <>
            <div className="searchBar">
            </div>
            <div className="buttonCollection">
                <input 
                    type="text" 
                    name="doctorSearch" 
                    id="doctorSearch" 
                    placeholder="Search" 
                    onChange={(e) => {setSearchTerm(e.target.value)}} 
                    value={searchTerm} 
                />
                <button onClick={handleAddRecordButton}>Add Record</button>
                <button onClick={handleGenerateReport}>Print Report</button>
            </div>
            <table className="userDetailsTable" id="toPrint">
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Date</th>
                        <th>Diagnosis</th>
                        <th>Treatment</th>
                        <th data-html2canvas-ignore="true"></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords && filteredRecords.map(record => (
                        <tr key={record._id}>
                            <td>{record.FullName}</td>
                            <td>{record.date}</td>
                            <td>{record.diagnosis}</td>
                            <td>{record.treatment}</td>
                            <td data-html2canvas-ignore="true">
                                <button onClick={() => {handleUpdateButton(record._id)}}>Update</button>
                                <button onClick={() => {handleDeleteButton(record._id)}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
     );
}
 
export default MedicalRecords;