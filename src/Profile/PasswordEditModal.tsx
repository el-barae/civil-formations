import React, { useState } from 'react';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onChangePassword: (passData: { oldPassword: string; newPassword: string }) => Promise<void>;
}

const PasswordEditModal: React.FC<ModalProps> = ({ show, onClose, onChangePassword }) => {
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onChangePassword(formData);
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
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
                placeholder="Enter your old password"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded text-black"
                placeholder="Enter your new password"
                required
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                <FontAwesomeIcon icon={faFloppyDisk} className="text-2xl mx-2" /> Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordEditModal;
