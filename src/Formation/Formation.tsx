import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Formation {
  id: number;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

const FormationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/formations/${id}`);
        setFormation(response.data);
      } catch (error) {
        console.error('Error fetching formation:', error);
      }
    };

    fetchFormation();
  }, [id]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (!formation) {
    return <div>Loading...</div>;
  }

  return (
      <div className="bg-white p-8 rounded-lg shadow-lg w-full h-full">
        <img src={formation.image} alt={formation.name} className="w-full rounded mb-4" />
        <h2 className="text-3xl font-bold mb-4">{formation.name}</h2>
        <p className="mb-2"><strong>Duree:</strong> {formation.duree}</p>
        <p className="mb-2"><strong>Description:</strong> {formation.description}</p>
        <p className="mb-4"><strong>Prix:</strong> {formation.price.toFixed(2)} DH</p>
        <button
          onClick={handleVideoClick}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Watch Video
        </button>
      </div>
  );
};

export default FormationPage;
