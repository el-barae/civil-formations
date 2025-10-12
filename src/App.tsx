import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/Home';
import StripeConfig from './StripeConfig';
import FormationsPage from './ListFormations/Formations';
import FormationPage from './Formation/Formation';
import ProfilePage from './Profile/Profile';
import LoginPage from './Login/Login';
import RegisterPage from './Register/Register';
import DashboardPage from './Admin/dashboard/Dashboard';
import VisualiserPage from './Admin/visualiser/Visualiser';
import AddFormation from './Admin/addFormation/addFormation';
import Clients from './Admin/client/client';
import Settings from './Admin/settings/Settings';
import UpdateFormation from './Admin/updateFormation/updateFormation';
import ProtectedRoute from './ProtectedRoutes';
import { StripeProvider } from './StripeContext';

const App: React.FC = () => {
  return (
    <StripeProvider>
      <StripeConfig>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/Formations" element={<FormationsPage />} />
          
          {/* Routes utilisateur connecté */}
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/Formation/:id" element={<FormationPage />} />
          
          {/* Routes Admin protégées - Version groupée */}
          <Route path="/Admin/*" element={
            <ProtectedRoute requiredRole="ADMIN">
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="Visualiser" element={<VisualiserPage />} />
                <Route path="addFormation" element={<AddFormation />} />
                <Route path="clients" element={<Clients />} />
                <Route path="settings" element={<Settings />} />
                <Route path="updateFormation/:id" element={<UpdateFormation />} />
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </StripeConfig>
    </StripeProvider>
  );
};

export default App;

