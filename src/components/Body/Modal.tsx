import React from 'react';
import CheckoutForm from './CheckoutForm';
import VideoPlayer from '../../Formation/VideoPlayer';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  formationID: number;
  videoUrl: string;
  name: string;
  description: string;
  duree: string;
  price: number;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, formationID, videoUrl, name, description, duree, price}) => {
  if (!show) return null;

  // Fonction vide pour onPlay car ce n'est qu'une preview
  const handlePreviewPlay = () => {
    console.log('Preview video playing');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-2xl flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Video Player */}
          <div className='md:flex'>
          <div className="mb-6 md:w-1/2">
            <VideoPlayer
              url={videoUrl}
              title={name}
              onPlay={handlePreviewPlay}
              hasViewed={false}
            />
          </div>

          {/* Description */}
          <div className="mb-6 md:w-1/2 md:ml-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
          </div>
          {/* Détails de la formation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-gray-700">Durée</span>
                <p className="text-gray-600 ml-7">{duree}</p>
              </div>
              
            </div>

            <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-gray-700">Prix</span>
                              <p className="text-2xl font-bold text-orange-500 ml-7">{price.toFixed(2)} $</p>

              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Procéder au paiement</h3>
            <CheckoutForm amount={price} formationID={formationID} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;