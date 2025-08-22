import './visualiser.css';
import React from 'react';
import Barside from '../barside/barside';

const Visualiser: React.FC = () => {
  return (
    <div className='bodyvisualiser'>
    
        <Barside title='visualiser'/>
        <div className="content">
        <div className="title"><h1>Visualiser</h1></div>
            <div className="titlecontent">

            </div>
        </div>
    </div>
    

   

  
  );
};

export default Visualiser;

