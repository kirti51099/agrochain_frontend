import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Reports() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>📊 Reports & Analytics</Text>
        <Text style={styles.heroSubtitle}>
          Detailed admin reports (sales, usage, disease alerts) will be added in the
          next phase of AgroChain.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Reports</Text>
        <Text style={styles.item}>• Monthly user growth (Farmers & Buyers)</Text>
        <Text style={styles.item}>• Marketplace sales summary</Text>
        <Text style={styles.item}>• Crop / disease detection statistics</Text>
        <Text style={styles.item}>• Location-wise platform usage</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How it will help Admins?</Text>
        <Text style={styles.item}>
          ✓ Identify the most active regions and crops.
        </Text>
        <Text style={styles.item}>
          ✓ Track how many farmers are using smart assistant features.
        </Text>
        <Text style={styles.item}>
          ✓ Monitor overall growth and performance of AgroChain.
        </Text>
      </View>

      <Text style={styles.footerNote}>
        For this version, the main focus is on user management, role control and live
        dashboards. Reporting will use the same theme and data sources in future.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: "#f0fdf4",
  },
  hero: {
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fefce8",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#e5f9e7",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#14532d",
  },
  item: {
    fontSize: 13,
    color: "#374151",
    marginTop: 3,
  },
  footerNote: {
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280",
  },
});
