import './Admin.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Barside from './barside';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import DashboardPage from './Dashboard';


const Admin: React.FC = () => {
  

  return (
    <div className="p-8">
      <Barside title='ksc'/>
        
    </div>
  );
};

export default Admin;

