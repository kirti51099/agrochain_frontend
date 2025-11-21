import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { db } from "../../config/firebaseconfig";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [farmers, setFarmers] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      let farmerCount = 0;
      let buyerCount = 0;
      let adminCount = 0;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.role === "farmer" || data.role === "Farmer") farmerCount++;
        if (data.role === "buyer" || data.role === "Buyer") buyerCount++;
        if (data.role === "admin" || data.role === "Admin") adminCount++;
      });

      setFarmers(farmerCount);
      setBuyers(buyerCount);
      setAdmins(adminCount);
      setTotalUsers(snapshot.size);
    } catch (error: any) {
      console.log("Dashboard error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 8, color: "#4b5563" }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Admin Overview</Text>
        <Text style={styles.heroSubtitle}>
          Monitor AgroChain users and keep the platform healthy.
        </Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.card, styles.cardPrimary]}>
          <Text style={styles.cardLabel}>Total Users</Text>
          <Text style={styles.cardNumber}>{totalUsers}</Text>
          <Text style={styles.cardHint}>Farmers, Buyers & Admins</Text>
        </View>

        <View style={[styles.card, styles.cardGreen]}>
          <Text style={styles.cardLabel}>Farmers</Text>
          <Text style={styles.cardNumber}>{farmers}</Text>
          <Text style={styles.cardHint}>Active producers</Text>
        </View>

        <View style={[styles.card, styles.cardBlue]}>
          <Text style={styles.cardLabel}>Buyers</Text>
          <Text style={styles.cardNumber}>{buyers}</Text>
          <Text style={styles.cardHint}>Market demand</Text>
        </View>

        <View style={[styles.card, styles.cardOrange]}>
          <Text style={styles.cardLabel}>Admins</Text>
          <Text style={styles.cardNumber}>{admins}</Text>
          <Text style={styles.cardHint}>Platform managers</Text>
        </View>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Tip</Text>
        <Text style={styles.footerText}>
          Use the **Users** tab to change roles or remove users, and **Add User** to onboard
          new admins, farmers, or buyers.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0fdf4" },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0fdf4",
  },
  heroCard: {
    backgroundColor: "#2E7D32",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  heroTitle: {
    color: "#fefce8",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "#e5f9e7",
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  cardPrimary: {
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  cardGreen: {
    backgroundColor: "#e0f2f1",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  cardBlue: {
    backgroundColor: "#e0f2fe",
    borderWidth: 1,
    borderColor: "#1E40AF",
  },
  cardOrange: {
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#f97316",
  },
  cardLabel: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  cardHint: {
    marginTop: 6,
    fontSize: 11,
    color: "#6b7280",
  },
  footerCard: {
    marginTop: 10,
    backgroundColor: "#ecfdf3",
    borderRadius: 14,
    padding: 14,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
});
