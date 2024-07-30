import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Nav: React.FC = () => {
const navigate = useNavigate();

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const login = localStorage.getItem('login')
    if(login){
      try {
        const token = localStorage.getItem('token')
        axios.post('http://localhost:5000/api/auth/logout',{
          token
        });
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        localStorage.removeItem('role');
        navigate('/login');
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
    else
      navigate('/login');
  }

  return (
    <nav className="flex justify-between bg-gradient-to-r from-yellow-500 to-orange-500 p-4 drop-shadow-lg fixed w-full">
      <div className='ml-8'>
        <a href="#header" onClick={(e) => handleSmoothScroll(e, 'header')} className='text-orange-100 text-3xl font-bold'>Formations Civil</a>
      </div>
      <div>
        <ul className="mr-8 flex justify-center space-x-8 text-2xl font-bold">
          <li>
            <a href="#propos-nous" onClick={(e) => handleSmoothScroll(e, 'propos-nous')} className="text-white hover:text-orange-200">
              À propos de nous
            </a>
          </li>
          <li>
            <a href="#formations" onClick={(e) => handleSmoothScroll(e, 'formations')} className="text-white hover:text-orange-200">
              Formations
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="text-white hover:text-orange-200">
              Contact
            </a>
          </li>
          <li>
            <a href="#login" onClick={(e) => handleLogin(e)} className="text-white hover:text-orange-200">
            {localStorage.getItem('login') ? 'Logout' : 'Login'}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
