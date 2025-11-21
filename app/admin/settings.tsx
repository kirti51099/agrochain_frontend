import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebaseconfig";

export default function SettingsScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  const loadProfile = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        console.log("User not found in Firestore");
      }
    } catch (error: any) {
      console.log("Profile error:", error.message);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          // adjust path if your role selection screen is different
          router.replace("/select-role");
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>⚙ Admin Settings</Text>

      {!userData ? (
        <Text style={{ textAlign: "center", marginVertical: 20 }}>
          Loading profile...
        </Text>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Profile Details</Text>
          <Text style={styles.item}>Name: {userData.name}</Text>
          <Text style={styles.item}>Email: {userData.email}</Text>
          <Text style={styles.item}>Role: {userData.role}</Text>
          {userData.address ? (
            <Text style={styles.item}>Address: {userData.address}</Text>
          ) : null}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Appearance</Text>
        <View style={styles.row}>
          <Text style={styles.item}>Dark Mode (UI demo only)</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ About App</Text>
        <Text style={styles.item}>AgroChain v1.0</Text>
        <Text style={styles.item}>Smart Farming & Marketplace Platform</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📞 Help & Support</Text>
        <Text style={styles.link}>support@agrochain.com</Text>
        <Text style={styles.link}>WhatsApp: +91 9988776655</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 Privacy</Text>
        <Text style={styles.item}>
          User accounts and data are stored securely using Firebase Authentication and
          Firestore.
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1E40AF",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  item: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    fontSize: 14,
    color: "#1D4ED8",
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
