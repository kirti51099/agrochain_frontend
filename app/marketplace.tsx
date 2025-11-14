// app/farmer/marketplace.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 24;
const CARD_HEIGHT = 220;

// Mock product list (replace image URIs with local require(...) if you want)
const PRODUCTS = [
  { id: "p1", name: "Fresh Apples", price: 120, unit: "kg", imageUri: "https://picsum.photos/id/1080/600/400" },
  { id: "p2", name: "Organic Tomatoes", price: 80, unit: "kg", imageUri: "https://picsum.photos/id/292/600/400" },
  { id: "p3", name: "Potatoes", price: 50, unit: "kg", imageUri: "https://picsum.photos/id/1081/600/400" },
  { id: "p4", name: "Bananas", price: 100, unit: "doz", imageUri: "https://picsum.photos/id/1082/600/400" },
  { id: "p5", name: "Spinach", price: 30, unit: "bundle", imageUri: "https://picsum.photos/id/1011/600/400" },
  { id: "p6", name: "Carrots", price: 60, unit: "kg", imageUri: "https://picsum.photos/id/29/600/400" },
];

export default function MarketplaceScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<typeof PRODUCTS>([]);
  const [refreshing, setRefreshing] = useState(false);

  // simulate data load
  useEffect(() => {
    const t = setTimeout(() => {
      setProducts(PRODUCTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  function onRefresh() {
    setRefreshing(true);
    // simulate refresh
    setTimeout(() => {
      setProducts(PRODUCTS); // in real app fetch again
      setRefreshing(false);
    }, 800);
  }

  function renderCard({ item }: { item: typeof PRODUCTS[number] }) {
    return (
      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            <Image
              source={{ uri: item.imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.info}>
            <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price} <Text style={styles.unit}>/{item.unit}</Text></Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/farmer/product-details?productId=${item.id}`)}
            >
              <LinearGradient colors={["#2E7D32", "#FFB74D"]} style={styles.cta}>
                <Text style={styles.ctaText}>View Details</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      data={products}
      keyExtractor={(p) => p.id}
      numColumns={2}
      renderItem={renderCard}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <View style={styles.headerWrap}>
          <Text style={styles.header}>Available Products</Text>
          <Text style={styles.headerSub}>Fresh, direct from farmers — browse and view details</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 40,
    backgroundColor: "#f5f7f6",
  },
  headerWrap: {
    marginBottom: 14,
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2E7D32",
  },
  headerSub: {
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 420,
  },

  cardWrap: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  imageWrap: {
    width: "100%",
    height: CARD_HEIGHT * 0.55,
    backgroundColor: "#eef7ef",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  info: {
    padding: 12,
    minHeight: CARD_HEIGHT * 0.35,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginBottom: 6,
  },

  price: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "900",
    marginBottom: 8,
  },

  unit: { fontWeight: "600", color: "#6b7280", fontSize: 12 },

  cta: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    width: "100%",
  },
  ctaText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
