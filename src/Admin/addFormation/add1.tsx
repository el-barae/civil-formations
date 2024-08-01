import './add.css';
import React from 'react';
import axios from 'axios';
import Barside from '../barside/barside';

const Add1: React.FC = () => {
  return (
    <div className='bodyform add'>
        <Barside title='Ajouter une formation'/>
        <form action="./add2" >
            <input placeholder="Nom du formation" type="text" name="name" id="name"/>
            <input placeholder="Duree" type="text" name="duree" id="duree"/>
            <input placeholder="description" type="text" name="description" id="description"/>
            <input placeholder="prix" type="text" name="price" id="price"/>
            <label >Image :</label><input placeholder="choisir une image" type="file" name="image" id="image"/> 
            <label >Video presentative : </label> <input placeholder="video de presentation" type="file" name="video" id="video"/>
            <input type="submit" id="submit" value="Suivant" name="submit"/>
        </form>
    </div>
    

   

  
  );
};

export default Add1;

