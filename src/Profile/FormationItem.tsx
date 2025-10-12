import React from 'react';
import useIntersectionObserver from './useIntersectionObserver';
import { useNavigate } from 'react-router-dom';

interface Formation {
    id: string;
    name: string;
    duree: string;
    description: string;
    price: number;
    image: string;
    video: string;
}

interface Subscribe {
    id: string;
    pourcentage: number;
    formationId: string;
    userId: string;
    Formation: Formation;
}

interface FormationItemProps {
    subscribe: Subscribe;
    index: number;
}

const FormationItem: React.FC<FormationItemProps> = ({ subscribe, index }) => {
    const [ref, inView] = useIntersectionObserver();
    const navigate = useNavigate();
    const animationClass = index % 2 === 0 ? 'animate-fade-slide-in-left' : 'animate-fade-slide-in-right';
    
    const handleClick = () => {
        // Passer l'état via navigate
        navigate(`/formation/${subscribe.Formation.id}`, {
            state: { fromProfile: true, subscribeId: subscribe.id }
        });
    };

    const mediaBaseUrl = process.env.REACT_APP_MEDIA_URL || '';

    return (
        <div
            ref={ref}
            key={subscribe.Formation.id}
            onClick={handleClick}
            className={`m-4 p-4 flex flex-col items-center border rounded-lg shadow-xl max-w-lg transition-opacity duration-1000 cursor-pointer ${inView ? animationClass : 'opacity-0'} hover:bg-red-100`}
        >
            <h3 className='text-2xl font-semibold text-orange-400'>{subscribe.Formation.name}</h3>
            <img src={`${mediaBaseUrl}${subscribe.Formation.image}`} alt={subscribe.Formation.name} className=' w-56 h-60'/>
            <p>Duration: {subscribe.Formation.duree}</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2.5 rounded-full"
                    style={{ width: `${subscribe.pourcentage}%` }}
                ></div>
            </div>
            <p className='text-right'>{subscribe.pourcentage}%</p>
        </div>
    );
};

export default FormationItem;