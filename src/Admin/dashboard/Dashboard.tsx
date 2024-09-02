import './dashboard.css';
import React from 'react';
import axios from 'axios';
import Barside from '../barside/barside';
import { useEffect,useState } from 'react';
import API_URL from '../../API_URL';
import { it } from 'node:test';
import { url } from 'node:inspector';
import FormationItem from './formationItem'
const Dashboard: React.FC = () => {
  const [formations, setFormations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // État pour le chargement
  const [error, setError] = useState<string | null>(null); // État pour les erreurs

  const deleteformation = async (id: any) => {
    try {
      // Utiliser les backticks pour créer une chaîne de caractères dynamique
      const response = await axios.delete(`http://localhost:5000/formations/${id}`);
      console.log('Formation supprimée:', response.data);
      setFormations(formations.filter(formation => formation.id !== id));

    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
    }
  };
 
  useEffect(() => {
      // Fonction pour récupérer les formations
      const fetchFormations = async () => {
          try {
              const response = await axios.get(API_URL+'/formations'); // Remplacez l'URL par celle de votre API
              setFormations(response.data);
              setLoading(false);
          } catch (err) {
              setError('Erreur lors de la récupération des formations.');
              setLoading(false);
          }
      };

    //  const backgroundstyle = ()=>{
    //   formations.map((formation) => (
    //   document.getElementById(`it${formation.id}`)


      

    //  )) 
    //  }
     

      fetchFormations(); // Appel de la fonction lors du montage du composant
  }, []); // Le tableau vide [] signifie que ce useEffect se déclenche une seule fois

  // Affichage en fonction de l'état de l'application
  if (loading) {
      return <div>Chargement...</div>;
  }

  if (error) {
      return <div>{error}</div>;
  }

  

 
  
  return (
    <div className='bodydashboard'>
    
        
        <Barside title="dashboard"/>
        <div className="content">
        <div className="title"><h1>Dashborad</h1></div>
            <div className="titlecontent">
            {
              formations.map((formation,index) => (
               

               <FormationItem
               key={formation.id}
               formation={formation}
               index={index}
               deleteformation={() => deleteformation(formation.id)}
               />
               
                
                
              ))
            }
               

            </div>
            </div>
              
    </div>
  );
};

export default Dashboard;

