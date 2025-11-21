// components/weather/weatherService.ts
// Service to fetch live weather data from OpenWeatherMap API

// Get API key from environment variables
// In Expo, use Constants.expoConfig.extra for runtime access
import Constants from "expo-constants";

const OPENWEATHER_API_KEY = 
  Constants.expoConfig?.extra?.openWeatherApiKey || 
  process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || 
  "94b2957f295f391213969a45d76511d9"; // Fallback API key
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

// Check if API key is available
export function hasApiKey(): boolean {
  return !!OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.trim().length > 0;
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

/**
 * Fetch current weather by city name
 */
export async function fetchWeatherByCity(cityName: string): Promise<WeatherData> {
  if (!hasApiKey()) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to fetch weather" }));
      
      // Handle specific API errors
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
      } else if (response.status === 404) {
        throw new Error(`City "${cityName}" not found. Please check the city name.`);
      } else if (response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
      
      throw new Error(errorData.message || `Weather API error: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    // Re-throw with better error message
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    throw new Error(error.message || "Failed to fetch weather data. Please check your internet connection.");
  }
}

/**
 * Fetch current weather by coordinates (lat, lon)
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  if (!hasApiKey()) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to fetch weather" }));
      
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
      }
      
      throw new Error(errorData.message || `Weather API error: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    throw new Error(error.message || "Failed to fetch weather data. Please check your internet connection.");
  }
}

/**
 * Fetch 5-day forecast by city name
 */
export async function fetchForecastByCity(cityName: string): Promise<ForecastData> {
  if (!hasApiKey()) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to fetch forecast" }));
      throw new Error(errorData.message || `Forecast API error: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    throw new Error(error.message || "Failed to fetch forecast data.");
  }
}

/**
 * Fetch 5-day forecast by coordinates (lat, lon)
 */
export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
  if (!hasApiKey()) {
    throw new Error("API_KEY_MISSING");
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Failed to fetch forecast" }));
      throw new Error(errorData.message || `Forecast API error: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      throw error;
    }
    throw new Error(error.message || "Failed to fetch forecast data.");
  }
}

