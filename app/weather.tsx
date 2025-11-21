// app/farmer/weather.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import WeatherCard from "../components/weatherCard";
import BackHeader from "../components/BackHeader";

export default function WeatherPage() {
  const [cityName, setCityName] = useState<string>("");
  const [searchCity, setSearchCity] = useState<string>("");

  const handleSearch = () => {
    if (searchCity.trim()) {
      setCityName(searchCity.trim());
    } else {
      Alert.alert("Enter City", "Please enter a city name to search for weather.");
    }
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#FFFFFF"]} style={styles.container}>
      <BackHeader title="Weather" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>🌦️ Weather Overview</Text>
        <Text style={styles.sub}>Get real-time forecast & crop insights</Text>

        {/* City Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter city name (e.g., Mumbai, Delhi)"
            placeholderTextColor="#999"
            value={searchCity}
            onChangeText={setSearchCity}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {cityName ? (
          <Text style={styles.cityLabel}>Showing weather for: {cityName}</Text>
        ) : (
          <Text style={styles.cityLabel}>📍 Using your location or default city</Text>
        )}

        <WeatherCard fullPage cityName={cityName || undefined} />

        <Text style={styles.sectionTitle}>🌾 Smart Farming Tips</Text>
        <View style={styles.tips}>
          <Text style={styles.tipText}>• Water early morning to minimize evaporation.</Text>
          <Text style={styles.tipText}>• Rain ahead: delay fertilizer by 1 day.</Text>
          <Text style={styles.tipText}>• Ideal crops: Tomato, Maize, Sunflower.</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 26, fontWeight: "bold", color: "#01579B", textAlign: "center", marginTop: 20 },
  sub: { fontSize: 14, color: "#0277BD", textAlign: "center", marginBottom: 20 },
  searchContainer: { 
    flexDirection: "row", 
    marginBottom: 12, 
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#01579B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  cityLabel: {
    fontSize: 12,
    color: "#607D8B",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20, color: "#01579B" },
  tips: { backgroundColor: "#E8F5E9", borderRadius: 10, padding: 14, marginTop: 8 },
  tipText: { color: "#33691E", fontSize: 14, marginVertical: 3 },
});
