import './add.css';
import React , { useState }from 'react';
import axios from 'axios';


const Add2: React.FC = () => {
  
  const [items, setItems] = useState([{ id: 1, titre: '', desc: '', video: '' }]);

    const addItems = () => {
      setItems([...items, { id: items.length + 1, titre: '', desc: '', video: '' }]);
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

  const handleInputChange = (id:any, name:string, value:string) => {
    setItems(items.map(item => (item.id === id ? { ...item, [name]: value } : item)));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      items.forEach((item, index) => {
        formData.append(`videos[${index}][titre]`, item.titre);
        formData.append(`videos[${index}][desc]`, item.desc);
        formData.append(`videos[${index}][video]`, item.video);

      });
      const response = await axios.post('http://localhost:5000/api/videos', formData);
      console.log("data fe:"+response.data);
    } catch (error) {
      console.error('There was an error submitting the form!', error);
    }
  };
    
  return (
    <div className='bodyform'>
       <form className='formvideo' onSubmit={handleSubmit}>
      {items.map((item) => (
        <div className="item" key={item.id}>
          <input 
            type="text" 
            name={`titre-${item.id}`} 
            placeholder="Titre" 
            value={item.titre}
            onChange={(e) => handleInputChange(item.id, 'titre', e.target.value)}
          />
          <input 
            type="text" 
            name={`desc-${item.id}`} 
            placeholder="Description" 
            value={item.desc}
            onChange={(e) => handleInputChange(item.id, 'desc', e.target.value)}
          />
          <input 
            type="file" 
            name={`video-${item.id}`} 
            placeholder="video" 
          
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

