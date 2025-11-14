// // app/farmer/dashboard.tsx
// import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef } from "react";
// import {
//   Animated,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = width * 0.9;

// export default function FarmerDashboard() {
//   const router = useRouter();
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(20)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const cards = [
//     {
//       id: 1,
//       title: "🌤️ Weather",
//       subtitle: "Check today’s forecast & crop safety alerts",
//       colors: ["#A7F3D0", "#4CAF50"],
//       icon: <MaterialCommunityIcons name="weather-partly-cloudy" size={40} color="#fff" />,
//       route: "/weather",
//     },
//     {
//       id: 2,
//       title: "🧠 Smart Assistant",
//       subtitle: "AI crop, soil & disease insights",
//       colors: ["#BBDEFB", "#2196F3"],
//       icon: <FontAwesome5 name="robot" size={36} color="#fff" />,
//      // use this to open assistant home
//       route:"/smart-assistant",

//     },
//     {
//       id: 3,
//       title: "🌾 Crop Management",
//       subtitle: "Add & track your growing crops",
//       colors: ["#FFF9C4", "#FBC02D"],
//       icon: <MaterialCommunityIcons name="sprout" size={38} color="#fff" />,
//       route: "/farmer/crops",
//     },
//     {
//       id: 4,
//       title: "🛒 Marketplace",
//       subtitle: "Sell your produce directly to buyers",
//       colors: ["#FFCCBC", "#FF7043"],
//       icon: <FontAwesome5 name="store" size={36} color="#fff" />,
//       route: "/farmer/marketplace",
//     },
  
//   {
//       id: 5,
//       title: "Categories",
//       subtitle: "Browse crop categories",
//       colors: ["#FDE68A", "#FBBF24"],
//       icon: <MaterialCommunityIcons name="grid" size={34} color="#fff" />,
//       route: "/categories",
//     },
//   ];

//   return (
//     <LinearGradient colors={["#E8F5E9", "#FFFFFF"]} style={styles.container}>
//       <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
//         <Text style={styles.greeting}>👋 Hello, Farmer</Text>
//         <Text style={styles.sub}>Your Smart Farming Dashboard</Text>
//       </Animated.View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
//       >
//         {cards.map((card) => (
//           <TouchableOpacity
//             key={card.id}
//             activeOpacity={0.9}
//             onPress={() => router.push(card.route)}
//           >
//             <LinearGradient colors={card.colors} style={styles.card}>
//               <View style={styles.iconWrap}>{card.icon}</View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.cardTitle}>{card.title}</Text>
//                 <Text style={styles.cardSub}>{card.subtitle}</Text>
//               </View>
//             </LinearGradient>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 50 },
//   header: { alignItems: "center", marginBottom: 20 },
//   greeting: { fontSize: 26, fontWeight: "bold", color: "#2E7D32" },
//   sub: { fontSize: 14, color: "#4E6E33", marginTop: 4 },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 18,
//     marginVertical: 10,
//     padding: 20,
//     width: CARD_WIDTH,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   iconWrap: {
//     width: 60,
//     height: 60,
//     borderRadius: 15,
//     backgroundColor: "#ffffff33",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 20,
//   },
//   cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
//   cardSub: { fontSize: 13, color: "#f2f2f2", marginTop: 4 },
// });

// app/farmer/dashboard.tsx
// app/farmer/dashboard.tsx
// import React, { useEffect, useRef } from "react";
// import { useRouter } from "expo-router";
// import { LinearGradient } from "expo-linear-gradient";
// import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
// import {
//   Animated,
//   Dimensions,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useLanguage } from "./i18n/LanguageContext";
// import { useRole } from "../context/RoleContext"; // adjust if your path differs

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = Math.min(width * 0.92, 820);
// const ACTION_WIDTH = (width - 64) / 2;

// export default function FarmerDashboard() {
//   const router = useRouter();
//   const { t } = useLanguage();
//   // if RoleContext provides user name, use it; otherwise fallback
//   const { role, user } = useRole ? useRole() : { role: "farmer", user: { name: "Farmer" } };

//   // small entrance animations
//   const fade = useRef(new Animated.Value(0)).current;
//   const slide = useRef(new Animated.Value(18)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true }),
//       Animated.spring(slide, { toValue: 0, friction: 7, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   // Action cards (localized)
//   const actions = [
//     {
//       id: "weather",
//       title: t("weather") || "Weather",
//       subtitle: t("weather_sub") || "Check today's forecast & alerts",
//       icon: <MaterialCommunityIcons name="weather-partly-cloudy" size={30} color="#fff" />,
//       route: "/weather",
//       colors: ["#A7F3D0", "#4CAF50"],
//     },
//     {
//       id: "assistant",
//       title: t("smartAssistant") || "Smart Assistant",
//       subtitle: t("assistant_sub") || "AI insights for crops & diseases",
//       icon: <FontAwesome5 name="robot" size={28} color="#fff" />,
//       route: "/smart-assistant",
//       colors: ["#BBDEFB", "#2196F3"],
//     },
//     {
//       id: "crops",
//       title: t("cropManagement") || "Crop Management",
//       subtitle: t("crops_sub") || "Add & track your crops",
//       icon: <MaterialCommunityIcons name="sprout" size={30} color="#fff" />,
//       route: "/farmer/crops",
//       colors: ["#FFF9C4", "#FBC02D"],
//     },
//     {
//       id: "market",
//       title: t("marketplace") || "Marketplace",
//       subtitle: t("market_sub") || "Sell directly to buyers",
//       icon: <FontAwesome5 name="store" size={28} color="#fff" />,
//       route: "/farmer/marketplace",
//       colors: ["#FFCCBC", "#FF7043"],
//     },
//     {
//       id: "categories",
//       title: t("categories") || "Categories",
//       subtitle: t("categories_sub") || "Browse crop categories",
//       icon: <MaterialCommunityIcons name="grid" size={28} color="#fff" />,
//       route: "/categories",
//       colors: ["#FDE68A", "#FBBF24"],
//     },
//   ];

//   // small demo stats (replace with real data later)
//   const stats = [
//     { id: "s1", label: t("activeCrops") || "Active Crops", value: "8" },
//     { id: "s2", label: t("pendingOrders") || "Pending Orders", value: "2" },
//     { id: "s3", label: t("todayYield") || "Today's Yield (kg)", value: "120" },
//   ];

//   return (
//     <LinearGradient colors={["#E8F5E9", "#FFFFFF"]} style={styles.wrapper}>
//       <Animated.View style={[styles.header, { opacity: fade, transform: [{ translateY: slide }] }]}>
//         <View>
//           <Text style={styles.greeting}>
//             {t("hello") ? `${t("hello")}, ${user?.name ?? "Farmer"}` : `👋 Hello, ${user?.name ?? "Farmer"}`}
//           </Text>
//           <Text style={styles.sub}>{t("dashboardSub") || "Your Smart Farming Dashboard"}</Text>
//         </View>
//       </Animated.View>

//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
//         {/* Stats row */}
//         <View style={styles.statsRow}>
//           {stats.map((s) => (
//             <View key={s.id} style={styles.statCard}>
//               <Text style={styles.statVal}>{s.value}</Text>
//               <Text style={styles.statLabel}>{s.label}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Actions */}
//         <View style={{ width: "100%", alignItems: "center", marginTop: 16 }}>
//           {actions.map((a) => (
//             <TouchableOpacity
//               key={a.id}
//               activeOpacity={0.92}
//               onPress={() => router.push(a.route)}
//               style={{ marginBottom: 12 }}
//             >
//               <LinearGradient colors={a.colors} style={styles.actionCard}>
//                 <View style={styles.iconWrap}>{a.icon}</View>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.actionTitle}>{a.title}</Text>
//                   <Text style={styles.actionSub}>{a.subtitle}</Text>
//                 </View>
//                 <View style={styles.chevWrap}>
//                   <MaterialCommunityIcons name="chevron-right" size={22} color="#ffffffcc" />
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Quick actions grid */}
//         <View style={styles.quickWrap}>
//           <TouchableOpacity style={styles.quickBtn} onPress={() => router.push("/farmer/crops")}>
//             <MaterialCommunityIcons name="plus-box" size={26} color="#2E7D32" />
//             <Text style={styles.quickText}>{t("addCrop") || "Add Crop"}</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.quickBtn} onPress={() => router.push("/farmer/marketplace")}>
//             <MaterialCommunityIcons name="sale" size={26} color="#2E7D32" />
//             <Text style={styles.quickText}>{t("sellNow") || "Sell Now"}</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </LinearGradient>
//   );
// }

// const styles = {
//   wrapper: {
//     flex: 1,
//     paddingTop: 46,
//   } as any,
//   header: {
//     paddingHorizontal: 18,
//     marginBottom: 6,
//   } as any,
//   greeting: {
//     fontSize: 26,
//     fontWeight: "800",
//     color: "#2E7D32",
//   } as any,
//   sub: {
//     fontSize: 13,
//     color: "#4E6E33",
//     marginTop: 6,
//   } as any,
//   scroll: {
//     alignItems: "center",
//     paddingBottom: 40,
//   } as any,
//   statsRow: {
//     width: CARD_WIDTH,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 6,
//   } as any,
//   statCard: {
//     backgroundColor: "#fff",
//     width: (CARD_WIDTH - 24) / 3,
//     borderRadius: 12,
//     padding: 12,
//     alignItems: "center",
//     elevation: 4,
//   } as any,
//   statVal: { fontSize: 18, fontWeight: "900", color: "#0f5132" } as any,
//   statLabel: { fontSize: 11, color: "#666", marginTop: 6, textAlign: "center" } as any,
//   actionCard: {
//     width: CARD_WIDTH,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 6,
//   } as any,
//   iconWrap: {
//     width: 64,
//     height: 64,
//     borderRadius: 12,
//     backgroundColor: "#ffffff33",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   } as any,
//   actionTitle: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: "#fff",
//   } as any,
//   actionSub: {
//     fontSize: 12,
//     color: "#ffffffdd",
//     marginTop: 6,
//   } as any,
//   chevWrap: { marginLeft: 12 } as any,
//   quickWrap: {
//     width: CARD_WIDTH,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 18,
//   } as any,
//   quickBtn: {
//     width: ACTION_WIDTH,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     alignItems: "center",
//     elevation: 4,
//   } as any,
//   quickText: { marginTop: 8, fontWeight: "800", color: "#2E7D32" } as any,
// } as const;
// app/farmer/dashboard.tsx
// app/farmer/dashboard.tsx
// app/farmer/dashboard.tsx
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLanguage } from "./i18n/LanguageContext"; // ADJUST path if needed
import { useRole } from "../context/RoleContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(width * 0.92, 820);

export default function FarmerDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useRole();

  // animation
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  // MAIN CARDS (no stats)
  const actions = [
    {
      id: "weather",
      title: t("weather") || "Weather",
      subtitle: t("weather_sub") || "Check today's forecast & alerts",
      icon: <MaterialCommunityIcons name="weather-partly-cloudy" size={30} color="#fff" />,
      route: "/weather",
      colors: ["#A7F3D0", "#4CAF50"],
    },
    {
      id: "assistant",
      title: t("smartAssistant") || "Smart Assistant",
      subtitle: t("assistant_sub") || "AI insights for crops & diseases",
      icon: <FontAwesome5 name="robot" size={28} color="#fff" />,
      route: "/smart-assistant",
      colors: ["#BBDEFB", "#2196F3"],
    },
    {
      id: "crops",
      title: t("cropManagement") || "Crop Management",
      subtitle: t("crops_sub") || "Add & track your crops",
      icon: <MaterialCommunityIcons name="sprout" size={30} color="#fff" />,
      route: "/farmer/crops",
      colors: ["#FFF9C4", "#FBC02D"],
    },
    {
      id: "market",
      title: t("marketplace") || "Marketplace",
      subtitle: t("market_sub") || "Sell directly to buyers",
      icon: <FontAwesome5 name="store" size={28} color="#fff" />,
      route: "/farmer/marketplace",
      colors: ["#FFCCBC", "#FF7043"],
    },
    {
      id: "categories",
      title: t("categories") || "Categories",
      subtitle: t("categories_sub") || "Browse crop categories",
      icon: <MaterialCommunityIcons name="grid" size={28} color="#fff" />,
      route: "/categories",
      colors: ["#FDE68A", "#FBBF24"],
    },
  ];

  return (
    <LinearGradient colors={["#E8F5E9", "#FFFFFF"]} style={styles.wrapper}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <Text style={styles.greeting}>
          {t("hello") || "Hello"}, {user?.name || "Farmer"} 👋
        </Text>
        <Text style={styles.sub}>{t("dashboardSub") || "Your Smart Farming Dashboard"}</Text>
      </Animated.View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ACTION CARDS */}
        <View style={{ width: "100%", alignItems: "center" }}>
          {actions.map((a) => (
            <TouchableOpacity
              key={a.id}
              activeOpacity={0.92}
              onPress={() => router.push(a.route)}
              style={{ marginBottom: 12 }}
            >
              <LinearGradient colors={a.colors} style={styles.actionCard}>
                <View style={styles.iconWrap}>{a.icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.actionTitle}>{a.title}</Text>
                  <Text style={styles.actionSub}>{a.subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ffffffcc" />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 46,
  },
  header: {
    paddingHorizontal: 18,
    marginBottom: 6,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2E7D32",
  },
  sub: {
    fontSize: 13,
    color: "#4E6E33",
    marginTop: 6,
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 40,
  },
  actionCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#ffffff33",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#fff",
  },
  actionSub: {
    fontSize: 12,
    color: "#ffffffdd",
    marginTop: 6,
  },
});
