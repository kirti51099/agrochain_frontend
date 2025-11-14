// app/buyer/product-details.tsx
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSearchParams, useRouter } from "expo-router";

const PRODUCTS: Record<string, any> = {
  p1: { id: "p1", name: "Fresh Apples", price: 120, img: require("../../assets/images/apple.jpg"), description: "Sweet, crisp apples." },
  p2: { id: "p2", name: "Organic Tomatoes", price: 80, img: require("../../assets/images/tomato.jpg"), description: "Farm-fresh tomatoes." },
  p3: { id: "p3", name: "Potatoes", price: 50, img: require("../../assets/images/potato.png"), description: "Cleaned potatoes." },
  p4: { id: "p4", name: "Bananas", price: 100, img: require("../../assets/images/banana.jpg"), description: "Ripe bananas." },
};

export default function ProductDetails() {
  const { id } = useSearchParams(); // reads ?id=...
  const router = useRouter();
  const product = (id && PRODUCTS[id as string]) ?? null;

  if (!product) {
    return (
      <View style={styles.empty}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Image source={product.img} style={styles.img} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <View style={{ flexDirection: "row", marginTop: 18 }}>
        <TouchableOpacity style={[styles.cta, { backgroundColor: "#ffd54f" }]} onPress={() => router.push("/buyer/cart")}>
          <Text style={styles.ctaText}>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cta, { backgroundColor: "#1E88E5" }]} onPress={() => alert("Checkout demo")}>
          <Text style={styles.ctaText}>Buy now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, backgroundColor: "#fff" },
  img: { width: "100%", height: 220, borderRadius: 12, resizeMode: "cover" },
  name: { fontSize: 22, fontWeight: "900", marginTop: 12 },
  price: { color: "#10B981", fontWeight: "800", marginTop: 6 },
  desc: { marginTop: 10, color: "#444" },
  cta: { flex: 1, paddingVertical: 12, borderRadius: 10, marginHorizontal: 6, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
