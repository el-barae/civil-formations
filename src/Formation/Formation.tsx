import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav/Nav';
import API_URL from '../API_URL';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faClock ,faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import VideoDescriptionModal from './VideoDescriptionModal';
import { jwtDecode } from "jwt-decode";

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
  View: View | null;
}

interface View {
  id: number;
  view: boolean;
  userId: number;
  videoId: number;
}

const FormationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('token');
      if (loginStatus) {
        setIsLoggedIn(true);
      } else {
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
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchFormation = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/formations/${id}`);
          setFormation(response.data);
        } catch (error) {
          console.error('Error fetching formation:', error);
        }
      };
      
      const fetchVideos = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get<Video[]>(`${API_URL}/api/videos/formation/${id}`,{
            headers :{
              'Content-Type': 'application/json',
              'x-auth-token': token
            }
          });
          const videosData = response.data;


        const viewsResponse = await axios.get<View[]>(`${API_URL}/api/views/user/1`,{
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
        } catch (error) {
          console.error('Error fetching videos:', error);
        }
      };

      fetchFormation();
      fetchVideos();
    }
  }, [id, isLoggedIn]);

  const handleVideoClick = (video:any) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };
  if (!formation) {
    return <div>Loading...</div>;
  }

  const handlePlay = async (videoId:number) => {
    try {
      const token = localStorage.getItem('token')
      if(token){
        const decoded = jwtDecode(token) as { id: string };
        const { id} = decoded;
      await axios.post(`${API_URL}/api/views/set/${id}/${videoId}`,{
        headers :{
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, View: video.View ? { ...video.View, view: true } : { id: videoId, view: true, userId: Number(id), videoId } } 
          : video
      ));
    }
    } catch (error) {
      console.error('Error updating view status:', error);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg w-full h-full">
      <Nav/>
      <div className="bg-cover bg-center p-8 text-center" style={{ backgroundImage: `url(${formation.image})`, height:"500px" }} id='header'>
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
                <video controls controlsList="nodownload" src={video.link} className="w-full rounded mt-4 mb-4" onPlay={() => handlePlay(video.id)} />
                <div className='flex justify-between'>
                    <button
                onClick={() => handleVideoClick(video)}
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg"
              >
                Description
              </button>
              <span className={`mt-6 p-2 rounded text-white  ${video.View?.view ? 'bg-yellow-500' : 'bg-gray-600'}`}>
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
    </div>
  );
};

export default FormationPage;
