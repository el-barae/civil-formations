import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav/Nav';
import API_URL from '../API_URL';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock ,faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import VideoDescriptionModal from './VideoDescriptionModal';
import { jwtDecode } from "jwt-decode";
import VideoPlayer from './VideoPlayer';

interface Formation {
  id: number;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
  Avis: Avis[];
}

interface Video {
  id: number;
  title: string;
  numero: number;
  link: string;
  description: string;
  View: View | null;
}

interface View {
  id: number;
  view: boolean;
  userId: number;
  videoId: number;
}

interface Avis {
  id: number;
  commentaire: string;
  User: User;
  formationId: number;
}

interface User{
  id:number,
  firstName: string,
  lastName: string,
  email: string,
}

const FormationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [avis, setAvis] = useState<Avis[]>([]); 
  const [newComment, setNewComment] = useState('');

  // Vérification simple avec useLocation
useEffect(() => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    Swal.fire({
      title: 'Non connecté',
      text: 'Vous devez vous connecter pour voir cette formation.',
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

  // Vérifier si l'utilisateur vient du profil ou du paiement
  if (!location.state?.fromProfile) {
    Swal.fire({
      title: 'Accès refusé',
      text: 'Vous devez accéder à cette formation depuis votre profil.',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal2-confirm-custom'
      }
    }).then(() => {
      navigate('/profile');
    });
    return;
  }

  // Message de bienvenue si vient du paiement
  if (location.state?.fromPayment) {
    Swal.fire({
      title: 'Bienvenue !',
      text: 'Vous pouvez maintenant profiter de votre formation.',
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    });
  }
}, [location, navigate]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if(token){
        const decoded = jwtDecode(token) as { id: string };
        const userId: string = decoded.id;
        
        const response = await fetch(API_URL+'/api/avis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            commentaire: newComment,
            userId: userId,
            formationId: id,
          }),
        });

        if (response.ok) {
          const newAvis = await response.json();
          setAvis([...avis, newAvis]); 
          setNewComment(''); 
          
          Swal.fire({
            title: 'Succès',
            text: 'Votre commentaire a été ajouté avec succès.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: 'Erreur',
            text: 'Impossible d\'ajouter le commentaire.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  useEffect(() => {
    // Charger les données seulement si l'accès est autorisé
    if (location.state?.fromProfile) {
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
      
          if (formationData.Avis) {
            setAvis(formationData.Avis);
          }
        } catch (error) {
        }
      };
      
      const fetchVideos = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get<Video[]>(`${API_URL}/api/videos/formation/${id}`,{
            headers :{
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          const videosData = response.data;

          if(token){
            const decoded = jwtDecode(token) as { id: string };
            const userId = decoded.id;
            
            const viewsResponse = await axios.get<View[]>(`${API_URL}/api/views/user/${userId}`,{
              headers :{
                'Content-Type': 'application/json',
                'x-auth-token': token
              }
            });
            const viewsData = viewsResponse.data;

            const videosWithViews = videosData.map(video => {
              const view = viewsData.find(v => v.videoId === video.id);
              return { ...video, View: view || null };
            });

            setVideos(videosWithViews);
          }
        } catch (error) {
        }
      };

      fetchFormation();
      fetchVideos();
    }
  }, [id, location.state]);

  const handleVideoClick = (video:any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handlePlay = async (videoId:number, nvideos:number) => {
    try {
      const token = localStorage.getItem('token');
      if(token){
        const decoded = jwtDecode(token) as { id: string };
        const userId = decoded.id;
        const pourcentage = Math.floor(100/nvideos);
        const idFormation = id;
        await axios.post(
          `${API_URL}/api/views/set/${userId}/${videoId}`,
          {
            pourcentage,
            idFormation
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          }
        );

        setVideos(videos.map(video => 
          video.id === videoId 
            ? { ...video, View: video.View ? { ...video.View, view: true } : { id: videoId, view: true, userId: Number(userId), videoId } } 
            : video
        ));
      }
    } catch (error) {
    }
  };

  if (!location.state?.fromProfile) {
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

  const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

  return (
    <div className="w-full h-full">
      <Nav/>
      <div className="bg-cover bg-center p-8 text-center" style={{ backgroundImage: `url(${mediaBaseUrl}${formation.image})`, height:"500px" }} id='header'>
        <h1 className="text-4xl mt-32 font-bold">{formation.name}</h1>
      </div>
      <div className='m-12'>
        <p className="mb-4"><strong className='text-2xl text-orange-500'>Description:</strong><br /> {formation.description}</p>
        <p className="font-bold"><FontAwesomeIcon icon={faClock} className="mr-2 text-xl" />{formation.duree}</p>
      </div>
      <div className='m-10'>
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Vidéos</h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map(video => (
              <div key={video.id} className="bg-gray-100 rounded-lg p-4 shadow-xl">
                <h3 className="text-xl font-bold">{video.numero}. {video.title}</h3>
                <VideoPlayer
                  url={`${mediaBaseUrl}${video.link}`}
                  title={video.title}
                  onPlay={() => handlePlay(video.id, videos.length)}
                  hasViewed={video.View?.view || false}
                />

                <div className='flex justify-between'>
                  <button
                    onClick={() => handleVideoClick(video)}
                    className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Description
                  </button>
                  <span className={`mt-6 p-2 rounded text-white ${video.View?.view ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                    {video.View?.view ? <FontAwesomeIcon icon={faEye} className="text-xl" />: <FontAwesomeIcon icon={faEyeSlash} className="text-xl" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune vidéo disponible</p>
        )}
        <VideoDescriptionModal show={isModalOpen} onClose={closeModal} video={selectedVideo} />
      </div>
      
      <div className="m-10">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Avis</h2>
        <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
          {avis && avis.length > 0 ? (
            avis.map((avisItem) => (
              <div key={avisItem.id} className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <p className="text-gray-800">{avisItem.commentaire}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Par: {avisItem.User?.firstName} {avisItem.User?.lastName || 'Anonyme'}
                </p>
              </div>
            ))
          ) : (
            <p>Aucun avis pour le moment.</p>
          )}

          <form onSubmit={handleSubmitComment} className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              required
            />
            <button
              type="submit"
              className="mt-4 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Soumettre
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormationPage;