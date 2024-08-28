import './add.css';
import React , { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../API_URL';
import { useNavigate } from 'react-router-dom';

const Add2: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ id: 1, titre: '', desc: '', video: null }]);
  const location = useLocation();
  const { info } = location.state;
    const addItems = () => {
      setItems([...items, { id: items.length + 1, titre: '', desc: '', video: null }]);
    };
  
     const removeItems = (id: number) => {
      if (window.confirm(`Are you sure you want to delete video number ${id}?`)) {
        let updatedItems = items.filter(item => item.id !== id);
        updatedItems = updatedItems.map((item, index) => ({
          ...item,
          id: index + 1
        }));
        setItems(updatedItems);
      }
  };

  const handleInputChange = (id:any, name:string, value: string | File) => {
    setItems(items.map(item => (item.id === id ? { ...item, [name]: value } : item)));
  };
  const handleFileChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleInputChange(id, 'video', files[0]);
    }
  };
  


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setTimeout(function() {
      navigate("/Admin/dashboard");
  }, 3000);

    try {
      const formData1 = new FormData();
    formData1.append('name', info.name);
    formData1.append('duree', info.duree);
    formData1.append('description', info.description);
    formData1.append('price', info.price);
    if (info.image) {
        formData1.append('image', info.image);
    }
    if (info.video) {
        formData1.append('video', info.video);
    }

    const response1 = await axios.post(`${API_URL}/api/formations`, formData1);
    console.log("Réponse depuis backend formation :", response1.data);

    const formData = new FormData();
    items.forEach((item, index) => {
        formData.append(`videos[${index}][title]`, item.titre);
        formData.append(`videos[${index}][description]`, item.desc);
        if (item.video) {
            formData.append(`videos[${index}][link]`, item.video);
        }
    });
    formData.append(`videos[formationname]`, info.name);


    const response = await axios.post(`${API_URL}/api/videos`, formData);
    console.log("Réponse depuis backend videos :", response.data);
    
} catch (error) {
    console.error('There was an error submitting the videos form!', error);
}
  
 
  };
  
  

  return (
    <div className='bodyform2'>
      <p>{info.name}</p><br />
      <p>{info.desc}</p><br />
      <p>{info.price}</p><br />
      <p>{info.duree}</p> 
       <form className='formvideo' onSubmit={handleSubmit}>
      {items.map((item) => (
        <div className="item" key={item.id}>
          <input 
            type="text" 
            name={`titre-${item.id}`} 
            placeholder={`titre ${item.id}`} 
            value={item.titre}
            onChange={(e) => handleInputChange(item.id, 'titre', e.target.value)}
            required
          />
          <input 
            type="text" 
            name={`desc-${item.id}`} 
            placeholder="Description" 
            value={item.desc}
            onChange={(e) => handleInputChange(item.id, 'desc', e.target.value)}
            required
          />
          <input 
            type="file" 
            name={`video-${item.id}`} 
            onChange={(e) => handleFileChange(item.id, e)}
            accept='.mp4'
            required
          />



          <button type="button" onClick={addItems} className="icon-button">
            <i id='iconadd' className="fa-solid fa-plus"></i>
          </button>
          
          <button type="button" onClick={() => removeItems(item.id)} className="icon-button">
            <i id='iconremove' className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      ))}
      <button  type="submit">Ajouter</button>
    </form>
    </div>
      );
};

export default Add2;

