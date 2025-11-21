// // app/smart-assistant/index.tsx
// import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Dimensions,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Animated, {
//   FadeIn,
//   FadeInUp,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
// } from "react-native-reanimated";

// const { width } = Dimensions.get("window");

// const FEATURE_CARDS = [
//   { id: "crop-recommendation", title: "Crop Recommendation", icon: <FontAwesome5 name="seedling" size={28} color="#fff" />, colors: ["#6EE7B7", "#10B981"] },
//   { id: "disease-detection", title: "Disease Detection", icon: <MaterialCommunityIcons name="leaf" size={28} color="#fff" />, colors: ["#FDE68A", "#F59E0B"] },
//   { id: "leaf-identification", title: "Leaf Identification", icon: <Ionicons name="leaf" size={28} color="#fff" />, colors: ["#93C5FD", "#2563EB"] },
//   { id: "pesticide-recommendation", title: "Pesticide Recommendation", icon: <MaterialCommunityIcons name="flask" size={28} color="#fff" />, colors: ["#FCA5A5", "#EF4444"] },
// ];

// export default function SmartAssistantHome() {
//   const router = useRouter();
//   const [query, setQuery] = useState("");
//   const [filtered, setFiltered] = useState(FEATURE_CARDS);

//   React.useEffect(() => {
//     const q = String(query || "").trim().toLowerCase();
//     if (!q) setFiltered(FEATURE_CARDS);
//     else setFiltered(FEATURE_CARDS.filter((f) => f.title.toLowerCase().includes(q)));
//   }, [query]);

//   // FAB animation
//   const fabScale = useSharedValue(1);
//   const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

//   return (
//     <LinearGradient colors={["#e6f7ec", "#e9fbe9"]} style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
//         {/* Animated Greeting + small subtitle */}
//         <Animated.View entering={FadeIn.delay(100)} style={styles.greetingWrap}>
//           <Text style={styles.greetingMain}>Hello, Farmer 👋</Text>
//           <Text style={styles.greetingSub}>Smart suggestions for healthier crops</Text>
//         </Animated.View>

//         {/* Stats Row */}
//         <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
//           <StatCard label="Temp" value="28°C" icon={<MaterialCommunityIcons name="temperature-celsius" size={20} color="#0f5132" />} />
//           <StatCard label="Humidity" value="62%" icon={<Ionicons name="water" size={20} color="#0f5132" />} />
//           <StatCard label="Alerts" value="1" icon={<MaterialCommunityIcons name="alert-circle" size={20} color="#0f5132" />} />
//         </Animated.View>

//         {/* Search */}
//         <Animated.View entering={FadeInUp.delay(300)} style={styles.searchWrap}>
//           <TextInput
//             placeholder="Search features or tips..."
//             placeholderTextColor="#6b7280"
//             value={query}
//             onChangeText={setQuery}
//             style={styles.searchInput}
//           />
//         </Animated.View>

//         {/* Quick tips */}
//         <Animated.View entering={FadeInUp.delay(350)} style={styles.tips}>
//           <Text style={styles.tipsText}>Tip: Tap <Text style={{fontWeight:"800"}}>Leaf Identification</Text> to quickly scan a leaf photo.</Text>
//         </Animated.View>

//         {/* Feature cards grid */}
//         <View style={styles.grid}>
//           {filtered.map((f, i) => (
//             <AnimatedFeatureCard
//               key={f.id}
//               title={f.title}
//               icon={f.icon}
//               colors={f.colors}
//               delay={350 + i * 80}
//               onPress={() => router.push(`/smart-assistant/${f.id}`)}
//             />
//           ))}
//         </View>

//         <View style={{ height: 120 }} />{/* bottom padding space so FAB doesn't hide content */}
//       </ScrollView>

//       {/* Floating Action Button: Quick Leaf Scan */}
//       <Animated.View style={[styles.fabWrap, fabStyle]}>
//         <TouchableOpacity
//           activeOpacity={0.85}
//           onPressIn={() => (fabScale.value = withSpring(0.95))}
//           onPressOut={() => (fabScale.value = withSpring(1))}
//           onPress={() => router.push("/smart-assistant/leaf-identification")}
//         >
//           <LinearGradient colors={["#10B981", "#059669"]} style={styles.fab}>
//             <Ionicons name="camera" size={22} color="#fff" />
//             <Text style={styles.fabText}>Scan</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     </LinearGradient>
//   );
// }

// /* ---------- Small components used above ---------- */

// function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
//   return (
//     <View style={styles.statCard}>
//       <View style={styles.statLeft}>{icon}</View>
//       <View style={styles.statRight}>
//         <Text style={styles.statValue}>{value}</Text>
//         <Text style={styles.statLabel}>{label}</Text>
//       </View>
//     </View>
//   );
// }

// function AnimatedFeatureCard({
//   title,
//   icon,
//   colors,
//   onPress,
//   delay = 0,
// }: {
//   title: string;
//   icon: React.ReactNode;
//   colors: string[];
//   onPress: () => void;
//   delay?: number;
// }) {
//   return (
//     <Animated.View entering={FadeInUp.delay(delay)} style={styles.cardWrapper}>
//       <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
//         <LinearGradient colors={colors} style={styles.featureCard}>
//           <View style={styles.featureIcon}>{icon}</View>
//           <Text style={styles.featureTitle}>{title}</Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// }

// /* ---------- Styles ---------- */

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scroll: { padding: 18, paddingBottom: 40 },

//   greetingWrap: { marginTop: Platform.OS === "ios" ? 48 : 28, marginBottom: 12 },
//   greetingMain: { fontSize: 28, fontWeight: "900", color: "#064e3b" },
//   greetingSub: { color: "#0f5132", marginTop: 6 },

//   statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
//   statCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, width: (width - 18 * 2 - 16) / 3, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 3 },
//   statLeft: { marginRight: 8 },
//   statRight: {},
//   statValue: { fontWeight: "800", color: "#064e3b", fontSize: 16 },
//   statLabel: { color: "#5b6b63", fontSize: 12 },

//   searchWrap: { marginTop: 14 },
//   searchInput: { backgroundColor: "#fff", borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1, borderColor: "#e6f3ea" },

//   tips: { marginTop: 12, backgroundColor: "#f0fff7", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#e6f8ee" },
//   tipsText: { color: "#0f5132" },

//   grid: { marginTop: 18, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   cardWrapper: { width: width * 0.44, marginBottom: 18 },
//   featureCard: { height: 150, borderRadius: 16, padding: 12, justifyContent: "space-between", alignItems: "flex-start" },
//   featureIcon: { backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 12 },
//   featureTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },

//   fabWrap: { position: "absolute", right: 18, bottom: 22 },
//   fab: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 40, elevation: 6, shadowColor: "#000", shadowOpacity: 0.18, shadowOffset: { width: 0, height: 8 }, shadowRadius: 10 },
//   fabText: { color: "#fff", marginLeft: 8, fontWeight: "800" },
// });
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
  {
    id: "crop-recommendation",
    title: "Crop Recommendation",
    caption: "Best crops for your soil & weather",
    icon: <FontAwesome5 name="seedling" size={28} color="#fff" />,
    colors: ["#6EE7B7", "#10B981"],
  },
  {
    id: "disease-detection",
    title: "Disease Detection",
    caption: "Scan leaf & detect issues early",
    icon: <MaterialCommunityIcons name="leaf" size={28} color="#fff" />,
    colors: ["#FDE68A", "#F59E0B"],
  },
  {
    id: "leaf-identification",
    title: "Leaf Identification",
    caption: "Identify plant from a leaf photo",
    icon: <Ionicons name="leaf" size={28} color="#fff" />,
    colors: ["#93C5FD", "#2563EB"],
  },
  {
    id: "pesticide-recommendation",
    title: "Pesticide Recommendation",
    caption: "Smart remedies & safe suggestions",
    icon: <MaterialCommunityIcons name="flask" size={28} color="#fff" />,
    colors: ["#FCA5A5", "#EF4444"],
  },
];

const QUICK_QUESTIONS = [
  "Which crop is best for Kharif?",
  "Leaf turning yellow – why?",
  "Low rainfall crop options?",
  "Organic spray for powdery mildew?",
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / hero */}
        <Animated.View entering={FadeIn.delay(80)} style={styles.heroWrap}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroTitle}>Smart Farming Assistant</Text>
            <Text style={styles.heroSub}>
              Get crop ideas, detect diseases and choose safe remedies in seconds.
            </Text>
          </View>
          <View style={styles.heroRight}>
            <View style={styles.heroPill}>
              <MaterialCommunityIcons
                name="robot-happy-outline"
                size={20}
                color="#0f5132"
              />
              <Text style={styles.heroPillText}>AI Powered</Text>
            </View>
            <View style={[styles.heroPill, { backgroundColor: "#ecfdf3" }]}>
              <Ionicons name="leaf" size={18} color="#15803d" />
              <Text style={[styles.heroPillText, { color: "#166534" }]}>
                Crop & Leaf Focused
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Mini stats row (can be wired to backend later) */}
        <Animated.View entering={FadeInUp.delay(160)} style={styles.statsRow}>
          <StatCard
            label="Today’s Temp"
            value="28°C"
            accent="#15803d"
            icon={
              <MaterialCommunityIcons
                name="temperature-celsius"
                size={20}
                color="#0f5132"
              />
            }
          />
          <StatCard
            label="Humidity"
            value="62%"
            accent="#0e7490"
            icon={<Ionicons name="water" size={20} color="#0f5132" />}
          />
          <StatCard
            label="Alerts"
            value="1"
            accent="#b45309"
            icon={
              <MaterialCommunityIcons
                name="alert-circle"
                size={20}
                color="#0f5132"
              />
            }
          />
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInUp.delay(220)} style={styles.searchWrap}>
          <Text style={styles.sectionTitle}>Search assistant features</Text>
          <TextInput
            placeholder="Search features (e.g. disease, pesticide, crop)..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
          />
        </Animated.View>

        {/* Quick questions chips */}
        <Animated.View entering={FadeInUp.delay(260)} style={styles.quickWrap}>
          <Text style={styles.sectionTitle}>Quick questions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
          >
            {QUICK_QUESTIONS.map((q) => (
              <View key={q} style={styles.chip}>
                <Ionicons name="help-circle-outline" size={16} color="#166534" />
                <Text style={styles.chipText}>{q}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Feature cards grid */}
        <View style={styles.gridHeader}>
          <Text style={styles.sectionTitle}>Assistant tools</Text>
          <Text style={styles.sectionCaption}>Tap a card to get started</Text>
        </View>

        <View style={styles.grid}>
          {filtered.map((f, i) => (
            <AnimatedFeatureCard
              key={f.id}
              title={f.title}
              caption={f.caption}
              icon={f.icon}
              colors={f.colors}
              delay={300 + i * 80}
              onPress={() => router.push(`/smart-assistant/${f.id}`)}
            />
          ))}
          {filtered.length === 0 && (
            <Text style={styles.emptyText}>
              No features match your search. Try typing “crop” or “disease”.
            </Text>
          )}
        </View>

        {/* Bottom spacing so FAB doesn't overlap content */}
        <View style={{ height: 120 }} />
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
            <Text style={styles.fabText}>Quick Leaf Scan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

/* ---------- Small components ---------- */

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIconWrap,
          { backgroundColor: accent + "22", borderColor: accent + "55" },
        ]}
      >
        {icon}
      </View>
      <View style={styles.statRight}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function AnimatedFeatureCard({
  title,
  caption,
  icon,
  colors,
  onPress,
  delay = 0,
}: {
  title: string;
  caption: string;
  icon: React.ReactNode;
  colors: string[];
  onPress: () => void;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInUp.delay(delay)} style={styles.cardWrapper}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <LinearGradient colors={colors} style={styles.featureCard}>
          <View style={styles.featureTopRow}>
            <View style={styles.featureIcon}>{icon}</View>
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeText}>Smart</Text>
            </View>
          </View>
          <Text style={styles.featureTitle}>{title}</Text>
          <Text style={styles.featureCaption}>{caption}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 18, paddingBottom: 40 },

  heroWrap: {
    marginTop: Platform.OS === "ios" ? 48 : 28,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroLeft: { flex: 2, paddingRight: 10 },
  heroRight: {
    flex: 1.5,
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
  },
  heroTitle: { fontSize: 24, fontWeight: "900", color: "#064e3b" },
  heroSub: {
    marginTop: 6,
    color: "#0f5132",
    fontSize: 13,
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fff7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  heroPillText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#166534",
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    width: (width - 18 * 2 - 16) / 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  statIconWrap: {
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 6,
  },
  statRight: {},
  statValue: { fontWeight: "800", color: "#064e3b", fontSize: 15 },
  statLabel: { color: "#5b6b63", fontSize: 11 },

  searchWrap: { marginTop: 18 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#064e3b",
    marginBottom: 6,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e6f3ea",
  },

  quickWrap: { marginTop: 16 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecfdf3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  chipText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#166534",
  },

  gridHeader: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  sectionCaption: {
    fontSize: 12,
    color: "#64748b",
  },

  grid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: { width: width * 0.44, marginBottom: 18 },
  featureCard: {
    height: 165,
    borderRadius: 18,
    padding: 12,
    justifyContent: "space-between",
  },
  featureTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  featureIcon: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    borderRadius: 12,
  },
  badgeWrap: {
    backgroundColor: "rgba(255,255,255,0.28)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    color: "#fefce8",
    fontWeight: "700",
  },
  featureTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  featureCaption: {
    color: "#f9fafb",
    fontSize: 12,
    opacity: 0.9,
  },

  emptyText: {
    marginTop: 8,
    width: "100%",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 13,
  },

  fabWrap: { position: "absolute", right: 18, bottom: 22 },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 40,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
  },
  fabText: { color: "#fff", marginLeft: 8, fontWeight: "800", fontSize: 14 },
});
