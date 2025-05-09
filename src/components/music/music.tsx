import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Howl } from 'howler';
import { Track, StreamResponse } from '../types.ts';

export const Music = () => {
    
    const API_URL = 'http://localhost:3500';

      const [query, setQuery] = useState<string>('');
      const [tracks, setTracks] = useState<Track[]>([]);
      const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
      const [isPlaying, setIsPlaying] = useState<boolean>(false);
      const [progress, setProgress] = useState<number>(0);
      const soundRef = useRef<Howl | null>(null);

      const searchTracks = async () => {
        try {
          const response = await axios.get(`https://api.soundcloud.com/tracks`, {
            params: { query }
          });
          setTracks(response.data);
        } catch (error) {
          console.error('Search error:', error);
        }
      };

      const loadTrack = async (trackId: number) => {
        try {
          const response = await axios.get<StreamResponse>(`${API_URL}/stream`, {
            params: { trackId }
          });
          return response.data.url;
        } catch (error) {
          console.error('Stream error:', error);
          return null;
        }
      };
    
      const togglePlay = async (track?: Track) => {
        if (track && currentTrack?.id !== track.id) {
          if (soundRef.current) {
            soundRef.current.unload();
          }
    
          const streamUrl = await loadTrack(track.id);
          if (!streamUrl) return;
    
          soundRef.current = new Howl({
            src: [streamUrl],
            html5: true,
            onplay: () => {
              setIsPlaying(true);
              setCurrentTrack(track);
            },
            onpause: () => setIsPlaying(false),
            onend: () => setIsPlaying(false),
            onstop: () => setIsPlaying(false),
          });
    
          soundRef.current.play();
        } else if (soundRef.current) {
          if (isPlaying) {
            soundRef.current.pause();
          } else {
            soundRef.current.play();
          }
        }
      };
    
      useEffect(() => {
        const interval = setInterval(() => {
          if (soundRef.current && isPlaying) {
            const seek = soundRef.current.seek() as number;
            const duration = soundRef.current.duration() as number;
            setProgress((seek / duration) * 100);
          }
        }, 1000);
    
        return () => clearInterval(interval);
      }, [isPlaying]);
    
      useEffect(() => {
        return () => {
          if (soundRef.current) {
            soundRef.current.unload();
          }
        };
      }, []);
    
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      };
    
      return (
        <div className="app">
          <h1>SoundCloud Clone</h1>
          
          <div className="search">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск треков..."
            />
            <button onClick={searchTracks}>Найти</button>
          </div>
    
          <div className="track-list">
            {tracks.map((track) => (
              <div key={track.id} className="track">
                <h3>{track.title}</h3>
                <p>{track.user.username}</p>
                <button onClick={() => togglePlay(track)}>
                  {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
                </button>
              </div>
            ))}
          </div>
    
          {currentTrack && (
            <div className="player">
              <h3>Сейчас играет: {currentTrack.title}</h3>
              <p>{currentTrack.user.username}</p>
              <div className="controls">
                <button onClick={() => togglePlay()}>
                  {isPlaying ? '⏸ Пауза' : '▶ Воспроизвести'}
                </button>
                <input
                  type="range"
                  value={progress}
                  onChange={(e) => {
                    if (soundRef.current) {
                      const seek = (Number(e.target.value) / 100) * soundRef.current.duration();
                      soundRef.current.seek(seek);
                    }
                  }}
                />
                <span>
                  {soundRef.current
                    ? formatTime(soundRef.current.seek() as number)
                    : '0:00'}
                  / {formatTime(currentTrack.duration / 1000)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    };

