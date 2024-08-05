import React, { useState } from 'react';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface User{
  id:number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: string,
  Subscribes: Subscribe[];
}


interface Subscribe {
  id: string;
  pourcentage: number;
  formationId: string;
  userId: string;
  Formation: Formation;
}

interface Formation {
  id: string;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User) => Promise<void>; 
}

const ProfileEditModal: React.FC<ModalProps> = ({ show, onClose, user, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-3/4 max-w-3xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black text-2xl font-bold">&times;</button>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white p-2 rounded"><FontAwesomeIcon icon={faFloppyDisk} className=" text-2xl mx-2" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default ProfileEditModal;
