import React from 'react';
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const updatehandler = (e: React.MouseEvent, id:number) => {
        e.preventDefault();
        // Passer l'état via navigate
        navigate(`/Admin/updateFormation/${id}`, {
            state: { fromDashboard: true, formationId: id }
        });
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
            <a key={formation.id} onClick={e=>(updatehandler(e,formation.id))} href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a>
            <h1>{formation.name}</h1>
            <a onClick={() => deleteformation(formation.id)}><i className="fa-regular fa-trash-can"></i></a>
          
            <div style={{position:'absolute',display:"flex",alignItems:"center",justifyContent:"center",flexFlow:"wrap",flexGrow:"1"}} className='card'>
            </div> 
        </div>
    )
};

export default FormationItem;