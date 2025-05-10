import { useState } from 'react';
import { Playlist, Track } from '.././types/yandex-music.ts';

interface Props {
  track: Track;
  playlists: Playlist[];
  userToken: string;
}

export const AddToPlaylist = ({ track, playlists, userToken }: Props) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/add-to-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: track.id,
          playlistId: selectedPlaylistId,
          userToken,
        }),
      });

      if (!response.ok) throw new Error('Failed to add track');
      alert('Трек добавлен в плейлист!');
    } catch (error) {
      console.error(error);
      alert('Ошибка при добавлении трека');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <select
        onChange={(e) => setSelectedPlaylistId(Number(e.target.value))}
        disabled={isLoading}
      >
        <option value="">Выберите плейлист</option>
        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.title} ({playlist.trackCount} треков)
          </option>
        ))}
      </select>

      <button 
        onClick={handleAddToPlaylist} 
        disabled={!selectedPlaylistId || isLoading}
      >
        {isLoading ? 'Добавление...' : 'Добавить в плейлист'}
      </button>
    </div>
  );
};