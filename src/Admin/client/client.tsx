import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import Barside from '../barside/barside';
import Swal from 'sweetalert2';
import API_URL from '../../API_URL';

interface Client {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

interface Formation {
    id: number;
    name: string;
    duree: string;
    description: string;
    price: string;
}

interface Subscribe {
    id: number;
    pourcentage: number;
    formationId: number;
    Formation: Formation;
}

interface ClientDetails extends Client {
    Subscribes: Subscribe[];
}

export default function Client() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/users/clients`, {
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token
                }
            });
            
            if (response.data.success) {
                setClients(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de charger les clients'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchClientDetails = async (clientId: number) => {
        setLoadingDetails(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/users/clients/${clientId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token
                }
            });
            
            if (response.data.success) {
                setSelectedClient(response.data.data);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching client details:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Impossible de charger les détails du client'
            });
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleDelete = async (clientId: number) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_URL}/api/users/clients/${clientId}`, {
                    headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token
                }
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Supprimé!',
                    text: 'Le client a été supprimé avec succès.'
                });

                fetchClients();
            } catch (error) {
                console.error('Error deleting client:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible de supprimer le client'
                });
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedClient(null);
    };

    return (
        <div className='bodydashboard'>
            <Barside title="dashboard"/>
            <div className="content flex flex-col px-2 md:px-6">
                      <div className="title"><h1>Gestion des Clients</h1></div>

                <div className="mb-6">
                    <p className="text-gray-200 mt-2">Liste de tous les clients inscrits</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Téléphone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {clients.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                Aucun client trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        clients.map((client) => (
                                            <tr key={client.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {client.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {client.firstName} {client.lastName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{client.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{client.phone || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => fetchClientDetails(client.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                        title="Voir détails"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(client.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Supprimer"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal */}
                {showModal && selectedClient && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">Détails du Client</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Client Info */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Nom complet</label>
                                            <p className="text-gray-900">{selectedClient.firstName} {selectedClient.lastName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email</label>
                                            <p className="text-gray-900">{selectedClient.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Téléphone</label>
                                            <p className="text-gray-900">{selectedClient.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Adresse</label>
                                            <p className="text-gray-900">{selectedClient.address || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscriptions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Formations Inscrites ({selectedClient.Subscribes?.length || 0})
                                    </h3>
                                    {selectedClient.Subscribes && selectedClient.Subscribes.length > 0 ? (
                                        <div className="space-y-4">
                                            {selectedClient.Subscribes.map((subscribe) => (
                                                <div key={subscribe.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-lg font-semibold text-gray-800">
                                                            {subscribe.Formation.name}
                                                        </h4>
                                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                            {subscribe.pourcentage}% complété
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-4 text-sm text-gray-500">
                                                        <span>
                                                            <strong>Durée:</strong> {subscribe.Formation.duree}
                                                        </span>
                                                        <span>
                                                            <strong>Prix:</strong> {subscribe.Formation.price} DH
                                                        </span>
                                                    </div>
                                                    {/* Progress bar */}
                                                    <div className="mt-3">
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                                style={{ width: `${subscribe.pourcentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>Aucune formation inscrite</p>
                                        </div>
                                    )}
                                </div>
                            </div>

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
}