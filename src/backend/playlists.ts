// server/api/playlists.ts
import  {Client}  from 'yandex-music';
import express from 'express';

const router = express.Router();

router.post('/add-to-playlist', async (req, res) => {
  const { trackId, playlistId, userToken } = req.body;

  if (!trackId || !playlistId || !userToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const client = new Client(userToken);
    
    // Получаем плейлист
    const playlist = await client.usersPlaylists(playlistId);
    
    // Добавляем трек (trackId должен быть числом!)
    await playlist.addTracks([{ id: trackId }]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding track:', error);
    res.status(500).json({ error: 'Failed to add track to playlist' });
  }
});

export default router;