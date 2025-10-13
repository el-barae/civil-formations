import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader, Settings } from 'lucide-react';

interface Subtitle {
  lang: string;
  name: string;
  flag: string;
  url: string;
}

interface VideoPlayerProps {
  url: string;
  title: string;
  onPlay: () => void;
  hasViewed?: boolean;
  subtitles?: Subtitle[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  title, 
  onPlay, 
  hasViewed = false,
  subtitles = []
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(subtitles.length > 0 ? subtitles[0].lang : 'none');
  const [showSubtitles, setShowSubtitles] = useState(subtitles.length > 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Gérer les changements de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fermer les menus au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showSpeedMenu || showSettingsMenu) {
        setShowSpeedMenu(false);
        setShowSettingsMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSpeedMenu, showSettingsMenu]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      // Ignorer si on tape dans un input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [duration, isPlaying]);

  // Initialiser les sous-titres au chargement
  useEffect(() => {
    if (videoRef.current && showSubtitles && selectedLanguage !== 'none') {
      const tracks = videoRef.current.querySelectorAll('track');
      tracks.forEach((track: any) => {
        if (track.getAttribute('data-lang') === selectedLanguage) {
          track.track.mode = 'showing';
        } else {
          track.track.mode = 'hidden';
        }
      });
    }
  }, [videoRef.current, showSubtitles, selectedLanguage]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
        videoRef.current.muted = true;
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    
    // Désactiver tous les tracks
    if (videoRef.current) {
      const tracks = videoRef.current.querySelectorAll('track');
      tracks.forEach((track: any) => {
        if (langCode !== 'none' && track.getAttribute('data-lang') === langCode) {
          track.track.mode = 'showing';
        } else {
          track.track.mode = 'hidden';
        }
      });
    }
    
    setShowSettingsMenu(false);
  };

  const toggleSubtitles = () => {
    const newShowSubtitles = !showSubtitles;
    setShowSubtitles(newShowSubtitles);
    
    if (videoRef.current) {
      const tracks = videoRef.current.querySelectorAll('track');
      tracks.forEach((track: any) => {
        if (newShowSubtitles && selectedLanguage === track.getAttribute('data-lang')) {
          track.track.mode = 'showing';
        } else {
          track.track.mode = 'hidden';
        }
      });
    }
  };

  const toggleFullscreen = async () => {
    if (containerRef.current) {
      try {
        if (!document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error('Erreur fullscreen:', error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.volume = volume;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (!hasPlayedOnce && !hasViewed) {
      onPlay();
      setHasPlayedOnce(true);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleLoadStart = () => setIsLoading(true);
  const handleCanPlay = () => setIsLoading(false);

  return (
    <div 
      ref={containerRef}
      className={`relative rounded-lg overflow-hidden shadow-lg bg-black group mt-4 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
          : 'w-full'
      }`}
      style={isFullscreen ? { position: 'fixed' } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
      tabIndex={0}
    >
      {/* Conteneur vidéo */}
      <div className={`relative flex items-center justify-center ${isFullscreen ? 'w-screen h-screen' : 'w-full'}`}>
        <video
          ref={videoRef}
          controls={false}
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          src={url}
          className={`${isFullscreen ? 'w-screen h-screen' : 'w-full h-full'} object-contain cursor-pointer`}
          onPlay={handleVideoPlay}
          onPause={() => setIsPlaying(false)}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={handleVideoClick}
        >
          {/* Pistes de sous-titres WebVTT */}
          {subtitles.map((subtitle) => (
            <track
              key={subtitle.lang}
              kind="subtitles"
              src={subtitle.url}
              srcLang={subtitle.lang}
              label={subtitle.name}
              data-lang={subtitle.lang}
              default={subtitle.lang === selectedLanguage}
            />
          ))}
        </video>

        {/* Overlay de chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        {/* Bouton Play central */}
        {!isPlaying && !isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transition-opacity duration-300"
            onClick={togglePlay}
          >
            <div className="bg-white bg-opacity-90 rounded-full p-5 transform transition-transform hover:scale-110 hover:bg-opacity-100">
              <Play className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Contrôles personnalisés */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 transition-opacity duration-300 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Barre de progression */}
          <div 
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-3 group/progress"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-orange-500 rounded-full relative transition-all duration-150"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Bouton Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
                aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                title="Espace"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5" fill="currentColor" />
                )}
              </button>

              {/* Contrôle du volume */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
                  aria-label={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                  title="M"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>

                {/* Barre de volume */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-0 group-hover/volume:w-20 transition-all duration-200 h-1 bg-gray-600 rounded-full cursor-pointer appearance-none"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
                  }}
                  aria-label="Volume"
                />
              </div>

              {/* Temps */}
              <div className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Menu Vitesse */}
              <div className="relative group/speed">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpeedMenu(!showSpeedMenu);
                    setShowSettingsMenu(false);
                  }}
                  className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full text-xs font-medium"
                  aria-label="Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Dropdown Vitesse */}
                {showSpeedMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50 min-w-32">
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                          playbackSpeed === speed
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>



              {/* Bouton Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
                aria-label={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                title="F"
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5" />
                ) : (
                  <Maximize className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;