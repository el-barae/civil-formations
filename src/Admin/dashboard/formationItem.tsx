import React from 'react';
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Update from './updateFormation'
import './dashboard.css';
import API_URL from '../../API_URL';

interface formation{
    id: number;
    name: string;
    duree: string;
    description: string;
    price: number;
    image: string;
    video: string;

}
interface intopro{
    formation:formation;
    deleteformation:(id:number)=>void;
    index:number;
}

const FormationItem: React.FC<intopro> = ({formation,deleteformation,index}) => {
const navigate = useNavigate();
const [show, setshows] = useState<boolean>(false);
const [step2,setstep2] = useState(false);
const [videos, setVideos] =  useState<any[]>([]);


useEffect(() => {
    // Fonction pour récupérer les formations
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/videos/formation/${formation.id}`);
            response.data.sort((a:any,b:any)=>{
              return a.numero - b.numero
            })
            setVideos(response.data);
            console.log("les videos de cette formation et :",response.data)
        } catch (err) {
            console.log("erreur lors de la recuperation des videos");
        }
    };
   
   

    fetchVideos(); // Appel de la fonction lors du montage du composant
}, []);


// État pour stocker les formations
const updatehandler = (e: React.MouseEvent, id:number)=>{
    e.preventDefault();
    navigate(`/Admin/updateFormation/${id}`)
  }
  const handleCloseModal = ()=>{
    setshows(false);
    setstep2(false)
  }
  const handleStep2 = ()=>{
  
    setstep2(true)
  }

const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

return(
    <div 
                key={formation.id}
                id={"it"+ formation.id}
                className="box"
                style={{
              backgroundImage: `url(${mediaBaseUrl}${formation.image})`,
                  backgroundSize: 'cover',
                }}
                >
                  <a  key={formation.id} onClick={e=>(updatehandler(e,formation.id))} href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a>
                       <h1>{formation.name}</h1>
                  <a onClick={() => deleteformation(formation.id)}><i className="fa-regular fa-trash-can"></i></a>
              
                  <div style={{position:'absolute',display:"flex",alignItems:"center",justifyContent:"center",flexFlow:"wrap",flexGrow:"1"}} className='card'>
                      <Update 
                    show={show}
                    step2={step2}
                    videos={videos}
                    handleStep2={handleStep2}
                    onClose={handleCloseModal}
                    formationId={formation.id}
                    videoUrl={formation.video}
                    imageUrl={formation.image}
                    name={formation.name}
                    description={formation.description}
                    duree={formation.duree}
                    price={formation.price}
                  />
                 

                  </div> 
                </div>
)
};
export default FormationItem;