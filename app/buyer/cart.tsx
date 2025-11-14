// app/buyer/cart.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

const MOCK_CART = [
  { id: "p1", name: "Fresh Apples", qty: 2, price: 120 },
  { id: "p3", name: "Potatoes", qty: 1, price: 50 },
];

export default function Cart() {
  const total = MOCK_CART.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList data={MOCK_CART} keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={{ fontWeight: "800" }}>{item.name}</Text>
              <Text>Qty: {item.qty}</Text>
            </View>
            <Text style={{ fontWeight: "800" }}>₹{item.qty * item.price}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <View style={styles.checkout}>
        <Text style={{ fontWeight: "900" }}>Total: ₹{total}</Text>
        <TouchableOpacity style={styles.pay} onPress={() => alert("Checkout demo")}>
          <Text style={{ color: "#fff", fontWeight: "900" }}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#f6fff7" },
  title: { fontSize: 20, fontWeight: "900", color: "#2E7D32", marginBottom: 12, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", padding: 12, backgroundColor: "#fff", borderRadius: 10, marginVertical: 8, elevation: 3 },
  checkout: { marginTop: "auto", backgroundColor: "#fff", padding: 14, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 4 },
  pay: { backgroundColor: "#10B981", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
});
