import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Barside from '../barside/barside';
import Swal from 'sweetalert2';
import API_URL from '../../API_URL';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}


const Settings: React.FC = () => {

  return (
    <div className='bodydashboard'>
      <Barside title='Settings' />
      <div className="content">
        <div className="title">
          <h1>Settings</h1>
        </div>

      </div>
    </div>
  );
};

export default Settings;