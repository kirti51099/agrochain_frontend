// components/WeatherCard.tsx
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { mockForecast, mockToday } from "./weather/mockWeatherData";
import { formatTime, mapWeatherIcon } from "./weather/utils";
import { fetchForecastByCity, fetchForecastByCoords, fetchWeatherByCity, fetchWeatherByCoords, ForecastItem, hasApiKey, WeatherData } from "./weather/weatherService";

type Props = { fullPage?: boolean; useMock?: boolean; cityName?: string };

export default function WeatherCard({ fullPage = false, useMock = false, cityName }: Props) {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    loadWeather();
  }, [useMock, cityName]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if API key is available
      if (!hasApiKey() || useMock) {
        // Use mock data if no API key or useMock is true
        console.log("Using mock weather data (API key not configured or useMock=true)");
        setTimeout(() => {
          setToday(mockToday as any);
          setForecast(mockForecast as any);
          setLoading(false);
        }, 400);
        return;
      }

      // Try to get live weather data
      let weatherData: WeatherData;
      let forecastData: any;

      if (cityName) {
        // Use provided city name
        weatherData = await fetchWeatherByCity(cityName);
        forecastData = await fetchForecastByCity(cityName);
      } else {
        // Try to get user's location
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            // Fallback to default city if location denied
            console.log("Location permission denied, using default city");
            weatherData = await fetchWeatherByCity("Mumbai");
            forecastData = await fetchForecastByCity("Mumbai");
          } else {
            const loc = await Location.getCurrentPositionAsync({});
            const coords = { lat: loc.coords.latitude, lon: loc.coords.longitude };
            setLocation(coords);

            weatherData = await fetchWeatherByCoords(coords.lat, coords.lon);
            forecastData = await fetchForecastByCoords(coords.lat, coords.lon);
          }
        } catch (locError: any) {
          // Fallback to default city (Mumbai, India)
          console.warn("Location error, using default city:", locError.message);
          weatherData = await fetchWeatherByCity("Mumbai");
          forecastData = await fetchForecastByCity("Mumbai");
        }
      }

      setToday(weatherData);
      
      // Get next 6 hours from forecast (hourly data)
      const now = Date.now() / 1000;
      const hourlyForecast = forecastData.list
        .filter((item: ForecastItem) => item.dt >= now)
        .slice(0, 6)
        .map((item: ForecastItem) => ({
          dt: item.dt,
          main: item.main,
          weather: item.weather,
        }));

      setForecast(hourlyForecast.length > 0 ? hourlyForecast : forecastData.list.slice(0, 6));
      setLoading(false);
    } catch (err: any) {
      // Handle API key missing error gracefully
      if (err.message === "API_KEY_MISSING") {
        console.log("OpenWeatherMap API key not configured. Using mock data.");
        setToday(mockToday as any);
        setForecast(mockForecast as any);
        setError("API key not configured. Showing sample data. Add EXPO_PUBLIC_OPENWEATHER_API_KEY to .env for live weather.");
        setLoading(false);
        return;
      }

      // Handle other errors
      console.warn("Weather fetch error:", err.message);
      setError(err.message || "Failed to load weather data");
      
      // Fallback to mock data on error
      setToday(mockToday as any);
      setForecast(mockForecast as any);
      setLoading(false);
      
      // Only show alert for critical errors, not for missing API key
      if (fullPage && !err.message.includes("API key")) {
        Alert.alert("Weather Error", "Could not fetch live weather. Showing sample data.");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (!today) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No weather data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, fullPage ? styles.full : {}]}>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>⚠️ {error}</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <Text style={styles.city}>{today?.name || "Unknown"}</Text>
        <Text style={styles.desc}>
          {today?.weather?.[0]?.description 
            ? today.weather[0].description.charAt(0).toUpperCase() + today.weather[0].description.slice(1)
            : "Clear sky"}
        </Text>
      </View>

      <View style={styles.main}>
        <Image 
          source={{ uri: mapWeatherIcon(today?.weather?.[0]?.icon) }} 
          style={styles.icon}
          defaultSource={{ uri: "https://openweathermap.org/img/wn/01d@2x.png" }}
        />
        <Text style={styles.temp}>{Math.round(today?.main?.temp || 0)}°C</Text>
        <Text style={styles.small}>
          Feels like {Math.round(today?.main?.feels_like || 0)}°C • Humidity {today?.main?.humidity || 0}%
        </Text>
        {today?.wind && (
          <Text style={styles.small}>
            Wind: {Math.round(today.wind.speed * 3.6)} km/h • Pressure: {today.main.pressure} hPa
          </Text>
        )}
      </View>

      {today?.main?.temp_min && today?.main?.temp_max && (
        <View style={styles.tempRange}>
          <Text style={styles.tempRangeText}>
            Min: {Math.round(today.main.temp_min)}°C • Max: {Math.round(today.main.temp_max)}°C
          </Text>
        </View>
      )}

      {forecast.length > 0 && (
        <>
          <Text style={styles.section}>Hourly Forecast</Text>
          <FlatList 
            horizontal 
            data={forecast} 
            keyExtractor={(it, i) => `${it.dt}-${i}`} 
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.fcard}>
                <Text style={styles.ftime}>{formatTime(item.dt)}</Text>
                <Image 
                  source={{ uri: mapWeatherIcon(item?.weather?.[0]?.icon) }} 
                  style={{ width: 44, height: 44 }}
                  defaultSource={{ uri: "https://openweathermap.org/img/wn/01d@2x.png" }}
                />
                <Text style={styles.ftemp}>{Math.round(item?.main?.temp || 0)}°C</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginVertical: 12 },
  full: { margin: 12, borderRadius: 12 },
  header: { alignItems: "center", marginBottom: 8 },
  city: { fontSize: 20, fontWeight: "800", color: "#1B5E20" },
  desc: { color: "#455A64", marginTop: 6, textTransform: "capitalize" },
  main: { alignItems: "center", marginVertical: 6 },
  icon: { width: 96, height: 96 },
  temp: { fontSize: 44, fontWeight: "900", color: "#2E7D32" },
  small: { color: "#607D8B", marginTop: 4, fontSize: 12 },
  tempRange: { alignItems: "center", marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#E0E0E0" },
  tempRangeText: { color: "#455A64", fontSize: 13, fontWeight: "600" },
  section: { fontSize: 16, fontWeight: "700", marginTop: 12, color: "#2E7D32" },
  fcard: { alignItems: "center", backgroundColor: "#F1F8E9", padding: 10, borderRadius: 8, marginRight: 10, width: 96 },
  ftime: { fontSize: 12, color: "#37474F", marginBottom: 6 },
  ftemp: { fontSize: 14, fontWeight: "700", color: "#1B5E20", marginTop: 6 },
  loading: { padding: 24, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 12, color: "#607D8B", fontSize: 14 },
  errorContainer: { padding: 24, alignItems: "center", justifyContent: "center" },
  errorText: { color: "#D32F2F", fontSize: 14 },
  errorBanner: { backgroundColor: "#FFF3CD", padding: 8, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: "#FFC107" },
  errorBannerText: { color: "#856404", fontSize: 12 },
});
