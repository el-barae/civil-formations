import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/Home';
import AdminPage from './Admin/Admin';
import StripeConfig from './StripeConfig';
import FormationsPage from './ListFormations/Formations';
import FormationPage from './Formation/Formation';
import ProfilePage from './Profile/Profile';
import LoginPage from './Login/Login';
import RegisterPage from './components/Register';

const App: React.FC = () => {
  return (
    <StripeConfig>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Admin" element={<AdminPage />} />
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

