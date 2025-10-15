import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav/Nav';
import API_URL from '../API_URL';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock, faEye, faEyeSlash, faPlay, faCheckCircle, faLock, faInfo} from '@fortawesome/free-solid-svg-icons';
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

interface Commentaire {
  id: number;
  commentaire: string;
  User: User;
  videoId: number;
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
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [avis, setAvis] = useState<Avis[]>([]); 
  const [newComment, setNewComment] = useState('');
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<Video | null>(null);

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
            // Sélectionner automatiquement la première vidéo
            if (videosWithViews.length > 0) {
              setCurrentPlayingVideo(videosWithViews[0]);
            }
          }
        } catch (error) {
        }
      };

      fetchFormation();
      fetchVideos();
    }
  }, [id, location.state]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleSelectVideo = (video: Video) => {
    setCurrentPlayingVideo(video);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-700 font-medium">Chargement de votre formation...</p>
        </div>
      </div>
    );
  }

  const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';
  const completedVideos = videos.filter(v => v.View?.view).length;
  const progressPercentage = videos.length > 0 ? (completedVideos / videos.length) * 100 : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Nav/>
      
      {/* Hero Section avec Overlay Gradient */}
      <div className="relative bg-cover bg-center" style={{ backgroundImage: `url(${mediaBaseUrl}${formation.image})`, height:"450px" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 drop-shadow-2xl">{formation.name}</h1>
          <div className="flex items-center gap-4 text-lg">
            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              {formation.duree}
            </span>
            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
              {completedVideos}/{videos.length} vidéos complétées
            </span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-8 bg-orange-500 rounded-full mr-4"></span>
            Description
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{formation.description}</p>
          
          {/* Barre de progression */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">Progression de la formation</span>
              <span className="text-sm font-bold text-orange-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Section Vidéo Principal + Playlist */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="w-2 h-8 bg-orange-500 rounded-full mr-4"></span>
            Contenu de la Formation
          </h2>
          
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vidéo Player Principal */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {currentPlayingVideo && (
                    <>
                      <div className="relative md:px-12 px-4">
                        <VideoPlayer
                          url={`${mediaBaseUrl}${currentPlayingVideo.link}`}
                          title={currentPlayingVideo.title}
                          onPlay={() => handlePlay(currentPlayingVideo.id, videos.length)}
                          hasViewed={currentPlayingVideo.View?.view || false}
                        />
                        {currentPlayingVideo.View?.view && (
                          <div className="absolute top-4 md:right-14 right-8 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                            Complétée
                          </div>
                        )}
                      </div>
                      
                      <div className="py-6 md:px-10 px-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                Vidéo {currentPlayingVideo.numero}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                currentPlayingVideo.View?.view 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                <FontAwesomeIcon icon={currentPlayingVideo.View?.view ? faEye : faEyeSlash} className="mr-1" />
                                {currentPlayingVideo.View?.view ? 'Vue' : 'Non vue'}
                              </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                              {currentPlayingVideo.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {currentPlayingVideo.description || "Découvrez cette vidéo pour approfondir vos connaissances."}
                            </p>
                          </div>
                        </div>
                        
                        {/* <button
                          onClick={() => handleVideoClick(currentPlayingVideo)}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                        >
                          <FontAwesomeIcon icon={faInfo} className="mr-2" />
                          Plus de détails
                        </button> */}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Playlist Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 max-h-[800px] overflow-y-auto">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faPlay} className="mr-2 text-orange-500" />
                    Playlist ({videos.length})
                  </h3>
                  
                  <div className="space-y-3">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleSelectVideo(video)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          currentPlayingVideo?.id === video.id
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                            currentPlayingVideo?.id === video.id
                              ? 'bg-white/20 text-white'
                              : video.View?.view
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {video.numero}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold mb-1 line-clamp-2 ${
                              currentPlayingVideo?.id === video.id ? 'text-white' : 'text-gray-800'
                            }`}>
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon 
                                icon={video.View?.view ? faCheckCircle : faLock} 
                                className={`text-sm ${
                                  currentPlayingVideo?.id === video.id 
                                    ? 'text-white' 
                                    : video.View?.view 
                                    ? 'text-green-500' 
                                    : 'text-gray-400'
                                }`}
                              />
                              <span className={`text-xs font-medium ${
                                currentPlayingVideo?.id === video.id ? 'text-white' : 'text-gray-500'
                              }`}>
                                {video.View?.view ? 'Complétée' : 'À voir'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FontAwesomeIcon icon={faPlay} className="text-6xl" />
              </div>
              <p className="text-xl text-gray-600">Aucune vidéo disponible pour le moment</p>
            </div>
          )}
          
          <VideoDescriptionModal show={isModalOpen} onClose={closeModal} video={selectedVideo} />
        </div>

        {/* Section Avis */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-2 h-8 bg-orange-500 rounded-full mr-4"></span>
            Avis et Commentaires
          </h2>
          
          <div className="space-y-4 mb-8">
            {avis && avis.length > 0 ? (
              avis.map((avisItem) => (
                <div key={avisItem.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow duration-300">
                  <p className="text-gray-800 text-lg mb-3">{avisItem.commentaire}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {avisItem.User?.firstName?.charAt(0)}{avisItem.User?.lastName?.charAt(0)}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {avisItem.User?.firstName} {avisItem.User?.lastName || 'Anonyme'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Soyez le premier à laisser un avis sur cette formation!</p>
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre expérience avec cette formation..."
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
              rows={4}
              required
            />
            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-8 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Publier mon avis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormationPage;