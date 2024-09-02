import React from "react";
import { useState , useEffect } from "react";
import axios from "axios";
import API_URL from "../../API_URL";
import { useNavigate } from "react-router-dom";
import './dashboard.css';
interface Videos{
    id:number;
    title:string;
    numero:number;
    link:string;
    description:string;
    formationId:number
}
interface into {
    videos:Videos[];
    onClose : () => void;
    formationIde:number
}

const UpdateFormation: React.FC<into>= ({videos,onClose,formationIde}) => {
 
    const [items, setItems] = useState(videos);
    const [show1,setshow1]=useState("block");
    const [show2,setshow2]=useState("none");


const navigate = useNavigate();
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
      setshow2("block");
      setshow1("none")
        try {
// const formData = new FormData();
        items.forEach(async (item, index) => {
          const obj =
            {
              title: item.title,   //la methode append n'accept que des string et des bool.
              numero:item.numero,
              link:item.link,
              description:item.description,
              formationId:formationIde
            };

            console.log(formationIde+" "+item.formationId)
            // formData.append(`videos[${index}][title]`, item.title);
            // formData.append(`videos[${index}][description]`, item.description);
            // formData.append(`videos[${index}][id]`, item.id);
            // formData.append(`videos[${index}][numero]`, item.numero.toString());

            // if (item.link) {
            //     formData.append(`videos[${index}][link]`, item.link);
            // }
            // formData.append(`videos[formationId]`, item.formationId.toString());
           await axios.put(`${API_URL}/api/videos/${item.id}`, obj);

        });
    
    
    
       
        
    } catch (error) {
        console.error('There was an error submitting the videos form update !', error);
    }
    
   
      };
      
    return(
        <div className="fixed inset-0 bg-gray-600  flex justify-center items-center z-50">
        <div style={{flexFlow:"column"}} className="bg-white flex  justify-center p-4 rounded-lg w-3/4 max-w-3xl">
             
                  <div style={{position:"relative"}} className="flex justify-end">
                  <button onClick={onClose} className="text-black text-2xl font-bold">&times;</button>
                  </div>
   
 <form onSubmit={handleSubmit} className='formvideo'>
  <div className="video-container">
    {items.map((video) => (
      <div className="video" key={video.id}>
        <input 
          type="text" 
          name={`titre-${video.id}`} 
          onChange={(e) => handleInputChange(video.id, 'title', e.target.value)}
          placeholder={`titre ${video.id}`} 
          value={video.title}
          
        />
        
        <input 
          type="text" 
          name={`desc-${video.id}`} 
          onChange={(e) => handleInputChange(video.id, 'description', e.target.value)}
          placeholder="Description" 
          value={video.description}
          
        />
        <input 
        style={{backgroundColor:"black"}}
          type="file" 
          name={`video-${video.id}`} 
          onChange={(e) => handleFileChange(video.id, e)}
          accept='.mp4'
          
        />

        {/* 
        <button type="button" onClick={addItems} className="icon-button">
          <i id='iconadd' className="fa-solid fa-plus"></i>
        </button>
        
        <button type="button" onClick={() => removeItems(item.id)} className="icon-button">
          <i id='iconremove' className="fa-solid fa-trash-can"></i>
        </button> 
        */}
      </div>
    ))}
  </div>

  <button  style={{display:`${show1}`}}  type="submit">Ajouter</button>
  <button  style={{display:`${show2}`}} onClick={(e:any)=>{e.preventDefault();  navigate("/#formations");}}  type="submit">Retour</button>

</form>

                   
                    
             
                      </div>
                   
                      </div>
    )

};
export default UpdateFormation;

