import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Barside from '../barside/barside';
import Swal from 'sweetalert2';
import API_URL from '../../API_URL';

interface Formation {
    name: string;
    duree: string;
    description: string;
    price: string;
    image: File | null;
    video: File | null;
}

interface Video {
    id:number;
    title: string;
    description: string;
    numero: number;
    videolist: File | null;
}

export default function AddFormation() {
    const [formation, setFormation] = useState<Formation>({
        name: "",
        duree: "",
        description: "",
        price: "",
        image:null as File | null,
        video: null as File | null,
    });
    const [next,setnext]=useState(false)
    const [videos, setVideos] = useState<Video[]>([{id:1,title:"",description:"",numero:1,videolist: null as File | null }]);
   
    const handleFormationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideosChange = (id:any, name:string, value: string) => {
        setVideos(videos.map(item => (item.id === id ? { ...item, [name]: value } : item)));
      };

      const handleVideosFileChange = (id:any, e:any) => {
        const newVideo = videos.map(vd =>
          vd.id === id ? { ...vd, videolist: e.target.files[0] } : vd
        );
        setVideos(newVideo);
      };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && name==="image") {
            setFormation(prev => ({
                ...prev,
                image:files[0]
            }));
        }else if(files && name==="video"){
          setFormation(prev => ({
            ...prev,
            video:files[0]
        }));
        }
    };
   

   

    const addVideo = () => {
       
            setVideos(prev => [...prev, {
              id:videos.length+1,
              title: "",
              description: "",
              numero: videos.length+1,
              videolist: null as File | null
          }]);
          
        
    };

  

    const removeVideo = (id:number)=>{
        if(videos.length>1&& id!==0){
          let updatedvideos = videos.filter(video => video.id !== id);
          updatedvideos = updatedvideos.map((item, index) => ({
            ...item,
            id: index + 1,
            numero:index+1
          }));
          setVideos(updatedvideos);
        }else{
         Swal.fire({
           title: "Error!",
           text:"Vous ne pouvez pas supprimer le dernièr Part.",
           icon: "error",
           confirmButtonText: "OK",
         });
        } 

       }

const handelNext = (e:any)=>{
    e.preventDefault();
    setnext(true);
}

    const handleSubmit = async (e: any) => {
    e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', formation.name);
        formData.append('duree', formation.duree);
        formData.append('description', formation.description);
        formData.append('price', formation.price);
        if (formation.image) formData.append('image', formation.image);
        if (formation.video) formData.append('video', formation.video);
        formData.append('videos', JSON.stringify(videos));
        videos.forEach((vd, index) => {
          if (vd.videolist) {
            formData.append(`videolist`, vd.videolist);
          }
        })


        // console.log('Formation created:',JSON.stringify(formation) );
        //console.log('Videoss:', videos);
        //videos.map(vd=>console.log('videoss :',vd.videolist))


        // if (formation.video) {
        //     console.log('Video name:', formation.video.name);
        //     console.log('Video size:', formation.video.size);
        //     console.log('Video type:', formation.video.type);
        //   }
          
        //   if (formation.image) {
        //     console.log('Image name:', formation.image.name);
        //     console.log('Image size:', formation.image.size);
        //     console.log('Image type:', formation.image.type);
        //   }

        try {
          await axios.post(`${API_URL}/api/formations`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'X-Auth-Token': localStorage.getItem("token"),
              }
          });
      } catch (error) {
          // Gestion des erreurs
          Swal.fire({
              title: "Error!",
              text: "An error occurred while registering the formation.",
              icon: "error",
              confirmButtonText: "OK",
          });
      }
    };

    return (
        <div className='bodydashboard'>
    
        
        <Barside title="dashboard"/>
        <div className="content flex flex-col">
        <div className="title"><h1>Add new formation</h1></div>
            <div className="titlecontent flex flex-col ">
            {
             <>
             <form onSubmit={handelNext} method='post' encType="multipart/form-data">

               <div className="grid gap-4 sm:grid-cols-2 sm:gap-6" style={{
                boxShadow: "0 4px 8px rgba(26, 21, 21, 0.5)",
                borderRadius: "7px",
                border: "1px solid black",
                borderColor: "lightblue",
                padding:"15px",
                justifyContent:"center"
              }}>
                 <div className="sm:col-span-2">
                   <label htmlFor="name" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">
                   Name of formation
                   </label>
                   <input
                     type="text"
                     name="name"
                     id="name"
                     required
                     onChange={(e)=>handleFormationChange(e)}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     placeholder="Name of service"
                   />
                 </div>
                 <div className="sm:col-span-2">
                   <label htmlFor="name" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">
                   Duree in minutes
                   </label>
                   <input
                     type="text"
                     name="duree"
                     id="name"
                     required
                     onChange={(e)=>handleFormationChange(e)}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     placeholder="Duration of service (ex: 120)"
                   />
                 </div>

                 <div className="sm:col-span-2">
                   <label htmlFor="name" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">
                   Price in DH
                   </label>
                   <input
                     type="text"
                     name="price"
                     id="price"
                     required
                     onChange={(e)=>handleFormationChange(e)}
                     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     placeholder="Price of service in DH"
                   />
                 </div>

                 <div className="sm:col-span-2">
                   <label className="block mb-2 text-sm font-medium text-white-900 dark:text-white" htmlFor="user_avatar">
                   Introductory image
                   </label>
                   <input
                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                     aria-describedby="user_avatar_help"
                     id="user_avatar"
                     accept='.png , .jpeg, .jpg , .img'
                     onChange={(e)=>handleFileChange(e)}
                     type="file"
                     required
                     name='image'
                   />
                 </div>

                 <div className="sm:col-span-2">
                   <label className="block mb-2 text-sm font-medium text-white-900 dark:text-white" htmlFor="user_avatar">
                   Introductory video
                   </label>
                   <input
                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                     aria-describedby="user_avatar_help"
                     id="user_avatar"
                     accept='.mp4'
                    onChange={(e)=>handleFileChange(e)}
                     type="file"
                     required
                     name='video'
                   />
                 </div>


                 <div className="sm:col-span-2">
                   <label htmlFor="description" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">
                     Description
                   </label>
                   <textarea
                     id="description"
                     name='description'
                     required
                     onChange={(e)=>handleFormationChange(e)}
                     className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                     placeholder="Your description here"
                   />
                 </div>

               </div>

                <div style={{ display: "flex", width: "100%", justifyContent: "center", alignContent: "center" }} className="w-full">
                 <button
                   type="submit" 
                   style={{ width: "100%", display: next ? "none" : "block" }}
                   disabled={next}
                   className="text-white bg-blue-700 px-5 py-2.5 mt-4 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                 >
                   Next
                 </button>
                 
               </div> 

             </form>
             {next && (
                  <>
                  
                    <h2 className="mb-4 text-xl my-4 font-bold text-white-900 dark:text-white">Add a new parts</h2>
                    <form onSubmit={handleSubmit} style={{display:"flex",flexFlow:"column",flexWrap:"wrap",justifyContent:"center",alignItems:"center",width:"50%"}}>
                    {    
                     videos.map((vd,index)=>(
                      <div style={{backgroundColor:"#1f2b3e",marginTop:"15px", padding:"7px",border:"solide 1px",borderColor:"white",boxShadow: "0 4px 8px rgba(255, 255, 255, 0.5)",
                        borderRadius: "10px",width:"90%"}} className="flex flex-col gap-4 flex-wrap ">
                            <h2 className='align-center'>Video {index+1} </h2>
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">
                          title of video {index+1} 
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="name"
                          value={vd.title}
                          onChange={(e)=>{handleVideosChange(vd.id,'title',e.target.value)}}
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Title"
                        />
                      </div>
                        
                      <div className="sm:col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-white-900 dark:text-white">
                          Video description : {index+1} 
                        </label>
                        <input
                          type="text"
                          name="description"
                          id="name"
                          value={vd.description}
                          required
                          onChange={(e)=>{handleVideosChange(vd.id,'description',e.target.value)}}

                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          placeholder="Description"
                        />
                      </div>

                      <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-white-900 dark:text-white" htmlFor="user_avatar">
                        Choose video {index+1}
                        </label>
                        <input
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                            aria-describedby="user_avatar_help"
                            id="user_avatar"
                            accept='.mp4'
                            onChange={(e)=>handleVideosFileChange(vd.id,e)}
                            type="file"
                            required
                            name='videolist'
                        />
                      </div>
                    
                   
                      <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between"}} className="sm:col-span-2">
                        <button onClick={addVideo} type="button"><FontAwesomeIcon icon={faPlus} size="2xl"  style={{color: "#ffffff",}} /></button>
      
                        <button onClick={()=>removeVideo(vd.id)} type="button"><FontAwesomeIcon icon={faTrash} size="2xl" style={{color: "red",}} /></button>
                        </div>
      
      
                    </div>
                     ))   
                      }
                    
                     
      
                      <div style={{ display: "flex", width: "100%", justifyContent: "center",gap:"3px", alignContent: "center" }} className="w-full">
                        {/* <button
                          type="button"
                          style={{ width: "100%" }}
                          onClick={()=>{handelRetour()}}
                          className="text-white bg-red-700 px-5 py-2.5 mt-4 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Retour
                        </button> */}
                        <button
                          type="submit"
                          style={{ width: "100%" }}
                          className="text-white bg-blue-700 px-5 py-2.5 mt-4 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Submit
                        </button>
                        
                      </div>
                    </form>
                  </>
                )}
           </>
            }
               

            </div>
            </div>
              
    </div>
    );
}