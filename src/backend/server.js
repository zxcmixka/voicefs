import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS для разработки
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Маршрут для получения треков
app.get('/api/tracks', async (req, res) => {
  try {
    const { accessToken } = req.query;
    
    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Запрос к Яндекс.Музыке
    const response = await axios.get('https://api.music.yandex.net/landing3/chart', {
      headers: {
        'Authorization': `OAuth ${accessToken}`
      },
      timeout: 10000
    });

    // Форматирование ответа
    const tracks = response.data.result.chart.tracks.map(track => ({
      id: track.id,
      title: track.title,
      artists: track.artists,
      durationMs: track.durationMs,
      coverUri: track.coverUri?.replace('%%', '200x200'),
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Error fetching tracks:', error);
    
    // Обработка разных типов ошибок
    let errorMessage = 'Failed to fetch tracks';
    if (error.response?.status === 401) {
      errorMessage = 'Invalid or expired token';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout';
    }
    
    res.status(error.response?.status || 500).json({ 
      error: errorMessage 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});