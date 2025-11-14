// app/buyer/profile.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Profile() {
  return (
    <View style={styles.page}>
      <Text style={styles.name}>Buyer Name</Text>
      <Text style={styles.info}>buyer@example.com</Text>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.row}><Text>Address</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text>Payment methods</Text></TouchableOpacity>
        <TouchableOpacity style={styles.row}><Text>Logout</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 18, backgroundColor: "#fff" },
  name: { fontSize: 22, fontWeight: "900", color: "#0f5132" },
  info: { color: "#666", marginTop: 6 },
  row: { backgroundColor: "#f6fff7", padding: 12, borderRadius: 10, marginTop: 12 }
});
