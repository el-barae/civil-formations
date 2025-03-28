import React, { useState } from 'react';
import axios from 'axios';

interface Formation {
    name: string;
    duree: string;
    description: string;
    price: string;
    image: File | null;
    video: File | null;
}

interface Video {
    title: string;
    description: string;
    numero: number;
    link: string;
}

export default function AddFormation() {
    const [formation, setFormation] = useState<Formation>({
        name: "",
        duree: "",
        description: "",
        price: "",
        image: null,
        video: null
    });

    const [videos, setVideos] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video>({
        title: "",
        description: "",
        numero: 0,
        link: ""
    });

    const handleFormationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormation(prev => ({
                ...prev,
                [e.target.name]: e.target.files![0]
            }));
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentVideo(prev => ({
            ...prev,
            [name]: name === 'numero' ? parseInt(value) : value
        }));
    };

    const addVideo = () => {
        if (currentVideo.title && currentVideo.link) {
            setVideos(prev => [...prev, currentVideo]);
            setCurrentVideo({
                title: "",
                description: "",
                numero: 0,
                link: ""
            });
        }
    };

    const removeVideo = (index: number) => {
        setVideos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', formation.name);
        formData.append('duree', formation.duree);
        formData.append('description', formation.description);
        formData.append('price', formation.price);
        if (formation.image) formData.append('image', formation.image);
        if (formation.video) formData.append('video', formation.video);
        formData.append('videos', JSON.stringify(videos));

        try {
            const response = await axios.post('http://your-api-url/formations', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Formation created:', response.data);
            // Reset form or redirect
        } catch (error) {
            console.error('Error creating formation:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Formation</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Formation Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formation.name}
                            onChange={handleFormationChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Duration</label>
                        <input
                            type="text"
                            name="duree"
                            value={formation.duree}
                            onChange={handleFormationChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Price</label>
                        <input
                            type="text"
                            name="price"
                            value={formation.price}
                            onChange={handleFormationChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept="image/*"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Video</label>
                        <input
                            type="file"
                            name="video"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept="video/*"
                        />
                    </div>
                </div>
                
                <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formation.description}
                        onChange={handleFormationChange}
                        className="w-full p-2 border rounded"
                        rows={4}
                        required
                    />
                </div>
                
                {/* Videos Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Videos</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentVideo.title}
                                onChange={handleVideoChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Number</label>
                            <input
                                type="number"
                                name="numero"
                                value={currentVideo.numero}
                                onChange={handleVideoChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block mb-1">Link</label>
                            <input
                                type="text"
                                name="link"
                                value={currentVideo.link}
                                onChange={handleVideoChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={addVideo}
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                Add Video
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            name="description"
                            value={currentVideo.description}
                            onChange={handleVideoChange}
                            className="w-full p-2 border rounded"
                            rows={2}
                        />
                    </div>
                    
                    {/* Added Videos List */}
                    {videos.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Added Videos:</h3>
                            <ul className="space-y-2">
                                {videos.map((video, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                                        <span>{video.numero}. {video.title}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeVideo(index)}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                
                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                    Create Formation
                </button>
            </form>
        </div>
    );
}