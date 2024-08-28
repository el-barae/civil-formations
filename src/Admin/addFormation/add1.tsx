import './add.css';
import React, { useState } from 'react';
import axios from 'axios';
import Barside from '../barside/barside';
import { useNavigate } from 'react-router-dom';


const Add1: React.FC = () => {
  const [info, setInfo] = useState({ name: '', duree: '', desc: '', price: '', image: null as File | null, video: null as File | null });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setInfo({ ...info, [name]: files[0] });
    }
  };



  return (
    <div className='bodyform'>
    
        <Barside title='add'/>
        <div className="content">
       
            <div className="titlecontent">
            <form onSubmit={()=>navigate('/Admin/add2', { state: { info } })}>
                  <input required value={info.name} onChange={handleInputChange} placeholder="Nom du formation" type="text" name="name" id="name" />
                  <input required value={info.duree} onChange={handleInputChange} placeholder="Durée" type="text" name="duree" id="duree" />
                  <input required value={info.desc} onChange={handleInputChange} placeholder="Description" type="text" name="desc" id="description" />
                  <input required value={info.price} onChange={handleInputChange} placeholder="Prix" type="text" name="price" id="price" />
                  <label>Image :</label><input required accept='.png , .jpeg, .jpg , .img' onChange={handleFileChange} type="file" name="image" id="image" />
                  <label>Vidéo présentative :</label><input required accept='.mp4' onChange={handleFileChange} type="file" name="video" id="video" />
                  <input  type="submit" id="submit" value="Suivant" name="submit"  />
                </form>
            </div>
        </div>
    </div>
  );
};

export default Add1;
