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

  const handleSave = async () => {
    if (!oldKeyInput || !newKeyInput) {
      Swal.fire('Attention', 'Veuillez remplir les deux champs.', 'warning');
      return;
    }

    // 🔐 Vérification : l’utilisateur doit saisir la clé actuelle
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

  return (
    <div className="bodydashboard">
      <Barside title="Settings" />
      <div className="content">
        <div className="title">
          <h1>Settings</h1>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg m-6">
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
                onClick={handleSave}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600"
              >
                Enregistrer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
