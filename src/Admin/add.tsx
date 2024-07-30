import './add.css';
import React from 'react';
import axios from 'axios';
import Barside from './barside';

const Add: React.FC = () => {
  return (
    <div className='bodyform add'>
        <Barside title='add'/>
        <form action="" method="post">
            <input placeholder="Nom du formation" type="text" name="name" id="name"/>
            <input placeholder="Duree" type="text" name="duree" id="duree"/>
            <input placeholder="description" type="text" name="description" id="description"/>
            <input placeholder="prix" type="text" name="price" id="price"/>
            <input placeholder="image" type="file" name="image" id="image"/> 
            <input type="submit" id="submit" value="Suivant" name="submit"/>
        </form>
    </div>
    

   

  
  );
};

export default Add;

