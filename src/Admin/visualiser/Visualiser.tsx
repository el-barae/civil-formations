import './visualiser.css';
import React from 'react';
import axios from 'axios';
import Barside from '../barside/barside';

const Dashboard: React.FC = () => {
  return (
    <div className='bodyvisualiser'>
    
        <Barside title='visualiser'/>
        <div className="content">
        <div className="title"><h1>Visualiser</h1></div>
            <div className="titlecontent">
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it1" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it2" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it3" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>
                <div id="it4" className="box"><a href="#"><i id="update" className="fa-sharp fa-solid fa-pen-to-square" ></i></a><h1>Formation genie civil</h1><a href="#"><i className="fa-regular fa-trash-can"></i></a></div>

            </div>
        </div>
    </div>
    

   

  
  );
};

export default Dashboard;

