import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormationItem from './FormationItem';
import Nav from '../components/Nav/Nav';
import API_URL from '../API_URL';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faGear } from '@fortawesome/free-solid-svg-icons';
import ProfileEditModal from './ProfileEditModal'
import { jwtDecode } from 'jwt-decode';

interface User{
  id:number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  Subscribes: Subscribe[];
}

interface Formation {
  id: string;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

interface Subscribe {
  id: string;
  pourcentage: number;
  formationId: string;
  userId: string;
  Formation: Formation;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscribes, setSubscribes] = useState<Subscribe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('token');
      if (loginStatus) {
        setIsLoggedIn(true);
      } else {
        Swal.fire({
          title: 'Non connecté',
          text: 'Vous devez vous connecter pour voir votre profil.',
          icon: 'warning',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/login');
        });
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if(token){
        const decoded = jwtDecode(token) as { id: string };
        const { id} = decoded;
      const response = await axios.get(`${API_URL}/api/users/profile/`+id,{
        headers :{
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      const userData = response.data;
      setUser(userData);
      if (userData && userData.Subscribes) {
        setSubscribes(userData.Subscribes);
      }
    }
    } catch (error) {
      setError('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isModalOpen) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, isModalOpen]);

  const handleSave = async (updatedUser: User) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(`${API_URL}/api/users/profile/${user?.id}`, updatedUser,{
        headers :{
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      setUser(response.data); // Update the local state with the new user data
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }// Update the local state with the new user data

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Nav />
      {user && (
        <div className="flex justify-between pt-32 p-16 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <div>
          <h2 className="text-4xl font-bold mb-6">{user.firstName} {user.lastName}</h2>
          <p className="text-lg mb-2">
            <strong className="text-orange-700 mr-2">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Email:
            </strong> {user.email}
          </p>
          <p className="text-lg mb-2">
            <strong className="text-orange-700 mr-2">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Téléphone:
            </strong> {user.phone}
          </p>
          <p className="text-lg mb-2">
            <strong className="text-orange-700 mr-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              Adresse:
            </strong> {user.address}
          </p>
          <button onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faGear} className='mt-6 ml-6 text-4xl text-gray-700 cursor-pointer' />
        </button>
          </div>
          <ProfileEditModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSave={handleSave}
      />
          <div className='mr-32 hidden lg:flex'>
            <img src="/profile.png" width={'250px'} height={'200px'} alt="" />
          </div>
        </div>
      )}
      <div>
        <h2 className="text-orange-500 text-3xl font-bold my-6 ml-16">Formations</h2>
        <div className="grid grid-cols-2 gap-4 justify-items-center">
          {subscribes.map((subscribe, index) => (
            <FormationItem key={subscribe.id} subscribe={subscribe} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
