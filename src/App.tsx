import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/Home';
import StripeConfig from './StripeConfig';
import FormationsPage from './ListFormations/Formations';
import FormationPage from './Formation/Formation';
import ProfilePage from './Profile/Profile';
import LoginPage from './Login/Login';
import RegisterPage from './components/Register/Register';
import DashboardPage from './Admin/dashboard/Dashboard';
import VisualiserPage from './Admin/visualiser/Visualiser';
import AddFormation from './Admin/addFormation/addFormation';
const App: React.FC = () => {
  return (
    <StripeConfig>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Admin/dashboard" element={<DashboardPage />} />
        <Route path="/Admin/Visualiser" element={<VisualiserPage />} />
        <Route path="/Admin/addFormation" element={<AddFormation />} />
        <Route path="/Formations" element={<FormationsPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/register" Component={RegisterPage} />
        <Route path="/Formation/:id" element={<FormationPage />} /> 
      </Routes>
    </Router>
    </StripeConfig>
  );
};

export default App;

