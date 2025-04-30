import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorAvailableTimes = () => {
    const [availableTimes, setAvailableTimes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAvailableTimes = async () => {
            try {
                const response = await axios.get("http://localhost:3001/doctor_api/getAllTimes");
                setAvailableTimes(response.data);
            } catch (error) {
                console.error("Error fetching available times:", error);
            }
        };

        fetchAvailableTimes();
    }, []);

    const onDeleteButtonClick = async (timeID) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this available time?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:3001/doctor_api/delete/${timeID}`);
            console.log(response);
            // Refresh the available times after deletion
            const updatedTimes = availableTimes.filter(time => time._id !== timeID);
            setAvailableTimes(updatedTimes);
        } catch (error) {
            console.error("Error deleting available time:", error);
        }
    };

    const filteredTimes = availableTimes.filter(time => {
        return (
            time.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            time.times.toLowerCase().includes(searchTerm.toLowerCase()) ||
            time.doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <>
             <div className="searchBar">
            </div>
            <div className="buttonCollection">
                <input type="text" name="doctorSearch" id="doctorSearch" placeholder="Search" onChange={(e) => {setSearchTerm(e.target.value)}} value={searchTerm} />
              
            </div>
          <table className="doctorDetailsTable" id="toPrint">// change in doctor details
    <thead>
        <tr>
            <th>Doctor Name</th>
            <th>Time Slot</th>
            <th>Specialty</th>
            <th>Delete</th>
        </tr>
    </thead>
</table>

                <tbody>
                    {filteredTimes.map(time => (
                        <tr key={time._id}>
                            <td>{time.doctorName}</td>
                            <td>{time.times}</td>
                            <td>{time.doctorSpecialty}</td>
                            <td>
                                <button onClick={() => onDeleteButtonClick(time._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default DoctorAvailableTimes;
