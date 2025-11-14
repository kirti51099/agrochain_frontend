// app/buyer/orders.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const MOCK_ORDERS = [
  { id: "o1", status: "Delivered", total: 320, date: "2025-10-01" },
  { id: "o2", status: "Processing", total: 150, date: "2025-10-10" },
];

export default function Orders() {
  return (
    <View style={s.page}>
      <Text style={s.title}>Your Orders</Text>
      <FlatList data={MOCK_ORDERS} keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={{ fontWeight: "800" }}>{item.id}</Text>
            <Text>{item.date} • {item.status}</Text>
            <Text style={{ marginTop: 8, fontWeight: "900" }}>₹{item.total}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { textAlign: "center", fontSize: 20, fontWeight: "900", color: "#2E7D32", marginBottom: 12 },
  card: { backgroundColor: "#f6fff7", borderRadius: 12, padding: 12, marginVertical: 8, elevation: 2 }
});
