import React from 'react';
import axios from 'axios';
import Barside from '../barside/barside';
import { useEffect,useState } from 'react';
import API_URL from '../../API_URL';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import UpdateVideos from './updateVideos'
interface Videos{
    id:number;
    title:string;
    numero:number;
    link:string | File;
    description:string;
    formationId:number
}
interface into{
    show : boolean;
    step2: boolean;
    videos:Videos[];
    handleStep2 : ()=>void;
    onClose : () => void;
    videoUrl: string;
    formationId:number;
    imageUrl: string;
    name: string;
    description: string;
    duree: string;
    price: any;
}

const UpdateFormation: React.FC<into> = ({show,formationId,step2,videos,handleStep2,onClose,videoUrl,imageUrl,name,description,duree,price}) => {
    const [info, setInfo] = useState({ name:name,duree:duree,desc:description,price:price});
    const navigate = useNavigate();
    
    if(!show) return null;

   

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, files } = e.target;
//     if (files && files.length > 0) {
//       setInfo({ ...info, [name]: files[0] });
//     }
//   };
const sendvideoupdated = ()=>{
    
}
   const updateformation = async (id:number)=>{
    
   
    try{
        const updatedata = new FormData();
        updatedata.append('name', info.name);
        updatedata.append('duree', info.duree);
        updatedata.append('description', info.desc);
        updatedata.append('price', info.price);
       
   
        // updatedata.append('imageUrl', imageUrl);
        // updatedata.append('videoUrl', videoUrl);

        // if (info.image!=null) {
        //     updatedata.append('image', info.image);
        // }else{
        //     updatedata.append('imageUrl', imageUrl);
        // }
        // if (info.video!=null) {
        //     updatedata.append('video', info.video);
        // }else{
        //     updatedata.append('videoUrl', videoUrl);
        // }
       
       
   
        handleStep2();
       const respon = await axios.put(`${API_URL}/api/formations/${id}`,updatedata)
        console.log("response de puis le backend update formation : "+ respon)

    }catch(err){
        console.log("erreur")
        alert("erreuuuuuuur !!!!!!!!!!!!!!!1")
    }
 
   }
if (step2) {
    return (
        <UpdateVideos 
        videos={videos}
        onClose={onClose}
        formationIde={formationId}
        />
    )
}
// if (show && !step2 ) {
    

    return (
        <div className="fixed inset-0 bg-gray-600  flex justify-center items-center z-50">
      <div style={{flexFlow:"column"}} className="bg-white flex  justify-center p-4 rounded-lg w-3/4 max-w-3xl">
           
                <div style={{position:"relative"}} className="flex justify-end">
                <button onClick={onClose} className="text-black text-2xl font-bold">&times;</button>
                </div>

                 <div style={{alignContent:"center"}}><h1>les information du formation : {info.name}</h1></div> 
                
                    <form onSubmit={()=>updateformation(formationId)} >
                        <input required onChange={handleInputChange} value={info.name}  placeholder="Nom du formation" type="text" name="name"  id="name" />
                        <input required onChange={handleInputChange} value={info.duree} placeholder="Durée"    type="text"         name="duree" id="duree" />
                        <input required onChange={handleInputChange} value={info.desc}  placeholder="Description" type="text"      name="desc"  id="description" />
                        <input required onChange={handleInputChange} value={info.price} placeholder="Prix" type="text"             name="price" id="price" />
                        <input style={{cursor:"pointer"}}  type="submit" id="submit" value="Suivant" name="submit"  />
                    </form>
                    </div>
                    </div>
      );
}
// }
export default UpdateFormation;