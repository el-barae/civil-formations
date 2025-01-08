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

/*const formations: Formation[] = [
  {
    id: 1,
    name: 'Formation 1',
    duree: '3 months',
    description: 'Description for Formation 1',
    price: 200.00,
    image: 'path/to/image1.jpg',
    video: 'path/to/video1.mp4',
  },
  {
    id: 2,
    name: 'Formation 2',
    duree: '6 months',
    description: 'Description for Formation 2',
    price: 400.00,
    image: 'path/to/image2.jpg',
    video: 'path/to/video2.mp4',
  },
];
*/
const Body: React.FC = () => {

  const [formations, setFormations] = useState<Formation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get(API_URL+'/api/formations');
        setFormations(response.data);
      } catch (error) {
        console.error('Error fetching formations:', error);
      }
    };

    fetchFormations();
  }, []);

  const handleMoreFormations = () => {
    navigate('/formations');
  };

  return (
    <div className="p-8 flex flex-col items-center" id='formations'>
    <h1 className='text-orange-500 text-3xl font-bold mb-6'>Formations</h1>
    <div className="grid grid-cols-2 gap-20 justify-items-center">
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
  </div>
  );
};
/*

const Body: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/formations');
        setFormations(response.data);
      } catch (error) {
        console.error('Error fetching formations:', error);
      }
    };

    fetchFormations();
  }, []);

  return (
    <div className="p-8">
      <h1 className='text-orange-500 text-3xl font-bold'>Formations</h1>
      <div className="flex flex-wrap justify-center">
        {formations.map((formation, index) => (
          <FormationItem key={formation.id} formation={formation} index={index} />
        ))}
      </div>
    </div>
  );
};
*/
export default Body;
