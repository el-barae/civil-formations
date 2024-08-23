import './dashboard.css';
import React from 'react';
import axios from 'axios';
import Barside from '../barside/barside';
import { useEffect,useState } from 'react';

const Dashboard: React.FC = () => {
  const [formations, setFormations] = useState<any[]>([]); // État pour stocker les formations
  const [loading, setLoading] = useState<boolean>(true); // État pour le chargement
  const [error, setError] = useState<string | null>(null); // État pour les erreurs

  useEffect(() => {
      // Fonction pour récupérer les formations
      const fetchFormations = async () => {
          try {
              const response = await axios.get('http://localhost:3000/formations'); // Remplacez l'URL par celle de votre API
              setFormations(response.data);
              setLoading(false);
          } catch (err) {
              setError('Erreur lors de la récupération des formations.');
              setLoading(false);
          }
      };

      fetchFormations(); // Appel de la fonction lors du montage du composant
  }, []); // Le tableau vide [] signifie que ce useEffect se déclenche une seule fois

  // Affichage en fonction de l'état de l'application
  if (loading) {
      return <div>Chargement...</div>;
  }

  if (error) {
      return <div>{error}</div>;
  }
  const deleteformation = async (id: any) => {
    try {
      // Utiliser les backticks pour créer une chaîne de caractères dynamique
      const response = await axios.delete(`http://localhost:3000/formations/${id}`);
      console.log('Formation supprimée:', response.data);
      setFormations(formations.filter(formation => formation.id !== id));

    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
    }
  };
  
  return (
    <div className='bodydashboard'>
    
        
        <Barside title="dashboard"/>
        <div className="content">
        <div className="title"><h1>Dashborad</h1></div>
            <div className="titlecontent">
            {
              formations.map((formation) => (
                 <div id="it1" key={formation.id} className="box">
                  <a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a>
                  <h1>{formation.name}</h1>
                  <a onClick={() => deleteformation(formation.id)}><i className="fa-regular fa-trash-can"></i></a>
                  </div>
              ))
            }
               

            </div>
            </div>
    </div>
    

   

  
  );
};

export default Dashboard;

