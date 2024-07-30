import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormationItem from './FormationItem';
import Nav from '../components/Nav/Nav'

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
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/formations');
        setFormations(response.data);
      } catch (error) {
        console.error('Error fetching formations:', error);
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
    formation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Nav></Nav>
    <div className="p-8 pt-24 bg-gradient-to-r from-amber-500 to-orange-600" id='formations'>
      <h1 className='text-white text-3xl font-bold mb-6'>Formations</h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg drop-shadow-lg"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="loader">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 justify-items-center">
          {filteredFormations.map((formation, index) => (
            <FormationItem key={formation.id} formation={formation} index={index} />
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Body;