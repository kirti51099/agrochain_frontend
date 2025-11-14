// app/farmer/weather.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import WeatherCard from "../components/weatherCard";

export default function WeatherPage() {
  return (
    <LinearGradient colors={["#E0F7FA", "#FFFFFF"]} style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>🌦️ Weather Overview</Text>
        <Text style={styles.sub}>Get real-time forecast & crop insights</Text>

        <WeatherCard fullPage />

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
  title: { fontSize: 26, fontWeight: "bold", color: "#01579B", textAlign: "center", marginTop: 40 },
  sub: { fontSize: 14, color: "#0277BD", textAlign: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 20, color: "#01579B" },
  tips: { backgroundColor: "#E8F5E9", borderRadius: 10, padding: 14, marginTop: 8 },
  tipText: { color: "#33691E", fontSize: 14, marginVertical: 3 },
});
