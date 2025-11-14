// app/buyer/products.tsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_W = (width / 2) - 24;

const MOCK_PRODUCTS = [
  { id: "p1", name: "Fresh Apples", price: 120, img: require("../../assets/images/apple.jpg") },
  { id: "p2", name: "Organic Tomatoes", price: 80, img: require("../../assets/images/tomato.jpg") },
  { id: "p3", name: "Potatoes", price: 50, img: require("../../assets/images/potato.png") },
  { id: "p4", name: "Bananas", price: 100, img: require("../../assets/images/banana.jpg") },
  // add more images to assets/images or reuse
];

export default function Products() {
  const router = useRouter();
  const [products] = useState(MOCK_PRODUCTS);

  return (
    <View style={s.page}>
      <Text style={s.title}>Available Products</Text>

      <FlatList
        data={products}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 12 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Image source={item.img} style={s.img} />
            <Text style={s.name}>{item.name}</Text>
            <Text style={s.price}>₹{item.price}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
              <TouchableOpacity style={s.btn} onPress={() => router.push({ pathname: "/buyer/product-details", params: { id: item.id } })}>
                <Text style={s.btnText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.btn, { backgroundColor: "#10B981" }]} onPress={() => router.push("/buyer/cart")}>
                <Text style={s.btnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, paddingTop: 18, backgroundColor: "#f6fff7" },
  title: { fontSize: 20, fontWeight: "900", color: "#2E7D32", textAlign: "center", marginBottom: 12 },
  card: { width: CARD_W, backgroundColor: "#fff", borderRadius: 12, padding: 12, marginVertical: 10, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  img: { width: "100%", height: 110, borderRadius: 8, resizeMode: "cover" },
  name: { marginTop: 8, fontWeight: "800", color: "#111" },
  price: { color: "#10B981", marginTop: 4, fontWeight: "800" },
  btn: { backgroundColor: "#ffd54f", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10 },
  btnText: { fontWeight: "800", color: "#fff", textAlign: "center" },
});
