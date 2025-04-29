import DashboardSideBar from "../components/SideBars/DashboardSideBar";
import DasboardNavBar from "../components/NavbBars/DasboardNavBar";


import MedicalRecord from "../components/DoctorDashboard/MedicalRecords";
import Appointment from "../components/DoctorDashboard/Appointment";
import AvailableTimeDoctor from "../components/DoctorDashboard/EnterTime";
import CreateMedicalRecord from "../components/DoctorDashboard/CreateMedicalRecord";

import { Routes, Route } from 'react-router-dom'
import UpdateMedicalRecord from "../components/DoctorDashboard/UpdateMedicalRecord";
import DoctorAvailableTimes from "../components/DoctorDashboard/viewAvailableTimes";


const DoctorDashboard = () => {
    return ( 
        <>
            <DasboardNavBar loggedIn={true} username="Welcome" title="Doctor Panel" />
            <div className="mainContent">
                <DashboardSideBar userDoc={true} />
                <div className="pages">
                    <Routes>
                        <Route path='/Appointments' element={<Appointment />} />
                        <Route path='/MedicalRecords' element={<MedicalRecord />} />
                        <Route path='/CreateMedicalRecord' element={<CreateMedicalRecord />} />
                        <Route path='/UpdateMedicalRecord/:recordID' element={<UpdateMedicalRecord />} />
                        <Route path='/AddAvailableTime' element={<AvailableTimeDoctor/>} />
                        <Route path='/viewAvailableTime' element={<DoctorAvailableTimes/>} />
                    </Routes>
                   
                </div>
            </div>
        </>
     );
}
 
export default DoctorDashboard;