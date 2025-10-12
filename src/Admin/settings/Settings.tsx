import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Barside from '../barside/barside';
import API_URL from '../../API_URL';

const Settings: React.FC = () => {
  const [currentStripeKey, setCurrentStripeKey] = useState('');
  const [oldKeyInput, setOldKeyInput] = useState('');
  const [newKeyInput, setNewKeyInput] = useState('');
  const [loading, setLoading] = useState(true);

  // 👇 États pour modification de mot de passe
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
        console.error('Erreur chargement clé Stripe:', error);
        Swal.fire('Erreur', 'Impossible de charger la clé Stripe.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStripeKey();
  }, []);

  // 🔑 Enregistrer nouvelle clé Stripe
  const handleSaveStripeKey = async () => {
    if (!oldKeyInput || !newKeyInput) {
      Swal.fire('Attention', 'Veuillez remplir les deux champs.', 'warning');
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
        { stripeSecretKey: newKeyInput },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );

      Swal.fire('Succès', 'Clé Stripe mise à jour avec succès !', 'success');
      setCurrentStripeKey(newKeyInput);
      setOldKeyInput('');
      setNewKeyInput('');
    } catch (error) {
      console.error('Erreur maj clé Stripe:', error);
      Swal.fire('Erreur', 'Impossible de mettre à jour la clé Stripe.', 'error');
    }
  };

  // 🔐 Changer mot de passe utilisateur
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
      console.log('Password changed successfully:', response.data);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Erreur changement mot de passe:', error);
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

              <label className="block text-gray-700 font-semibold mb-2">
                Entrez la clé actuelle pour confirmation :
              </label>
              <input
                type="password"
                value={oldKeyInput}
                onChange={(e) => setOldKeyInput(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded mb-4 text-black"
                placeholder="Votre clé actuelle"
              />

              <label className="block text-gray-700 font-semibold mb-2">
                Nouvelle clé Stripe :
              </label>
              <input
                type="password"
                value={newKeyInput}
                onChange={(e) => setNewKeyInput(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded mb-4 text-black"
                placeholder="sk_live_..."
              />

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

          <label className="block text-gray-700 font-semibold mb-2">Ancien mot de passe :</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded mb-4 text-black"
            placeholder="Votre ancien mot de passe"
          />

          <label className="block text-gray-700 font-semibold mb-2">Nouveau mot de passe :</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded mb-4 text-black"
            placeholder="Nouveau mot de passe"
          />

          <label className="block text-gray-700 font-semibold mb-2">
            Confirmez le nouveau mot de passe :
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded mb-4 text-black"
            placeholder="Confirmez le mot de passe"
          />

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
