import React from 'react';
import { useState } from 'react';
import Modal from './Modal';
import useIntersectionObserver from './useIntersectionObserver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';

interface Formation {
  id: number;
  name: string;
  duree: string;
  description: string;
  price: number;
  image: string;
  video: string;
}

interface FormationItemProps {
  formation: Formation;
  index: number;
}

const FormationItem: React.FC<FormationItemProps> = ({ formation, index }) => {
  const [showModal, setShowModal] = useState(false);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [ref, inView] = useIntersectionObserver();
  const animationClass = index % 2 === 0 ? 'animate-fade-slide-in-left' : 'animate-fade-slide-in-right';

  return (
    <div
      ref={ref}
      className={`m-4 p-4 border rounded-lg shadow-lg max-w-lg transition-opacity duration-1000 ${inView ? animationClass : 'opacity-0'}`}
    >
      <img src="/images/civil.jpg" alt={formation.name} className="rounded mb-4" />
      <h3 className="text-xl font-bold mb-2">{formation.name}</h3>
      <p>{formation.description}</p>
      <p><strong>Duree:</strong> {formation.duree}</p>
      <p><strong>Prix:</strong> {formation.price.toFixed(2)} DH</p>
      <a href="#" onClick={handleVideoClick} className="text-blue-500"><FontAwesomeIcon icon={faVideo} className="mr-4" />Voir Video</a>
      <Modal show={showModal} onClose={handleCloseModal} videoUrl="/videos/RealCivilEngineerIntro.mp4"/>
    </div>
  );
};

export default FormationItem;