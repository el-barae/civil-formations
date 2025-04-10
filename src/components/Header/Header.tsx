import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-cover bg-center p-8 text-center" style={{ backgroundImage: "url('/civil.jpg')", height:"520px" }} id='header'>
      <h1 className="text-4xl mt-24 font-bold">Bienvenue à Génie Civil Formations</h1>
    </header>
  );
};

export default Header;
