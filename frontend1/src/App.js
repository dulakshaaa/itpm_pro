import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

//views
import DoctorDashboard from './views/DoctorDashboard';
import AdminDashboard from './views/AdminDashboard';
import ClientView from './views/ClientView';
import AdminLogin from './components/AdminDashboard/AdminLogin';
//views


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Client/*' element={<ClientView />} />
        <Route path='/DoctorDashboard/*' element={<DoctorDashboard />} />
        <Route path='/AdminDashboard/*' element={<AdminDashboard />} />
        <Route path='/admin/Login' element={<AdminLogin/>} />
        
      </Routes>
    </BrowserRouter>    
  );
}

export default App;
