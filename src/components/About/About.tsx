import React from 'react';

const About: React.FC = () => {
  return (
    <section className="bg-gray-100 py-8 text-left px-24" id='propos-nous'>
      <h2 className="text-3xl font-bold mb-8 text-orange-500">À propos de nous</h2>
      <p className="text-lg">
        Bienvenue à Génie Civil Formations, votre destination pour les meilleures formations en génie civil.
        Notre mission est de fournir une éducation de qualité et des ressources complètes pour tous les étudiants 
        et professionnels du domaine.
      </p>
    </section>
  );
};

export default About;
