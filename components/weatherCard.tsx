// components/WeatherCard.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { mockForecast, mockToday } from "./weather/mockWeatherData";
import { formatTime, mapWeatherIcon } from "./weather/utils";


type Props = { fullPage?: boolean; useMock?: boolean };

export default function WeatherCard({ fullPage = false, useMock = true }: Props) {
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    // mock load
    setTimeout(() => {
      setToday(mockToday);
      setForecast(mockForecast);
      setLoading(false);
    }, 400);
  }, [useMock]);

  if (loading) return <View style={styles.loading}><ActivityIndicator size="large" color="#2E7D32" /></View>;

  return (
    <View style={[styles.card, fullPage ? styles.full : {}]}>
      <View style={styles.header}>
        <Text style={styles.city}>{today?.name}</Text>
        <Text style={styles.desc}>{today?.weather?.[0]?.description}</Text>
      </View>

      <View style={styles.main}>
        <Image source={{ uri: mapWeatherIcon(today?.weather?.[0]?.icon) }} style={styles.icon} />
        <Text style={styles.temp}>{Math.round(today?.main?.temp)}°C</Text>
        <Text style={styles.small}>Feels like {Math.round(today?.main?.feels_like)}°C • Humidity {today?.main?.humidity}%</Text>
      </View>

      <Text style={styles.section}>Hourly Forecast</Text>
      <FlatList horizontal data={forecast} keyExtractor={(it, i) => String(i)} showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.fcard}>
            <Text style={styles.ftime}>{formatTime(item.dt)}</Text>
            <Image source={{ uri: mapWeatherIcon(item?.weather?.[0]?.icon) }} style={{ width: 44, height: 44 }} />
            <Text style={styles.ftemp}>{Math.round(item?.main?.temp)}°C</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginVertical: 12 },
  full: { margin: 12, borderRadius: 12 },
  header: { alignItems: "center", marginBottom: 8 },
  city: { fontSize: 20, fontWeight: "800", color: "#1B5E20" },
  desc: { color: "#455A64", marginTop: 6 },
  main: { alignItems: "center", marginVertical: 6 },
  icon: { width: 96, height: 96 },
  temp: { fontSize: 44, fontWeight: "900", color: "#2E7D32" },
  small: { color: "#607D8B", marginTop: 6 },
  section: { fontSize: 16, fontWeight: "700", marginTop: 12, color: "#2E7D32" },
  fcard: { alignItems: "center", backgroundColor: "#F1F8E9", padding: 10, borderRadius: 8, marginRight: 10, width: 96 },
  ftime: { fontSize: 12, color: "#37474F", marginBottom: 6 },
  ftemp: { fontSize: 14, fontWeight: "700", color: "#1B5E20", marginTop: 6 },
  loading: { padding: 24, alignItems: "center", justifyContent: "center" }
});
