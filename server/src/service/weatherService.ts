import config from '../config.js';

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

interface WeatherData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
    };
    weather: Array<{
      icon: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
  city: {
    name: string;
    coord: Coordinates;
  };
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = config.API_BASE_URL;
    this.apiKey = config.API_KEY;

    if (!this.apiKey) {
      console.error('Missing required environment variables:');
      console.error('API_KEY:', this.apiKey);
      console.error('API_BASE_URL:', this.baseURL);
      throw new Error('API_KEY is required - please check your .env file');
    }
  }

  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchLocationData(query: string): Promise<LocationData[]> {
    try {
      console.log('Fetching location data with query:', query);
      const response = await fetch(query);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Location data received:', data);
      return data as LocationData[];
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Failed to fetch location data');
    }
  }

  private destructureLocationData(locationData: LocationData[]): Coordinates {
    if (!locationData.length) {
      throw new Error('City not found');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<WeatherData> {
    try {
      const query = this.buildWeatherQuery(coordinates);
      console.log('Fetching weather data with query:', query);
      
      const response = await fetch(query);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Weather data received:', data);
      return data as WeatherData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  private parseCurrentWeather(weatherData: WeatherData, city: string): Weather {
    const current = weatherData.list[0];
    if (!current) {
      throw new Error('No current weather data available');
    }

    return {
      city,
      date: new Date(current.dt * 1000).toLocaleDateString(),
      icon: current.weather[0].icon,
      iconDescription: current.weather[0].description,
      tempF: Math.round(current.main.temp),
      windSpeed: Math.round(current.wind.speed),
      humidity: current.main.humidity
    };
  }

  private buildForecastArray(currentWeather: Weather, weatherData: WeatherData): Weather[] {
    const forecast: Weather[] = [];
    
    // Add current weather as first item
    forecast.push(currentWeather);

    // Get current date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create an array to store unique future days
    const futureDays: Weather[] = [];
    
    // Process all time slots
    weatherData.list.forEach(item => {
        const forecastDate = new Date(item.dt * 1000);
        forecastDate.setHours(0, 0, 0, 0);
        
        // Only process future days
        if (forecastDate > today) {
            // Check if we already have this date
            const existingForecast = futureDays.find(f => 
                new Date(f.date).toDateString() === forecastDate.toDateString()
            );
            
            // If we don't have this date yet, or if this is a better time (closer to noon)
            if (!existingForecast) {
                futureDays.push({
                    city: currentWeather.city,
                    date: forecastDate.toLocaleDateString(),
                    icon: item.weather[0].icon,
                    iconDescription: item.weather[0].description,
                    tempF: Math.round(item.main.temp),
                    windSpeed: Math.round(item.wind.speed),
                    humidity: item.main.humidity
                });
            } else {
                // Check if this time is closer to noon (12:00)
                const existingTime = new Date(existingForecast.date).getHours();
                const newTime = forecastDate.getHours();
                const existingDiffFromNoon = Math.abs(12 - existingTime);
                const newDiffFromNoon = Math.abs(12 - newTime);
                
                if (newDiffFromNoon < existingDiffFromNoon) {
                    // Replace with the forecast closer to noon
                    const index = futureDays.indexOf(existingForecast);
                    futureDays[index] = {
                        city: currentWeather.city,
                        date: forecastDate.toLocaleDateString(),
                        icon: item.weather[0].icon,
                        iconDescription: item.weather[0].description,
                        tempF: Math.round(item.main.temp),
                        windSpeed: Math.round(item.wind.speed),
                        humidity: item.main.humidity
                    };
                }
            }
        }
    });

    // Sort future days by date and take only the first 5
    const sortedFutureDays = futureDays
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    // Combine current weather with future days
    forecast.push(...sortedFutureDays);

    // Debug logging
    console.log(`Generated forecast for ${forecast.length} days`);
    forecast.forEach(f => console.log(`Date: ${f.date}, Temp: ${f.tempF}°F`));

    return forecast;
}
  
  async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      console.log(`Getting weather for city: ${city}`);
      const coordinates = await this.fetchAndDestructureLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData, city);
      return this.buildForecastArray(currentWeather, weatherData);
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw error;
    }
  }
}

export default new WeatherService();
