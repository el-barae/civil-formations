// import './Admin.css';
import './add.css'
import React , { useState }from 'react';
import axios from 'axios';
import {NavLink} from 'react-router-dom'
interface ChildProps {
  title: string;
}
const Barside: React.FC<ChildProps> = ({ title }) => {
 


  return (
    
    <div className="barside">
      
    <ul >
      <li className="img">
        <img
          src="https://tse1.explicit.bing.net/th?id=OIP.ROJLMWQcPybcPj5Pn70_oAHaHa&pid=Api&P=0&h=180"
          alt="Admin"
        />
        <h1>{title}</h1>
      </li>
      <li className="item">
        <NavLink to="/Admin/dashboard"   className={({ isActive }) => (isActive ? 'active' : '')}>
          <i className="fa-solid fa-house"></i>
          <h2>Dashboard</h2>
        </NavLink>
      </li>
      <li className="item">
        <NavLink to="/Admin/visualiser"   className={({ isActive }) => (isActive ? 'active' : '')}>
          <i className="fa-solid fa-chart-simple"></i>
          <h2>Visualiser</h2>
        </NavLink>
      </li>
      <li className="item">
        <NavLink to="/Admin/add"   className={({ isActive }) => (isActive ? 'active' : '')}>
          <i className="fa-solid fa-pen"></i>
          <h2>Ajouter une formation</h2>
        </NavLink>
      </li>
      <li className="item">
        <NavLink to="/Admin/setting"   className={({ isActive }) => (isActive ? 'active' : '')}>
          <i className="fa-solid fa-gear"></i>
          <h2>Settings</h2>
        </NavLink>
      </li>
      <li className="item">
        <NavLink to="/Admin/client"   className={({ isActive }) => (isActive ? 'active' : '')}>
        <i className="fa-solid fa-person"></i>
          <h2>Clients</h2>
        </NavLink>
      </li>
      <li className="item">
        <NavLink to="/Admin/message"   className={({ isActive }) => (isActive ? 'active' : '')}>
        <i className="fa-solid fa-envelope"></i>
          <h2>Messages</h2>
        </NavLink>
      </li>
      <li className="logout">
        <NavLink to="/Admin/logout">
          <i className="fa-solid fa-right-from-bracket"></i>
          <h2>Logout</h2>
        </NavLink>
      </li>
    </ul>
  </div>
  
  );
};

export default Barside;

