// app/buyer/index.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;
const PROMO_W = width - 40;

const features = [
  {
    key: "products",
    title: "Products",
    icon: <MaterialCommunityIcons name="basket" size={36} color="#fff" />,
    route: "/buyer/products",
    colors: ["#66BB6A", "#43A047"],
  },
  {
    key: "cart",
    title: "Cart",
    icon: <FontAwesome5 name="shopping-cart" size={32} color="#fff" />,
    route: "/buyer/cart",
    colors: ["#F59E0B", "#F97316"],
  },
  {
    key: "orders",
    title: "Orders",
    icon: <MaterialCommunityIcons name="clipboard-list" size={36} color="#fff" />,
    route: "/buyer/orders",
    colors: ["#60A5FA", "#2563EB"],
  },
  {
    key: "profile",
    title: "Profile",
    icon: <MaterialCommunityIcons name="account-circle" size={36} color="#fff" />,
    route: "/buyer/profile",
    colors: ["#A78BFA", "#7C3AED"],
  },
];

const promos = [
  { id: "d1", title: "Fresh Apples - 20% off", sub: "From local orchards", badge: "Hot" },
  { id: "d2", title: "Organic Tomatoes", sub: "Farm-fresh & safe", badge: "New" },
  { id: "d3", title: "Bulk Potatoes", sub: "Best price on bulk", badge: "Deal" },
];

const categories = ["All", "Fruits", "Vegetables", "Grains", "Spices"];

export default function BuyerDashboard() {
  const router = useRouter();
  const scaleMap = useRef<Record<string, Animated.Value>>(
    features.reduce((acc, f) => ((acc[f.key] = new Animated.Value(1)), acc), {} as any)
  ).current;

  const onPressIn = (key: string) =>
    Animated.spring(scaleMap[key], { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = (key: string) =>
    Animated.spring(scaleMap[key], { toValue: 1, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#F6FFFA", "#E8F5E9"]} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hey}>Hey there,</Text>
            <Text style={styles.greet}>Welcome to AgroChain 👋</Text>
          </View>

          <TouchableOpacity onPress={() => router.push("/buyer/profile")}>
            <MaterialCommunityIcons name="account-circle" size={46} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        {/* Search + quick stats */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
            <TextInput
              placeholder="Search products or farmers"
              style={styles.searchInput}
              placeholderTextColor="#6b7280"
            />
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNum}>₹0</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Promo carousel */}
        <FlatList
          data={promos}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18 }}
          snapToInterval={PROMO_W}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.95} onPress={() => router.push("/buyer/products")}>
              <LinearGradient colors={["#fff", "#f7fff7"]} style={styles.promoCard}>
                <View style={styles.promoTop}>
                  <Text style={styles.promoBadge}>{item.badge}</Text>
                </View>
                <Text style={styles.promoTitle}>{item.title}</Text>
                <Text style={styles.promoSub}>{item.sub}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />

        {/* Categories strip */}
        <View style={styles.catStrip}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18 }}
            keyExtractor={(c) => c}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.catItem}
                onPress={() =>
                  router.push(`/categories/details?category=${encodeURIComponent(item)}`)
                }
              >
                <Text style={[styles.catText, item === "All" && styles.catAll]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Feature grid */}
        <FlatList
          data={features}
          keyExtractor={(i) => i.key}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 18 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
          renderItem={({ item }) => {
            const scale = scaleMap[item.key];
            return (
              <Animated.View style={{ transform: [{ scale }], width: CARD_WIDTH }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPressIn={() => onPressIn(item.key)}
                  onPressOut={() => onPressOut(item.key)}
                  onPress={() => router.push(item.route)}
                >
                  <LinearGradient colors={item.colors} style={styles.card}>
                    <View style={styles.iconWrap}>{item.icon}</View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSub}>
                      {item.key === "products"
                        ? "Explore fresh items"
                        : item.key === "orders"
                        ? "Track your orders"
                        : "Manage easily"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />

        {/* Footer note */}
        <View style={styles.footerNoteWrap}>
          <Text style={styles.footerNote}>
            Buy directly from farmers — save money and support local agriculture.
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  hey: { color: "#6b7280", fontSize: 14 },
  greet: { fontSize: 22, fontWeight: "900", color: "#0f5132" },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 2,
    marginRight: 12,
  },
  searchInput: { marginLeft: 8, fontSize: 14, flex: 1 },

  stat: {
    width: 84,
    alignItems: "center",
    backgroundColor: "#E6FFED",
    paddingVertical: 8,
    borderRadius: 10,
  },
  statNum: { fontWeight: "900", color: "#0f5132" },
  statLabel: { fontSize: 11, color: "#2f855a" },

  promoCard: {
    width: PROMO_W,
    height: 120,
    borderRadius: 16,
    marginRight: 14,
    padding: 14,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  promoTop: { flexDirection: "row", justifyContent: "flex-end" },
  promoBadge: {
    backgroundColor: "#FFEDD5",
    color: "#7C2D12",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: "800",
    overflow: "hidden",
  },
  promoTitle: { fontSize: 16, fontWeight: "900", color: "#0f5132" },
  promoSub: { fontSize: 13, color: "#4b5563" },

  catStrip: { marginTop: 12, paddingVertical: 8 },
  catItem: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    elevation: 2,
    marginLeft: 2,
  },
  catText: { color: "#374151" },
  catAll: { color: "#0f5132", fontWeight: "900" },

  card: {
    height: 165,
    borderRadius: 16,
    padding: 14,
    justifyContent: "center",
    alignItems: "flex-start",
    marginVertical: 8,
    overflow: "hidden",
  },
  iconWrap: { position: "absolute", right: 14, top: 14, opacity: 0.95 },
  cardTitle: { color: "#fff", fontSize: 18, fontWeight: "900" },
  cardSub: { color: "#ffffffcc", marginTop: 8, fontSize: 12 },

  footerNoteWrap: { padding: 18 },
  footerNote: { textAlign: "center", color: "#4b5563" },
});
