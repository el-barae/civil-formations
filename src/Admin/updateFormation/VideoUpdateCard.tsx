import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave} from '@fortawesome/free-solid-svg-icons';


interface Video {
  id: number;
  title: string;
  numero: number;
  link: string;
  description: string;
}

// Composant séparé pour la carte de vidéo
interface VideoUpdateCardProps {
  video: Video;
  mediaBaseUrl: string;
  onUpdate: (videoId: number, videoFile?: File) => void;
  onDelete: (videoId: number) => void;
  onChange: (videoId: number, field: string, value: string | number | File) => void;
}

const VideoUpdateCard: React.FC<VideoUpdateCardProps> = ({ video, mediaBaseUrl, onUpdate, onDelete, onChange }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>(`${mediaBaseUrl}${video.link}`);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold mb-2">Numéro:</label>
          <input
            type="number"
            value={video.numero}
            onChange={(e) => onChange(video.id, 'numero', Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div>
          <label className="block font-bold mb-2">Titre:</label>
          <input
            type="text"
            value={video.title}
            onChange={(e) => onChange(video.id, 'title', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-bold mb-2">Description:</label>
        <textarea
          value={video.description}
          onChange={(e) => onChange(video.id, 'description', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={3}
        />
      </div>

      <div className="mt-4">
        <label className="block font-bold mb-2">Vidéo actuelle:</label>
        <video controls src={videoPreview} className="w-full rounded mb-2" />
        <label className="inline-block bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600 transition-colors">
          Changer la vidéo
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoFileChange} 
            className="hidden" 
          />
        </label>
        {videoFile && (
          <p className="text-sm text-green-600 mt-2">
            Nouveau fichier sélectionné: {videoFile.name}
          </p>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => onUpdate(video.id, videoFile || undefined)}
          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600"
        >
          <FontAwesomeIcon icon={faSave} className="mr-2" />
          Sauvegarder
        </button>
        <button
          onClick={() => onDelete(video.id)}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default VideoUpdateCard;