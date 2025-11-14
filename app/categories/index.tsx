// app/categories/index.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 28; // responsive card width

const ALL_CATEGORIES = [
  { id: "1", name: "Grains", icon: "corn", colors: ["#FDE68A", "#FBBF24"] },
  { id: "2", name: "Vegetables", icon: "carrot", colors: ["#A7F3D0", "#4CAF50"] },
  { id: "3", name: "Fruits", icon: "fruit-grapes", colors: ["#FBCFE8", "#FB7185"] },
  { id: "4", name: "Spices", icon: "chili-mild", colors: ["#FFD8A8", "#FB923C"] },
  { id: "5", name: "Pulses", icon: "sprout", colors: ["#C7F9CC", "#34D399"] },
  { id: "6", name: "Oilseeds", icon: "seed", colors: ["#DDEAFE", "#60A5FA"] },
  { id: "7", name: "Fibers", icon: "sack-percent", colors: ["#E9D5FF", "#A78BFA"] },
  { id: "8", name: "Others", icon: "basket", colors: ["#E6FFFA", "#34D399"] },
];

export default function Categories() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_CATEGORIES;
    const q = query.trim().toLowerCase();
    return ALL_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const renderCard = ({ item }: { item: typeof ALL_CATEGORIES[number] }) => {
    return <CategoryCard item={item} onPress={() => router.push(`/categories/details?category=${encodeURIComponent(item.name)}`)} />;
  };

  return (
    <LinearGradient colors={["#F0F7F3", "#FFFFFF"]} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>🌾 Browse Categories</Text>
        <Text style={styles.subtitle}>Quickly find crops, seeds and groups</Text>
      </View>

      <View style={styles.searchWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
        <TextInput
          placeholder="Search categories..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholderTextColor="#8b98a5"
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No categories found.</Text>
          </View>
        }
      />
    </LinearGradient>
  );
}

/* ---------- CategoryCard (animated) ---------- */
function CategoryCard({
  item,
  onPress,
}: {
  item: { id: string; name: string; icon: string; colors: string[] };
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInUp.duration(300)} style={[styles.cardWrapper, animated]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        <LinearGradient colors={item.colors} style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name={item.icon as any} size={34} color="#fff" />
          </View>

          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardSubtitle}>Tap to view</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: Platform.OS === "android" ? 38 : 56, paddingHorizontal: 16 },
  header: { marginBottom: 14, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "900", color: "#0f5132" },
  subtitle: { fontSize: 13, color: "#4b5563", marginTop: 6 },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    height: 36,
    fontSize: 15,
  },

  listContent: {
    paddingBottom: 40,
    paddingTop: 6,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },

  cardWrapper: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    marginTop: 6,
    opacity: 0.95,
  },

  empty: { marginTop: 60, alignItems: "center" },
  emptyText: { color: "#6b7280" },
});
