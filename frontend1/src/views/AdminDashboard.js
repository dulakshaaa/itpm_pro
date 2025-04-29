import DasboardNavBar from "../components/NavbBars/DasboardNavBar";
import DashboardSideBar from "../components/SideBars/DashboardSideBar";


import OnlineStore from "../components/AdminDashboard/OnlineStore";
import Clients from "../components/AdminDashboard/Clients";
import Doctors from "../components/AdminDashboard/Doctors";
import CreateDoctor from "../components/AdminDashboard/CreateDoctor";
import AddInventory from "../components/AdminDashboard/AddInventory";
import Pets from "../components/AdminDashboard/Pets";

import { Routes, Route } from 'react-router-dom'
import AddPetForm from "../components/AdminDashboard/PetsForlongtermTreatements";
import CagedPets from "../components/AdminDashboard/ViewCagedPets";
import UpdateInventory from "../components/AdminDashboard/UpdateInventory";
import EditCagedPets from "../components/AdminDashboard/EditCagedPets";


const AdminDashboard = () => {
    return ( 
        <>
            <DasboardNavBar loggedIn={true} username="Admin" title="Admin Panel" />
            <div className="mainContent">
                <DashboardSideBar userDoc={false} />
                <div className="pages">
                    <Routes>
                        <Route path='/OnlineStore' element={<OnlineStore />} />
                        <Route path='/editcagedpets/:cagedpetid' element={<EditCagedPets />} />
                        <Route path='/createDoctor' element={<CreateDoctor />} />
                        <Route path='/updateinventory/:itemID' element={<UpdateInventory />} />
                        <Route path='/addInventory' element={<AddInventory />} />
                        <Route path='/Doctors' element={<Doctors />} />
                        <Route path='/Clients' element={<Clients />} />
                        <Route path='/Pets'    element={<Pets/>}/>  
                        <Route path='/CagedPets'    element={<AddPetForm/>}/>
                        <Route path='/ViewCagedPets'    element={<CagedPets/>}/>                  
                        </Routes>
                </div>
            </div>
        </>
     );
}
 
export default AdminDashboard;