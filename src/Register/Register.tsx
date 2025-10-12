import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../API_URL';
import { jwtDecode } from "jwt-decode";
import Nav from '../components/Nav/Nav';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_URL + '/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role: 'CLIENT',
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token) as { id: string; role: string };
      const { id, role } = decoded;
      localStorage.setItem('id', id);
      localStorage.setItem('role', role);

      Swal.fire({
        icon: 'success',
        title: 'Inscription réussie',
        text: 'Votre compte a été créé avec succès !',
        confirmButtonColor: '#f97316',
        confirmButtonText: 'OK',
      }).then(() => {
        setTimeout(() => {
          navigate('/profile');
        }, 500);
      });

    } catch (err) {
      setError('Une erreur est survenue.');
      Swal.fire({
        icon: 'error',
        title: 'Échec de l’inscription',
        text: 'Une erreur est survenue lors de l’inscription. Veuillez réessayer.',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Réessayer',
      });
    }
  };

  const validatePassword = (password: string) => {
    const strongPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})');
    const mediumPassword = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');

    if (strongPassword.test(password)) {
      setPasswordStrength('Fort');
    } else if (mediumPassword.test(password)) {
      setPasswordStrength('Moyen');
    } else {
      setPasswordStrength('Faible');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  return (
    <>
      <Nav />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="mt-20 w-full max-w-md p-8 space-y-4 text-white bg-gradient-to-r from-orange-400 to-red-400 rounded shadow-white">
          <h2 className="text-2xl font-bold text-center">Créer un compte</h2>
          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
                required
                placeholder="Entrez votre prénom"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
                required
                placeholder="Entrez votre nom"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
                required
                placeholder="Entrez votre numéro de téléphone"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
                required
                placeholder="Entrez votre adresse"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50"
                required
                placeholder="Entrez votre adresse e-mail"
              />
            </div>

            {/* MOT DE PASSE AVEC ŒIL */}
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full text-black px-3 py-2 mt-1 border rounded shadow-sm focus:ring focus:ring-opacity-50 pr-10"
                required
                placeholder="Créez un mot de passe"
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

              <p
                className={`mt-1 text-sm font-medium ${
                  passwordStrength === 'Fort'
                    ? 'text-green-500'
                    : passwordStrength === 'Moyen'
                    ? 'text-yellow-500'
                    : 'text-red-500'
                }`}
              >
                {passwordStrength && `Force du mot de passe : ${passwordStrength}`}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-yellow-400 rounded hover:bg-yellow-500"
              >
                S'inscrire
              </button>
            </div>
          </form>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 font-bold text-white bg-green-400 rounded hover:bg-green-500"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;