import React from 'react';

const About: React.FC = () => {
  return (
    <section className="bg-gray-100 py-8 text-left px-16 md:px-24" id='propos-nous'>
      <h2 className="text-3xl font-bold mb-10 text-orange-500">À propos de nous</h2>
      <div className='flex flex-col gap-6 md:flex-row'>
        <p className="text-lg md:w-2/3">
        Bienvenue à Génie Civil Formations, votre destination pour les meilleures formations en génie civil.
        Notre mission est de fournir une éducation de qualité et des ressources complètes pour tous les étudiants 
        et professionnels du domaine.
        </p>

        <img src="/engineering.png" alt="" className='md:ml-12 mb-4' height={'200px'} width={'200px'}/>
        
      </div>    
    </section>
  );
};

export default About;
