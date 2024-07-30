import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav'

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('login', 'true')
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
    <Nav></Nav>
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-amber-500 to-orange-600">
      <div className="w-full max-w-md p-8 space-y-4 text-white bg-gradient-to-r from-orange-400 to-red-400 rounded shadow-white">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="px-4 py-2 font-bold text-white bg-yellow-400 rounded hover:bg-yellow-500">
              Login
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 font-bold text-white bg-green-400 rounded hover:bg-green-500"
          >
            Register
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
