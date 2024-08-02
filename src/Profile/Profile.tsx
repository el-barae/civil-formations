import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormationItem from './FormationItem';
import Nav from '../components/Nav/Nav';
import API_URL from '../API_URL';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import useIntersectionObserver from './useIntersectionObserver'

interface User{
  id:number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
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

interface FormationItemProps {
  formation: Formation;
  index: number;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscribes, setSubscribes] = useState<Subscribe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('login');
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

  useEffect(() => {
    if (isLoggedIn) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/users/profile/1`);
          const userData = response.data;
          setUser(userData);
          if (userData && userData.Subscribes) {
            setSubscribes(userData.Subscribes);
          }
        } catch (error) {
          setError('Error fetching profile data');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Nav />
      {user && (
        <div className="pt-24 p-12 bg-orange-500 text-white">
          <h2 className="text-3xl font-bold mb-4">{user.firstName} {user.lastName}</h2>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
          <p className="text-lg"><strong>Phone:</strong> {user.phone}</p>
          <p className="text-lg"><strong>Address:</strong> {user.address}</p>
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
