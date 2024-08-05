import React from 'react';

interface VideoDescriptionModalProps {
  show: boolean;
  onClose: () => void;
  video: {
    title: string;
    numero: number;
    link: string;
    description: string;
  } | null;
}

const VideoDescriptionModal: React.FC<VideoDescriptionModalProps> = ({ show, onClose, video }) => {
  if (!show || !video) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg w-3/4 max-w-3xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black text-2xl font-bold">&times;</button>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-2">{video.numero}. {video.title}</h2>
          <video controls controlsList="nodownload" src={video.link} className="w-full rounded mt-4 mb-4" />
          <p className="mt-2">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoDescriptionModal;
