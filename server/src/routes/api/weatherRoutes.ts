import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get search history' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.json({ message: 'City removed from history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;