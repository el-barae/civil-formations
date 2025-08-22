import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Nav.css'
import { jwtDecode } from 'jwt-decode';

const Nav: React.FC = () => {
const navigate = useNavigate();
const [isOpen, setIsOpen] = useState(false);

const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
  event.preventDefault();
  setIsOpen(false);
  navigate(`/#${targetId}`);
};

  const handleLogin = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const login = localStorage.getItem('token')
    if(login){
      try {
        /*const token = localStorage.getItem('token')
        axios.post('http://localhost:5000/api/auth/logout',{
          token
        });*/
        localStorage.removeItem('token');
        navigate('/login');
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
    else
      navigate('/login');
  }

  const handleProfile = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    const login = localStorage.getItem('token')
    if(login){
      const decoded = jwtDecode(login) as { role: string };
      const { role} = decoded;
      if(role==="ADMIN")
        navigate('/Admin/dashboard');
      else
        navigate('/profile');
    }
    else
      navigate('/login');
  }

  return (
<nav className="flex justify-between bg-gradient-to-r from-yellow-500 to-orange-500 p-3 md:px-0 drop-shadow-lg fixed w-full z-50 navbar">
      <div className='ml-8 nav'>
        <a href="#header" onClick={(e) => handleSmoothScroll(e, 'header')} className='text-orange-100 text-2xl font-bold hover:text-orange-200'>
          Formations Civil
        </a>
        <button 
          className="md:hidden text-white focus:outline-none bmenu" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div className="flex items-center list">
        <ul className={`md:flex md:items-center md:space-x-8 md:mr-8 ${isOpen ? 'block' : 'hidden'} mt-2 md:mt-0 text-xl font-bold `}>
          <li>
            <a href="#propos-nous" onClick={(e) => handleSmoothScroll(e, 'propos-nous')} className="text-white hover:text-orange-200 block px-2 py-2 md:py-0">
              À propos de nous
            </a>
          </li>
          <li>
            <a href="#formations" onClick={(e) => handleSmoothScroll(e, 'formations')} className="text-white hover:text-orange-200 block px-2 py-2 md:py-0">
              Formations
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="text-white hover:text-orange-200 block px-2 py-2 md:py-0">
              Contact
            </a>
          </li>
          <li>
            <a href="#login" onClick={(e) => handleLogin(e)} className="text-white hover:text-orange-200 block px-2 py-2 md:py-0">
              {localStorage.getItem('token') ? 'Logout' : 'login'}
            </a>
          </li>
          <li>
            <a href="#profile" onClick={(e) => handleProfile(e)} className="text-white hover:text-orange-200 block px-2 py-2 md:py-0">
              <img src="/user.png" width={'40px'} height={'40px'} alt="" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
