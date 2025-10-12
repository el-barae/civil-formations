import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormationItem from './FormationItem';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../API_URL';

interface Formation {
  id: number;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

// Formations fictives de génie civil à afficher si aucune formation réelle n'est disponible
const fakeFormations: Formation[] = [
  {
    id: 9999,
    name: 'Conception des Structures en Béton Armé',
    duree: '6 mois',
    description: 'Maîtrisez les techniques de calcul et de dimensionnement des structures en béton armé selon les normes européennes.',
    price: 1250.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Video+Preview',
  },
  {
    id: 9998,
    name: 'AutoCAD Civil 3D - Niveau Avancé',
    duree: '3 mois',
    description: 'Perfectionnez-vous dans l\'utilisation d\'AutoCAD Civil 3D pour la conception d\'infrastructures routières et hydrauliques.',
    price: 890.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/E53E3E/FFFFFF?text=Video+Preview',
  },
  {
    id: 9997,
    name: 'Géotechnique et Mécanique des Sols',
    duree: '4 mois',
    description: 'Approfondissez vos connaissances en géotechnique : étude des sols, fondations et soutènements.',
    price: 1050.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Video+Preview',
  },
  {
    id: 9996,
    name: 'Hydraulique et Assainissement Urbain',
    duree: '5 mois',
    description: 'Formation complète sur la conception des réseaux d\'eau potable et d\'assainissement en milieu urbain.',
    price: 1180.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/2B6CB0/FFFFFF?text=Video+Preview',
  },
];

const Body: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_URL + '/api/formations');
        
        // Si aucune formation n'est retournée par l'API, utiliser les formations fictives
        if (!response.data || response.data.length === 0) {
          setFormations(fakeFormations);
        } else {
          setFormations(response.data);
        }
      } catch (error) {
        // En cas d'erreur de l'API, utiliser les formations fictives
        setFormations(fakeFormations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleMoreFormations = () => {
    navigate('/formations');
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center" id='formations'>
        <h1 className='text-orange-500 text-3xl font-bold mb-6'>Formations</h1>
        <div className="text-center">Chargement des formations...</div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center" id='formations'>
      <h1 className='text-orange-500 text-3xl font-bold mb-6'>Formations</h1>
      {formations.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucune formation disponible pour le moment.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-20 justify-items-center">
            {formations.slice(0, 4).map((formation, index) => (
              <FormationItem key={formation.id} formation={formation} index={index} />
            ))}
          </div>
          <button 
            onClick={handleMoreFormations}
            className='mt-8 px-6 py-2 rounded bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl hover:bg-gradient-to-l from-amber-500 to-orange-600'
          >
            Autres
          </button>
        </>
      )}
    </div>
  );
};

export default Body;