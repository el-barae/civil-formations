import './add.css';
import React , { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const Add2: React.FC = () => {
  
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
    try {
      const formData = new FormData();
      items.forEach((item, index) => {
        formData.append(`videos[${index}][titre]`, item.titre);
        formData.append(`videos[${index}][desc]`, item.desc);
        if (item.video!=null) {
                  formData.append(`videos[${index}][video]`, item.video);
        }
      });
      const response = await axios.post('http://localhost:5000/api/videos', formData);
      console.log("response depuis backend:"+response.data);








      const formData1 = new FormData();
      formData1.append('videos[name]', info.name);
      formData1.append('videos[desc]', info.desc);
      formData1.append('videos[duree]', info.duree);
      formData1.append('videos[price]', info.price);
      if (info.image) {
        formData1.append('videos[image]', info.image);
      }
      if (info.video) {
        formData1.append('videos[video]', info.video);
      }
      const response1 = await axios.post('http://localhost:5000/api/formation', formData1);
      console.log("Réponse depuis backend formation :", response1.data);
    } 
    catch (error) {
      console.error('There was an error submitting the form 2!', error);
    }
  };
  
  

  return (
    <div className='bodyform'>
     
      <p>{info.desc}</p>
      <p>{info.price}</p>
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



          <a onClick={addItems}><i id='iconadd' className="fa-solid fa-plus"></i></a>
          <a onClick={() => removeItems(item.id)}><i id='iconremove' className="fa-solid fa-trash-can"></i></a>
        </div>
      ))}
      <button type="submit">Ajouter</button>
    </form>
    </div>
      );
};

export default Add2;

