import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Nav from '../../components/Nav/Nav';
import API_URL from '../../API_URL';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus, faSave, faTimes, faVideo } from '@fortawesome/free-solid-svg-icons';
import VideoUpdateCard from './VideoUpdateCard';

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

interface NewVideo {
  title: string;
  numero: number;
  description: string;
  videoFile: File | null;
}

const UpdateFormationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  
  // Form states
  const [name, setName] = useState('');
  const [duree, setDuree] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [presentationVideoFile, setPresentationVideoFile] = useState<File | null>(null);
  const [presentationVideoPreview, setPresentationVideoPreview] = useState<string>('');

  // New video modal state
  const [newVideo, setNewVideo] = useState<NewVideo>({
    title: '',
    numero: videos.length + 1,
    description: '',
    videoFile: null
  });

  const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

  // Vérification avec useLocation
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
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
      return;
    }

    setIsLoggedIn(true);

    // Vérifier si l'utilisateur vient du dashboard admin
    if (!location.state?.fromDashboard) {
      Swal.fire({
        title: 'Accès refusé',
        text: 'Vous devez accéder à cette page depuis le dashboard admin.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal2-confirm-custom'
        }
      }).then(() => {
        navigate('/Admin/dashboard');
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (isLoggedIn && location.state?.fromDashboard) {
      const fetchFormation = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get<Formation>(`${API_URL}/api/formations/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          const formationData = response.data;
          
          setFormation(formationData);
          setName(formationData.name);
          setDuree(formationData.duree);
          setDescription(formationData.description);
          setPrice(formationData.price);
          setImagePreview(`${mediaBaseUrl}${formationData.image}`);
          if (formationData.video) {
            setPresentationVideoPreview(`${mediaBaseUrl}${formationData.video}`);
          }
        } catch (error) {
          // console.error('Error fetching formation:', error);
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
          // console.error('Error fetching videos:', error);
        }
      };

      fetchFormation();
      fetchVideos();
    }
  }, [id, isLoggedIn, location.state, mediaBaseUrl]);

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

  const handlePresentationVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPresentationVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPresentationVideoPreview(reader.result as string);
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

      if (presentationVideoFile) {
        formData.append('video', presentationVideoFile);
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
      });
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: 'Erreur lors de la mise à jour de la formation',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleVideoChange = (videoId: number, field: string, value: string | number | File) => {
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, [field]: value } : video
    ));
  };

  const handleUpdateVideo = async (videoId: number, videoFile?: File) => {
    try {
      const token = localStorage.getItem('token');
      const video = videos.find(v => v.id === videoId);
      
      const formData = new FormData();
      formData.append('title', video!.title);
      formData.append('numero', video!.numero.toString());
      formData.append('description', video!.description);
      
      if (videoFile) {
        formData.append('video', videoFile);
      }

      await axios.put(`${API_URL}/api/videos/${videoId}`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        title: 'Succès!',
        text: 'Vidéo mise à jour avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Recharger les vidéos
      const response = await axios.get<Video[]>(`${API_URL}/api/videos/formation/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      setVideos(response.data);
    } catch (error) {
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

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVideo.videoFile) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez sélectionner une vidéo',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('title', newVideo.title);
      formData.append('numero', newVideo.numero.toString());
      formData.append('description', newVideo.description);
      formData.append('video', newVideo.videoFile);

      await axios.post(`${API_URL}/api/videos/formation/${id}`, formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        title: 'Succès!',
        text: 'Vidéo ajoutée avec succès',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Réinitialiser le formulaire et fermer le modal
      setNewVideo({
        title: '',
        numero: videos.length + 2,
        description: '',
        videoFile: null
      });
      setShowModal(false);

      // Recharger les vidéos
      const response = await axios.get<Video[]>(`${API_URL}/api/videos/formation/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      setVideos(response.data);
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: 'Erreur lors de l\'ajout de la vidéo',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  // Ne rien afficher si l'accès n'est pas autorisé
  if (!location.state?.fromDashboard) {
    return null;
  }

  if (!formation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
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
              Prix ($):
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

        {/* Vidéo de présentation */}
        <div className="mb-6">
          <label className="block text-xl font-bold mb-2">
            <FontAwesomeIcon icon={faVideo} className="mr-2 text-orange-500" />
            Vidéo de présentation:
          </label>
          {presentationVideoPreview && (
            <video 
              controls 
              src={presentationVideoPreview} 
              className="w-full max-w-2xl rounded-lg mb-4"
            />
          )}
          <label className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
            {presentationVideoPreview ? 'Changer la vidéo' : 'Ajouter une vidéo'}
            <input 
              type="file" 
              accept="video/*" 
              onChange={handlePresentationVideoChange} 
              className="hidden" 
            />
          </label>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-500">Gestion des Vidéos</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors font-bold"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Ajouter une vidéo
          </button>
        </div>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map(video => (
              <VideoUpdateCard
                key={video.id}
                video={video}
                mediaBaseUrl={mediaBaseUrl}
                onUpdate={handleUpdateVideo}
                onDelete={handleDeleteVideo}
                onChange={handleVideoChange}
              />
            ))}
          </div>
        ) : (
          <p>Aucune vidéo disponible</p>
        )}
      </div>

      {/* Modal d'ajout de vidéo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-orange-500">Ajouter une nouvelle vidéo</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <form onSubmit={handleAddVideo}>
              <div className="mb-4">
                <label className="block font-bold mb-2">Numéro:</label>
                <input
                  type="number"
                  value={newVideo.numero}
                  onChange={(e) => setNewVideo({...newVideo, numero: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Titre:</label>
                <input
                  type="text"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Description:</label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={4}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block font-bold mb-2">Fichier vidéo:</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewVideo({...newVideo, videoFile: file});
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-bold"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Ajouter
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-bold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateFormationPage;