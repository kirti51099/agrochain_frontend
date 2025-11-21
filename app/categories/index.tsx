// app/categories/index.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useLanguage } from "../i18n/LanguageContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 28; // responsive card width

// Direct image imports for categories
const ALL_CATEGORIES = [
  { 
    id: "1", 
    name: "Grains", 
    nameMr: "धान्ये", 
    icon: "corn", 
    colors: ["#FDE68A", "#FBBF24"], 
    description: "Rice, Wheat, Maize, Barley", 
    descriptionMr: "तांदूळ, गहू, मका, जव",
    image: require("../../assets/images/rice.png"),
  },
  { 
    id: "2", 
    name: "Vegetables", 
    nameMr: "भाज्या", 
    icon: "carrot", 
    colors: ["#A7F3D0", "#4CAF50"], 
    description: "Tomato, Potato, Onion, Cabbage", 
    descriptionMr: "टोमॅटो, बटाटा, कांदा, कोबी",
    image: require("../../assets/images/tomato.jpg"),
  },
  { 
    id: "3", 
    name: "Fruits", 
    nameMr: "फळे", 
    icon: "fruit-grapes", 
    colors: ["#FBCFE8", "#FB7185"], 
    description: "Mango, Banana, Apple, Orange", 
    descriptionMr: "आंबा, केळी, सफरचंद, संत्रे",
    image: require("../../assets/images/mango.jpg"),
  },
  { 
    id: "4", 
    name: "Spices", 
    nameMr: "मसाले", 
    icon: "chili-mild", 
    colors: ["#FFD8A8", "#FB923C"], 
    description: "Turmeric, Chili, Cumin, Coriander", 
    descriptionMr: "हळद, मिरची, जिरे, धणे",
    image: require("../../assets/images/Turmeric.jpg"),
  },
  { 
    id: "5", 
    name: "Pulses", 
    nameMr: "डाळी", 
    icon: "sprout", 
    colors: ["#C7F9CC", "#34D399"], 
    description: "Lentil, Chickpea, Black Gram", 
    descriptionMr: "मसूर, चणे, उडीद",
    image: require("../../assets/images/pulses.png"),
  },
  { 
    id: "6", 
    name: "Oilseeds", 
    nameMr: "तेलबिया", 
    icon: "seed", 
    colors: ["#DDEAFE", "#60A5FA"], 
    description: "Groundnut, Sunflower, Mustard", 
    descriptionMr: "शेंगदाणे, सूर्यफूल, मोहरी",
    image: require("../../assets/images/groundnut.png"),
  },
  { 
    id: "7", 
    name: "Fibers", 
    nameMr: "फायबर", 
    icon: "sack-percent", 
    colors: ["#E9D5FF", "#A78BFA"], 
    description: "Cotton, Jute, Hemp", 
    descriptionMr: "कापूस, ज्यूट, हेम्प",
    image: require("../../assets/images/cotton.png"),
  },
  { 
    id: "8", 
    name: "Cash Crops", 
    nameMr: "रोख पिके", 
    icon: "currency-usd", 
    colors: ["#FED7AA", "#F97316"], 
    description: "Sugarcane, Coffee, Tea", 
    descriptionMr: "ऊस, कॉफी, चहा",
    image: require("../../assets/images/sugarcane.png"),
  },
  { 
    id: "9", 
    name: "Medicinal", 
    nameMr: "औषधी", 
    icon: "leaf", 
    colors: ["#D1FAE5", "#10B981"], 
    description: "Aloe Vera, Tulsi, Neem", 
    descriptionMr: "कोरफड, तुळस, कडुनिंब",
    image: require("../../assets/images/hero_leaf.jpg"),
  },
  { 
    id: "10", 
    name: "Flowers", 
    nameMr: "फुले", 
    icon: "flower", 
    colors: ["#FCE7F3", "#EC4899"], 
    description: "Rose, Marigold, Jasmine", 
    descriptionMr: "गुलाब, झेंडू, मोगरा",
    image: null,
  },
  { 
    id: "11", 
    name: "Nuts", 
    nameMr: "काजू", 
    icon: "nut", 
    colors: ["#FEF3C7", "#F59E0B"], 
    description: "Cashew, Almond, Walnut", 
    descriptionMr: "काजू, बदाम, अक्रोड",
    image: null,
  },
  { 
    id: "12", 
    name: "Others", 
    nameMr: "इतर", 
    icon: "basket", 
    colors: ["#E6FFFA", "#34D399"], 
    description: "Miscellaneous crops", 
    descriptionMr: "विविध पिके",
    image: null,
  },
];

export default function Categories() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_CATEGORIES;
    const q = query.trim().toLowerCase();
    return ALL_CATEGORIES.filter((c) => 
      c.name.toLowerCase().includes(q) || 
      (c.nameMr && c.nameMr.toLowerCase().includes(q))
    );
  }, [query]);

  const renderCard = ({ item }: { item: typeof ALL_CATEGORIES[number] }) => {
    return <CategoryCard item={item} onPress={() => router.push(`/categories/details?category=${encodeURIComponent(item.name)}`)} />;
  };

  return (
    <View style={styles.screen}>
      {/* <BackHeader title={t("categories") || "Categories"} /> */}
      <LinearGradient colors={["#F0F7F3", "#FFFFFF"]} style={styles.gradient}>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6b7280" />
          <TextInput
            placeholder={t("searchCategories") || "Search categories..."}
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
            <Text style={styles.emptyText}>{t("noCategoriesFound") || "No categories found."}</Text>
          </View>
        }
      />
      </LinearGradient>
    </View>
  );
}

/* ---------- CategoryCard (animated) ---------- */
function CategoryCard({
  item,
  onPress,
}: {
  item: { 
    id: string; 
    name: string; 
    nameMr?: string; 
    icon: string; 
    colors: string[]; 
    description?: string; 
    descriptionMr?: string;
    image?: any;
  };
  onPress: () => void;
}) {
  const { language } = useLanguage();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Use image if available, otherwise use icon
  const categoryImage = item.image;

  return (
    <Animated.View entering={FadeInUp.duration(300)} style={[styles.cardWrapper, animated]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        <LinearGradient colors={item.colors} style={styles.card}>
          {categoryImage ? (
            <View style={styles.imageContainer}>
              <Image source={categoryImage} style={styles.categoryImage} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name={item.icon as any} size={36} color="#fff" />
            </View>
          )}

          <Text style={styles.cardTitle}>{language === "mr" && item.nameMr ? item.nameMr : item.name}</Text>
          {item.description && (
            <Text style={styles.cardDescription}>
              {language === "mr" && item.descriptionMr ? item.descriptionMr : item.description}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F0F7F3" },
  gradient: { flex: 1, paddingTop: 10, paddingHorizontal: 16 },
  header: { marginBottom: 14, alignItems: "center", marginTop: 10 },
  title: { fontSize: 22, fontWeight: "900", color: "#0f5132" },
  subtitle: { fontSize: 13, color: "#4b5563", marginTop: 6, textAlign: "center" },

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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff33",
    overflow: "hidden",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff66",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
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
    marginTop: 4,
  },
  cardDescription: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
    opacity: 0.9,
  },
  cardSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    marginTop: 6,
    opacity: 0.95,
    fontWeight: "600",
  },

  empty: { marginTop: 60, alignItems: "center" },
  emptyText: { color: "#6b7280" },
});
