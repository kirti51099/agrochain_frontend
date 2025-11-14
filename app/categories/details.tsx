// app/categories/details.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 30;

// --- NOTE ---
// Make sure the files below exist exactly at: /assets/images/<name>
// Bundler is case-sensitive on many systems.
const categoryItems: Record<string, { id: string; title: string; image?: any }[]> = {
  Grains: [
    { id: "1", title: "Wheat", image: require("../../assets/images/wheat.png") },
    { id: "2", title: "Rice", image: require("../../assets/images/rice.png") },
    { id: "3", title: "Maize", image: require("../../assets/images/maize.png") },
  ],
  Vegetables: [
    { id: "4", title: "Potato", image: require("../../assets/images/potato.png") },
    { id: "5", title: "Onion", image: require("../../assets/images/onion.png") },
    { id: "6", title: "Tomato", image: require("../../assets/images/tomato.jpg") },
  ],
  Fruits: [
    { id: "7", title: "Mango", image: require("../../assets/images/mango.jpg") },
    { id: "8", title: "Banana", image: require("../../assets/images/banana.jpg") },
    { id: "9", title: "Apple", image: require("../../assets/images/apple.jpg") },
  ],
  Spices: [
    { id: "10", title: "Turmeric", image: require("../../assets/images/Turmeric.jpg") },
    { id: "11", title: "Chilli", image: require("../../assets/images/chilli.jpg") },
    { id: "12", title: "Coriander", image: require("../../assets/images/Coriander.jpg") },
  ],
  Others: [
    { id: "17", title: "Cotton", image: require("../../assets/images/cotton.png") },
    { id: "18", title: "Sugarcane", image: require("../../assets/images/sugarcane.png") },
  ],
};

export default function CategoryDetails() {
  const params = useLocalSearchParams() as { category?: string };
  const router = useRouter();
  const raw = params?.category ?? "";
  const selected = raw ? decodeURIComponent(String(raw)) : "";

  // memoize items for selected category
  const items = useMemo(() => {
    if (!selected) return [];
    return categoryItems[selected] ?? [];
  }, [selected]);

  // fallback placeholder (remote) if a local image fails to load
  const PLACEHOLDER = "https://via.placeholder.com/320x200.png?text=No+Image";

  // local state to track image loading errors per item
  const [erroredImages, setErroredImages] = useState<Record<string, boolean>>({});

  if (!selected) {
    return (
      <View style={styles.centerWrap}>
        <Text style={styles.muted}>No category provided.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={22} color="#0f5132" />
        </TouchableOpacity>

        <Text style={styles.header}>{selected} Crops</Text>

        {/* spacer to center header */}
        <View style={{ width: 42 }} />
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No items available for this category.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 60, paddingTop: 8 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  // optional: navigate to an item detail screen (if you have one)
                  // router.push(`/categories/item?category=${encodeURIComponent(selected)}&item=${encodeURIComponent(item.title)}`)
                }}
                style={{ alignItems: "center" }}
              >
                <Image
                  source={erroredImages[item.id] ? { uri: PLACEHOLDER } : item.image}
                  style={styles.image}
                  onError={() => setErroredImages((s) => ({ ...s, [item.id]: true }))}
                />
                <Text style={styles.title}>{item.title}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f7", paddingTop: 20, paddingHorizontal: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  iconBtn: { width: 42, height: 42, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f5132",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: CARD_WIDTH,
    margin: 10,
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  image: { width: CARD_WIDTH - 20, height: 100, borderRadius: 10, resizeMode: "cover", backgroundColor: "#eee" },
  title: { fontSize: 16, fontWeight: "600", marginTop: 8, color: "#333" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyText: { color: "#777", fontSize: 16 },
  centerWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: "#666", fontSize: 16, marginBottom: 12 },
  backBtn: {
    marginTop: 12,
    backgroundColor: "#0f5132",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
});
