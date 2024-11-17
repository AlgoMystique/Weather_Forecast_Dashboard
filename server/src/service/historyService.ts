import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface City {
  id: string;
  name: string;
}

class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, '../../db/searchHistory.json');
  }

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const existingCity = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());
    
    if (existingCity) {
      return existingCity;
    }

    const newCity: City = {
      id: uuidv4(),
      name: cityName
    };

    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();