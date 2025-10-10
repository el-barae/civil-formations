import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav/Nav';
import API_URL from '../../API_URL';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTrash, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';

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
  id: number;
  title: string;
  numero: number;
  link: string;
  description: string;
}

const UpdateFormationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  
  // Form states
  const [name, setName] = useState('');
  const [duree, setDuree] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('token');
      if (loginStatus) {
        setIsLoggedIn(true);
      } else {
        Swal.fire({
          title: 'Non connecté',
          text: 'Vous devez vous connecter pour modifier cette formation.',
          icon: 'warning',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'swal2-confirm-custom'
          }
        }).then(() => {
          navigate('/login');
        });
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchFormation = async () => {
        try {
          const response = await axios.get<Formation>(`${API_URL}/api/formations/${id}`);
          const formationData = response.data;
          
          setFormation(formationData);
          setName(formationData.name);
          setDuree(formationData.duree);
          setDescription(formationData.description);
          setPrice(formationData.price);
          setImagePreview(`${mediaBaseUrl}${formationData.image}`);
        } catch (error) {
          console.error('Error fetching formation:', error);
        }
      };

      const fetchVideos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get<Video[]>(`${API_URL}/api/videos/formation/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          setVideos(response.data);
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      };

      fetchFormation();
      fetchVideos();
    }
  }, [id, isLoggedIn, mediaBaseUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('name', name);
      formData.append('duree', duree);
      formData.append('description', description);
      formData.append('price', price.toString());
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await axios.put(`${API_URL}/api/formations/${id}`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        title: 'Succès!',
        text: 'Formation mise à jour avec succès',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate(`/formation/${id}`);
      });
    } catch (error) {
      console.error('Error updating formation:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Erreur lors de la mise à jour de la formation',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleVideoChange = (videoId: number, field: string, value: string | number) => {
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, [field]: value } : video
    ));
  };

  const handleUpdateVideo = async (videoId: number) => {
    try {
      const token = localStorage.getItem('token');
      const video = videos.find(v => v.id === videoId);
      
      await axios.put(`${API_URL}/api/videos/${videoId}`, video, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });

      Swal.fire({
        title: 'Succès!',
        text: 'Vidéo mise à jour avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating video:', error);
      Swal.fire({
        title: 'Erreur',
        text: 'Erreur lors de la mise à jour de la vidéo',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_URL}/api/videos/${videoId}`, {
            headers: {
              'x-auth-token': token
            }
          });

          setVideos(videos.filter(video => video.id !== videoId));
          
          Swal.fire({
            title: 'Supprimé!',
            text: 'La vidéo a été supprimée.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error('Error deleting video:', error);
          Swal.fire({
            title: 'Erreur',
            text: 'Erreur lors de la suppression de la vidéo',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  };

  if (!formation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full h-full">
      <Nav />
      
      {/* Header with image preview */}
      <div className="bg-cover bg-center p-8 text-center relative" style={{ backgroundImage: `url(${imagePreview})`, height: "500px" }} id='header'>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-4xl mt-32 font-bold text-white">{name || 'Nom de la formation'}</h1>
          <label className="mt-4 inline-block bg-orange-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-600 transition-colors">
            Changer l'image
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Formation form */}
      <form onSubmit={handleUpdateFormation} className="m-12">
        <div className="mb-6">
          <label className="block text-2xl text-orange-500 font-bold mb-2">
            Nom de la formation:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-2xl text-orange-500 font-bold mb-2">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={6}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xl font-bold mb-2">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-orange-500" />
              Durée:
            </label>
            <input
              type="text"
              value={duree}
              onChange={(e) => setDuree(e.target.value)}
              placeholder="Ex: 10 heures"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-xl font-bold mb-2">
              Prix (MAD):
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-bold text-lg"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Enregistrer les modifications
        </button>
      </form>

      {/* Videos section */}
      <div className='m-10'>
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Gestion des Vidéos</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {videos.map(video => (
              <div key={video.id} className="bg-gray-100 rounded-lg p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-2">Numéro:</label>
                    <input
                      type="number"
                      value={video.numero}
                      onChange={(e) => handleVideoChange(video.id, 'numero', Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-bold mb-2">Titre:</label>
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) => handleVideoChange(video.id, 'title', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block font-bold mb-2">Description:</label>
                  <textarea
                    value={video.description}
                    onChange={(e) => handleVideoChange(video.id, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <video controls src={`${mediaBaseUrl}${video.link}`} className="w-full rounded" />
                </div>

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleUpdateVideo(video.id)}
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune vidéo disponible</p>
        )}
      </div>
    </div>
  );
};

export default UpdateFormationPage;