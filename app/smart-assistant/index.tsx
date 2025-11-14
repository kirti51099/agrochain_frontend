// app/smart-assistant/index.tsx
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const FEATURE_CARDS = [
  { id: "crop-recommendation", title: "Crop Recommendation", icon: <FontAwesome5 name="seedling" size={28} color="#fff" />, colors: ["#6EE7B7", "#10B981"] },
  { id: "disease-detection", title: "Disease Detection", icon: <MaterialCommunityIcons name="leaf" size={28} color="#fff" />, colors: ["#FDE68A", "#F59E0B"] },
  { id: "leaf-identification", title: "Leaf Identification", icon: <Ionicons name="leaf" size={28} color="#fff" />, colors: ["#93C5FD", "#2563EB"] },
  { id: "pesticide-recommendation", title: "Pesticide Recommendation", icon: <MaterialCommunityIcons name="flask" size={28} color="#fff" />, colors: ["#FCA5A5", "#EF4444"] },
];

export default function SmartAssistantHome() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(FEATURE_CARDS);

  React.useEffect(() => {
    const q = String(query || "").trim().toLowerCase();
    if (!q) setFiltered(FEATURE_CARDS);
    else setFiltered(FEATURE_CARDS.filter((f) => f.title.toLowerCase().includes(q)));
  }, [query]);

  // FAB animation
  const fabScale = useSharedValue(1);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  return (
    <LinearGradient colors={["#e6f7ec", "#e9fbe9"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Animated Greeting + small subtitle */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.greetingWrap}>
          <Text style={styles.greetingMain}>Hello, Farmer 👋</Text>
          <Text style={styles.greetingSub}>Smart suggestions for healthier crops</Text>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <StatCard label="Temp" value="28°C" icon={<MaterialCommunityIcons name="temperature-celsius" size={20} color="#0f5132" />} />
          <StatCard label="Humidity" value="62%" icon={<Ionicons name="water" size={20} color="#0f5132" />} />
          <StatCard label="Alerts" value="1" icon={<MaterialCommunityIcons name="alert-circle" size={20} color="#0f5132" />} />
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInUp.delay(300)} style={styles.searchWrap}>
          <TextInput
            placeholder="Search features or tips..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </Animated.View>

        {/* Quick tips */}
        <Animated.View entering={FadeInUp.delay(350)} style={styles.tips}>
          <Text style={styles.tipsText}>Tip: Tap <Text style={{fontWeight:"800"}}>Leaf Identification</Text> to quickly scan a leaf photo.</Text>
        </Animated.View>

        {/* Feature cards grid */}
        <View style={styles.grid}>
          {filtered.map((f, i) => (
            <AnimatedFeatureCard
              key={f.id}
              title={f.title}
              icon={f.icon}
              colors={f.colors}
              delay={350 + i * 80}
              onPress={() => router.push(`/smart-assistant/${f.id}`)}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />{/* bottom padding space so FAB doesn't hide content */}
      </ScrollView>

      {/* Floating Action Button: Quick Leaf Scan */}
      <Animated.View style={[styles.fabWrap, fabStyle]}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPressIn={() => (fabScale.value = withSpring(0.95))}
          onPressOut={() => (fabScale.value = withSpring(1))}
          onPress={() => router.push("/smart-assistant/leaf-identification")}
        >
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.fab}>
            <Ionicons name="camera" size={22} color="#fff" />
            <Text style={styles.fabText}>Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

/* ---------- Small components used above ---------- */

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statLeft}>{icon}</View>
      <View style={styles.statRight}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function AnimatedFeatureCard({
  title,
  icon,
  colors,
  onPress,
  delay = 0,
}: {
  title: string;
  icon: React.ReactNode;
  colors: string[];
  onPress: () => void;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.cardWrapper}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <LinearGradient colors={colors} style={styles.featureCard}>
          <View style={styles.featureIcon}>{icon}</View>
          <Text style={styles.featureTitle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 18, paddingBottom: 40 },

  greetingWrap: { marginTop: Platform.OS === "ios" ? 48 : 28, marginBottom: 12 },
  greetingMain: { fontSize: 28, fontWeight: "900", color: "#064e3b" },
  greetingSub: { color: "#0f5132", marginTop: 6 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  statCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, width: (width - 18 * 2 - 16) / 3, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 3 },
  statLeft: { marginRight: 8 },
  statRight: {},
  statValue: { fontWeight: "800", color: "#064e3b", fontSize: 16 },
  statLabel: { color: "#5b6b63", fontSize: 12 },

  searchWrap: { marginTop: 14 },
  searchInput: { backgroundColor: "#fff", borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1, borderColor: "#e6f3ea" },

  tips: { marginTop: 12, backgroundColor: "#f0fff7", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e6f8ee" },
  tipsText: { color: "#0f5132" },

  grid: { marginTop: 18, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cardWrapper: { width: width * 0.44, marginBottom: 18 },
  featureCard: { height: 150, borderRadius: 16, padding: 12, justifyContent: "space-between", alignItems: "flex-start" },
  featureIcon: { backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 12 },
  featureTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },

  fabWrap: { position: "absolute", right: 18, bottom: 22 },
  fab: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 40, elevation: 6, shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10 },
  fabText: { color: "#fff", marginLeft: 8, fontWeight: "800" },
});
