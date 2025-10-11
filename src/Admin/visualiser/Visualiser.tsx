import './visualiser.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Barside from '../barside/barside';
import Swal from 'sweetalert2';
import API_URL from '../../API_URL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faUser, faClock } from '@fortawesome/free-solid-svg-icons';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Avis {
  id: number;
  commentaire: string;
  createdAt: string;
  User: User;
}

interface Formation {
  id: number;
  name: string;
  description: string;
  duree: string;
  price: string;
  image: string;
  Avis: Avis[];
  avisCount: number;
}

const Visualiser: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFormationsWithAvis();
  }, []);

  const fetchFormationsWithAvis = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/avis/formations`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        }
      });

      if (response.data.success) {
        setFormations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching formations:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les formations et avis'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openModal = (formation: Formation) => {
    setSelectedFormation(formation);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFormation(null);
  };

  return (
    <div className='bodydashboard'>
      <Barside title='Visualiser' />
      <div className="content">
        <div className="title">
          <h1>Visualiser les Avis</h1>
        </div>

      <p className="text-gray-200 ml-4">Consultez tous les avis par formation</p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="titlecontent">
            {formations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Aucune formation trouvée</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {formations.map((formation) => (
                  <div
                    key={formation.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                    onClick={() => openModal(formation)}
                  >
                    {/* Formation Image */}
                    {formation.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`${API_URL}/uploads/${formation.image}`}
                          alt={formation.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Formation Info */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {formation.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {formation.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          {formation.duree}
                        </span>
                        <span className="font-semibold text-blue-600">
                          {formation.price} DH
                        </span>
                      </div>

                      {/* Avis Count */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center text-blue-600">
                          <FontAwesomeIcon icon={faComment} className="mr-2" />
                          <span className="font-semibold">
                            {formation.avisCount} avis
                          </span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Voir les avis →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for Avis Details */}
        {showModal && selectedFormation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedFormation.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedFormation.avisCount} avis pour cette formation
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Formation Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 mb-3">{selectedFormation.description}</p>
                  <div className="flex gap-6 text-sm text-gray-600">
                    <span>
                      <strong>Durée:</strong> {selectedFormation.duree}
                    </span>
                    <span>
                      <strong>Prix:</strong> {selectedFormation.price} DH
                    </span>
                  </div>
                </div>

                {/* Avis List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tous les avis
                  </h3>
                  {selectedFormation.Avis && selectedFormation.Avis.length > 0 ? (
                    <div className="space-y-4">
                      {selectedFormation.Avis.map((avis) => (
                        <div
                          key={avis.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          {/* User Info */}
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {avis.User.firstName.charAt(0)}
                              {avis.User.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {avis.User.firstName} {avis.User.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(avis.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Comment */}
                          <p className="text-gray-700 pl-13">
                            {avis.commentaire}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FontAwesomeIcon icon={faComment} className="text-4xl mb-3" />
                      <p>Aucun avis pour cette formation</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualiser;