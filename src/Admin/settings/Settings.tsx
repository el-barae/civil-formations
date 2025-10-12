import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Barside from '../barside/barside';
import API_URL from '../../API_URL';

const Settings: React.FC = () => {
  const [currentStripeKey, setCurrentStripeKey] = useState('');
  const [oldKeyInput, setOldKeyInput] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [loading, setLoading] = useState(true);

  // 👇 États pour mot de passe + visibilité
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewStripeKey, setShowNewStripeKey] = useState(false);
  const [showOldStripeKey, setShowOldStripeKey] = useState(false);
  const [publicKeyInput, setPublicKeyInput] = useState('');
  const [showPublicKey, setShowPublicKey] = useState(false);


  useEffect(() => {
    const fetchStripeKey = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/config/stripe-key`, {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });
        setCurrentStripeKey(response.data.stripeSecretKey || '');
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de charger la clé Stripe.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStripeKey();
  }, []);

  const handleSaveStripeKey = async () => {
    if (!oldKeyInput || !newKeyInput || !publicKeyInput) {
      Swal.fire('Attention', 'Veuillez remplir tous les champs.', 'warning');
      return;
    }

    if (oldKeyInput !== currentStripeKey) {
      Swal.fire('Erreur', 'La clé actuelle saisie est incorrecte.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/config/stripe-key`,
        { 
          stripeSecretKey: newKeyInput,
          stripePublicKey: publicKeyInput
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );

      Swal.fire('Succès', 'Clés Stripe mises à jour avec succès !', 'success');
      setCurrentStripeKey(newKeyInput);
      setOldKeyInput('');
      setNewKeyInput('');
      setPublicKeyInput('');
    } catch (error) {
      Swal.fire('Erreur', 'Impossible de mettre à jour les clés Stripe.', 'error');
    }
  };


  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire('Attention', 'Tous les champs sont requis.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('Erreur', 'Les nouveaux mots de passe ne correspondent pas.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/users/admin/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );

      Swal.fire('Succès', 'Mot de passe mis à jour avec succès !', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.message ||
        'Une erreur est survenue.';
      Swal.fire('Erreur', errorMsg, 'error');
    }
  };

  return (
    <div className="bodydashboard">
      <Barside title="Settings" />
      <div className="content">
        <div className="title">
          <h1>Settings</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 🔸 Bloc Stripe */}


        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg m-6">
          <h2 className="text-xl font-bold mb-4 text-orange-600">Stripe Configuration</h2>
          {loading ? (
            <p className="text-gray-500">Chargement...</p>
          ) : (
            <>
              <label className="block text-gray-700 font-semibold mb-2">
                Clé Stripe actuelle :
              </label>
              <p className="bg-white border border-gray-300 p-3 rounded text-black mb-4 select-none">
                {currentStripeKey
                  ? `${currentStripeKey.slice(0, 20)}**********`
                  : 'Aucune clé enregistrée'}
              </p>

              {/* 🔒 Clé actuelle */}
              <label className="block text-gray-700 font-semibold mb-2">
                Entrez la clé actuelle :
              </label>
              <div className="relative mb-4">
                <input
                  type={showOldStripeKey ? 'text' : 'password'}
                  value={oldKeyInput}
                  onChange={(e) => setOldKeyInput(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded text-black pr-10"
                  placeholder="Votre clé actuelle"
                />
                <button
                  type="button"
                  onClick={() => setShowOldStripeKey(!showOldStripeKey)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showOldStripeKey ? (
                    <FontAwesomeIcon icon={faEyeSlash} className="text-orange-500" />
                  ) : (
                    <FontAwesomeIcon icon={faEye} className="text-orange-500" />
                  )}
                </button>
              </div>

              {/* 🔑 Nouvelle clé */}
              <label className="block text-gray-700 font-semibold mb-2">
                Nouvelle clé Stripe :
              </label>
              <div className="relative mb-4">
                <input
                  type={showNewStripeKey ? 'text' : 'password'}
                  value={newKeyInput}
                  onChange={(e) => setNewKeyInput(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded text-black pr-10"
                  placeholder="sk_live_..."
                />
                <button
                  type="button"
                  onClick={() => setShowNewStripeKey(!showNewStripeKey)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showNewStripeKey ? (
                    <FontAwesomeIcon icon={faEyeSlash} className="text-orange-500" />
                  ) : (
                    <FontAwesomeIcon icon={faEye} className="text-orange-500" />
                  )}
                </button>
              </div>

                  {/* 🔑 Clé publique */}
              <label className="block text-gray-700 font-semibold mb-2">
                Clé publique Stripe :
              </label>
              <div className="relative mb-4">
                <input
                  type={showPublicKey ? 'text' : 'password'}
                  value={publicKeyInput}
                  onChange={(e) => setPublicKeyInput(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded text-black pr-10"
                  placeholder="pk_test_..."
                />
                <button
                  type="button"
                  onClick={() => setShowPublicKey(!showPublicKey)}
                  className="absolute right-3 top-3 text-gray-600"
                >
                  {showPublicKey ? (
                    <FontAwesomeIcon icon={faEyeSlash} className="text-orange-500" />
                  ) : (
                    <FontAwesomeIcon icon={faEye} className="text-orange-500" />
                  )}
                </button>
              </div>

              <button
                onClick={handleSaveStripeKey}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600"
              >
                Enregistrer
              </button>
            </>
          )}
        </div>


        {/* 🔸 Bloc Changement de mot de passe */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg m-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">Change Password</h2>

          {/* Ancien mot de passe */}
          <label className="block text-gray-700 font-semibold mb-2">Ancien mot de passe :</label>
          <div className="relative mb-4">
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded text-black pr-10"
              placeholder="Votre ancien mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showOldPassword ? <FontAwesomeIcon icon={faEyeSlash} className="mr-2 text-orange-500" /> : <FontAwesomeIcon icon={faEye} className="mr-2 text-orange-500" />}
            </button>
          </div>

          {/* Nouveau mot de passe */}
          <label className="block text-gray-700 font-semibold mb-2">Nouveau mot de passe :</label>
          <div className="relative mb-4">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded text-black pr-10"
              placeholder="Nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showNewPassword ? <FontAwesomeIcon icon={faEyeSlash} className="mr-2 text-orange-500" /> : <FontAwesomeIcon icon={faEye} className="mr-2 text-orange-500" />}
            </button>
          </div>

          {/* Confirmation */}
          <label className="block text-gray-700 font-semibold mb-2">
            Confirmez le nouveau mot de passe :
          </label>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded text-black pr-10"
              placeholder="Confirmez le mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} className="mr-2 text-orange-500" /> : <FontAwesomeIcon icon={faEye} className="mr-2 text-orange-500" />}
            </button>
          </div>

          <button
            onClick={handleChangePassword}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600"
          >
            Mettre à jour le mot de passe
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
