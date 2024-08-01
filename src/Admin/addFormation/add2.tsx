import './add.css';
import React , { useState }from 'react';


const Add2: React.FC = () => {
  
    
    const [items, setItems] = useState([{ id: 1 }]);

    const addItems = () => {
      setItems([...items, { id: items.length + 1 }]);
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
    
  return (
    <div className='bodyform'>
       
      
       <form className='formvideo' action="">
      {items.map((item, index) => (
        <div className="itemvideo" key={item.id}>
          <input type="text" name={`titre-${item.id}`} placeholder={`titre-${item.id}`} />
          <input type="text" name={`desc-${item.id}`} placeholder={`description-${item.id}`} />
          <input type="file" name={`video-${item.id}`} placeholder={`video-${item.id}`} />
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

