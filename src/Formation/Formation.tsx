import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav/Nav';

interface Formation {
  id: number;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

interface Video {
  id: string;
  title: string;
  numero: number;
  link: string;
  description: string;
  formationId: string;
}

const FormationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/formations/${id}`);
        setFormation(response.data);
      } catch (error) {
        console.error('Error fetching formation:', error);
      }
    };
    const fetchVideos = async () => {
      try {
          const response = await axios.get<Video[]>(`http://localhost:5000/api/formation/${id}/videos`);
          setVideos(response.data);
      } catch (error) {
          console.error('Error fetching videos:', error);
      }
  };

  fetchFormation();
  fetchVideos();
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
      <div className="bg-white rounded-lg shadow-lg w-full h-full">
        <Nav/>
        <div className="bg-cover bg-center p-8 text-center" style={{ backgroundImage: "url('"+formation.image+"')", height:"500px" }} id='header'>
        <h1 className="text-4xl mt-32 font-bold">{formation.name}</h1>
        </div>
        <p className="mb-2"><strong>Duree:</strong> {formation.duree}</p>
        <p className="mb-2"><strong>Description:</strong> {formation.description}</p>
        <div>
        <h2 className="text-2xl font-bold">Videos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map(video => (
                        <div key={video.id} className="bg-gray-100 rounded-lg p-4 shadow">
                            <h3 className="text-xl font-bold">{video.title}</h3>
                            <iframe
                                width="100%"
                                height="200"
                                src={video.link}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                            <p className="mt-2">{video.description}</p>
                        </div>
                    ))}
                </div>
        </div>
      </div>
  );
};

export default FormationPage;
