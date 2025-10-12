import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav/Nav';
import Swal from 'sweetalert2';
import API_URL from '../API_URL';
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token) as { id: string; role: string };
      const { id, role } = decoded;
      localStorage.setItem('id', id);
      localStorage.setItem('role', role);

      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie',
        text: 'Vous êtes connecté avec succès !',
        confirmButtonColor: '#f97316',
        confirmButtonText: 'OK',
      }).then(() => {
        if (role === 'CLIENT') navigate('/profile');
        else navigate('/Admin/dashboard');
      });
    } catch (err) {
      setError('Adresse e-mail ou mot de passe incorrect.');
      Swal.fire({
        icon: 'error',
        title: 'Échec de la connexion',
        text: 'Adresse e-mail ou mot de passe incorrect.',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Réessayer',
      });
    }
  };

  return (
    <>
      <Nav />
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-amber-500 to-orange-600">
        <img className="mb-6 mt-16" width={'100px'} height={'100px'} src="/padlock.png" alt="Icône de cadenas" />
        <div className="w-full max-w-md p-8 space-y-4 text-white bg-gradient-to-r from-orange-400 to-red-400 rounded shadow-white">
          <h2 className="text-2xl font-bold text-center">Connexion</h2>
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50 text-black"
                placeholder="Entrez votre email"
                required
              />
            </div>

            {/* Mot de passe avec bouton œil */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50 text-black"
                placeholder="Entrez votre mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-600"
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} className="text-orange-500" />
                ) : (
                  <FontAwesomeIcon icon={faEye} className="text-orange-500" />
                )}
              </button>
            </div>

            {/* Bouton Connexion */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-yellow-400 rounded hover:bg-yellow-500"
              >
                Se connecter
              </button>
            </div>
          </form>

          {/* Bouton Inscription */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 font-bold text-white bg-green-400 rounded hover:bg-green-500"
            >
              Créer un compte
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
