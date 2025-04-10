import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../API_URL';
import { jwtDecode } from "jwt-decode";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL+'/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role: 'CLIENT',
      });
      const { token} = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token) as { id: string, role: string };
              const { id,role} = decoded;
              localStorage.setItem('id', id);
              localStorage.setItem('role', role);

      navigate('/profile');
    } catch (err) {
      setError('An error occurred');
    }
  };
  const validatePassword = (password: string) => {
    const strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})');
    const mediumPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');

    if (strongPassword.test(password)) {
      setPasswordStrength('Strong');
    } else if (mediumPassword.test(password)) {
      setPasswordStrength('Medium');
    } else {
      setPasswordStrength('Weak');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-amber-500 to-orange-600">
      <div className="w-full max-w-md p-8 space-y-4 text-white bg-gradient-to-r from-orange-400 to-red-400 rounded shadow-white">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
            <p className={`mt-1 text-sm font-medium ${passwordStrength === 'Strong' ? 'text-green-500' : passwordStrength === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
              {passwordStrength && `Password strength: ${passwordStrength}`}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="px-4 py-2 font-bold text-white bg-yellow-400 rounded hover:bg-yellow-500">
              Register
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <button onClick={() => navigate('/login')} className="px-4 py-2 font-bold text-white bg-green-400 rounded hover:bg-green-500">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
