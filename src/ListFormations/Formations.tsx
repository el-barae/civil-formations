import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormationItem from './FormationItem';
import Nav from '../components/Nav/Nav'
import API_URL from '../API_URL';

interface Formation {
  id: number;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

// Formations fictives de génie civil complètes
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
  {
    id: 9995,
    name: 'Charpente Métallique et Constructions Acier',
    duree: '4 mois',
    description: 'Apprenez à concevoir et calculer des structures métalliques selon les Eurocodes.',
    price: 980.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/718096/FFFFFF?text=Video+Preview',
  },
  {
    id: 9994,
    name: 'Ponts et Ouvrages d\'Art',
    duree: '7 mois',
    description: 'Conception et dimensionnement des ponts : dalle, poutre, haubané et suspension.',
    price: 1450.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/2D3748/FFFFFF?text=Video+Preview',
  },
  {
    id: 9993,
    name: 'Routes et Terrassements',
    duree: '3 mois',
    description: 'Tracé routier, calcul de terrassements et conception de chaussées flexibles et rigides.',
    price: 750.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/4A5568/FFFFFF?text=Video+Preview',
  },
  {
    id: 9992,
    name: 'BIM et Modélisation 3D avec Revit',
    duree: '4 mois',
    description: 'Maîtrisez le Building Information Modeling (BIM) avec Autodesk Revit pour l\'ingénierie structurelle.',
    price: 1100.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/0F4C75/FFFFFF?text=Video+Preview',
  },
  {
    id: 9991,
    name: 'Calcul Sismique et Parasismique',
    duree: '5 mois',
    description: 'Conception parasismique des bâtiments selon les réglementations nationales et internationales.',
    price: 1320.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/C53030/FFFFFF?text=Video+Preview',
  },
  {
    id: 9990,
    name: 'Gestion de Projet BTP',
    duree: '2 mois',
    description: 'Pilotage de projets de construction : planification, suivi des coûts et management d\'équipe.',
    price: 650.00,
    image: '/civil.jpg',
    video: 'https://via.placeholder.com/300x200/38A169/FFFFFF?text=Video+Preview',
  },
];

const Body: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get(API_URL + '/api/formations');
        
        // Si aucune formation n'est retournée par l'API, utiliser les formations fictives
        if (!response.data || response.data.length === 0) {
          setFormations(fakeFormations);
        } else {
          setFormations(response.data);
        }
      } catch (error) {
        console.error('Error fetching formations:', error);
        // En cas d'erreur de l'API, utiliser les formations fictives
        setFormations(fakeFormations);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredFormations = formations.filter(formation =>
    formation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Nav></Nav>
      <div className="p-8 pt-24 bg-gradient-to-r from-amber-500 to-orange-600" id='formations'>
        <h1 className='text-white text-3xl font-bold mb-6'>Formations en Génie Civil</h1>
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg drop-shadow-lg w-80"
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="text-white text-xl">Chargement des formations...</div>
          </div>
        ) : (
          <>
            {filteredFormations.length === 0 ? (
              <div className="text-center text-white text-xl">
                {searchTerm ? 
                  `Aucune formation trouvée pour "${searchTerm}"` : 
                  "Aucune formation disponible pour le moment."
                }
              </div>
            ) : (
              <>
                <div className="text-center text-white mb-4">
                  {filteredFormations.length} formation(s) trouvée(s)
                  {searchTerm && ` pour "${searchTerm}"`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                  {filteredFormations.map((formation, index) => (
                    <FormationItem key={formation.id} formation={formation} index={index} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Body;