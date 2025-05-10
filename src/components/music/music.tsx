import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {YandexAuth} from "../YandexAuth/YandexAuth.tsx";

interface Artist {
  name: string;
}

interface Track {
  id: number;
  title: string;
  artists: Artist[];
  durationMs: number;
  coverUri?: string;
}

export const Music = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Базовый URL API
  const API_BASE_URL = 'http://localhost:5000';

  // Обработка успешной авторизации
  const handleAuthSuccess = (accessToken: string) => {
    setToken(accessToken);
    localStorage.setItem('yandexMusicToken', accessToken);
    setError(null);
  };

  // Получение треков
  const fetchTracks = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tracks`, {
        params: { accessToken: token },
        timeout: 10000
      });

      setTracks(response.data);
    } catch (err) {
      let errorMessage = 'Failed to load tracks';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.';
          localStorage.removeItem('yandexMusicToken');
          setToken(null);
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout. Try again later.';
        } else {
          errorMessage = err.response?.data?.error || err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Воспроизведение трека
  const playTrack = async (track: Track) => {
    try {
      // Здесь будет логика воспроизведения
      console.log('Playing track:', track.title);
    } catch (err) {
      setError('Failed to play track');
    }
  };

  // Проверка сохраненного токена
  useEffect(() => {
    const savedToken = localStorage.getItem('yandexMusicToken');
    if (savedToken) setToken(savedToken);
  }, []);

  // Загрузка треков при изменении токена
  useEffect(() => {
    if (token) {
      fetchTracks();
    }
  }, [token]);

  return (
    <div className="music-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Close</button>
        </div>
      )}

      {!token ? (
        <YandexAuth 
          onSuccess={handleAuthSuccess} 
          onError={(err) => setError(err)}
        />
      ) : (
        <>
          <h2>Яндекс.Музыка</h2>
          
          {isLoading ? (
            <div className="loading">Loading tracks...</div>
          ) : (
            <div className="track-list">
              {tracks.map(track => (
                <div 
                  key={track.id} 
                  className="track"
                  onClick={() => playTrack(track)}
                >
                  {track.coverUri && (
                    <img 
                      src={track.coverUri} 
                      alt={track.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="track-info">
                    <h3>{track.title}</h3>
                    <p>{track.artists.map(a => a.name).join(', ')}</p>
                    <span>
                      {new Date(track.durationMs).toISOString().substr(14, 5)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};