// // app/select-role.tsx
// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   Pressable,
//   Animated,
//   Alert,
//   AccessibilityInfo,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { useRole } from "../context/RoleContext";
// import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// const { width } = Dimensions.get("window");
// const CARD_W = Math.min(340, width - 48);

// const ROLES = [
//   {
//     key: "farmer",
//     title: "Farmer",
//     color1: "#A7F3D0",
//     color2: "#43A047",
//     subtitle: "Manage fields, view weather & sell crops",
//     icon: <MaterialCommunityIcons name="tractor" size={36} color="#fff" />,
//   },
//   {
//     key: "buyer",
//     title: "Buyer",
//     color1: "#BBDEFB",
//     color2: "#0288D1",
//     subtitle: "Browse listings & place orders from farmers",
//     icon: <FontAwesome5 name="shopping-cart" size={34} color="#fff" />,
//   },
//   {
//     key: "admin",
//     title: "Admin",
//     color1: "#E1BEE7",
//     color2: "#9C27B0",
//     subtitle: "Monitor platform, users and system reports",
//     icon: <MaterialCommunityIcons name="shield-account" size={36} color="#fff" />,
//   },
// ];

// export default function SelectRole() {
//   const router = useRouter();
//   const { setRole } = useRole(); // must be provided by RoleContext
//   const animVals = useRef(ROLES.map(() => new Animated.Value(1))).current;
//   const [savingIndex, setSavingIndex] = useState<number | null>(null); // prevent double taps

//   const onPressIn = (i: number) => {
//     Animated.spring(animVals[i], { toValue: 0.96, useNativeDriver: true }).start();
//   };

//   const onPressOut = (i: number) => {
//     Animated.spring(animVals[i], { toValue: 1, useNativeDriver: true }).start();
//   };

//   // improved chooseRole: await setRole, handle errors, log, route
//   const chooseRole = async (key: string, title: string, i: number) => {
//     if (savingIndex !== null) return; // already saving
//     setSavingIndex(i);

//     // little press animation
//     Animated.sequence([
//       Animated.timing(animVals[i], { toValue: 1.06, duration: 120, useNativeDriver: true }),
//       Animated.timing(animVals[i], { toValue: 1, duration: 120, useNativeDriver: true }),
//     ]).start();

//     try {
//       // make sure setRole returns a Promise and awaits persistence
//       await setRole(key as "farmer" | "buyer" | "admin");
//       AccessibilityInfo.announceForAccessibility(`${title} selected`);
//       console.log("[SelectRole] saved role:", key);

//       // route to login immediately (no setTimeout), router.replace ensures no back button to role page
//       router.replace("/login");
//     } catch (err) {
//       console.warn("[SelectRole] setRole failed:", err);
//       Alert.alert("Error", "Could not save role. Try again.");
//     } finally {
//       setSavingIndex(null);
//     }
//   };

//   return (
//     <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.container}>
//       <Text style={styles.headerTitle}>🌾 Welcome to AgroChain</Text>
//       <Text style={styles.headerSubtitle}>Select your role to get started</Text>

//       <View style={styles.centerWrapper}>
//         {ROLES.map((r, i) => {
//           const scale = animVals[i];
//           return (
//             <Animated.View key={r.key} style={[styles.cardWrap, { transform: [{ scale }] }]}>
//               <Pressable
//                 onPressIn={() => onPressIn(i)}
//                 onPressOut={() => onPressOut(i)}
//                 onPress={() => chooseRole(r.key, r.title, i)}
//                 android_ripple={{ color: "#ffffff22" }}
//                 style={styles.card}
//                 accessibilityLabel={`Select ${r.title}`}
//                 accessible
//               >
//                 <LinearGradient
//                   colors={[r.color1, r.color2]}
//                   start={[0, 0]}
//                   end={[1, 1]}
//                   style={styles.iconCircle}
//                 >
//                   {r.icon}
//                 </LinearGradient>

//                 <Text style={styles.cardTitle}>{r.title}</Text>
//                 <Text style={styles.cardSubtitle}>{r.subtitle}</Text>
//               </Pressable>
//             </Animated.View>
//           );
//         })}
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
//   headerTitle: { fontSize: 24, fontWeight: "800", color: "#1B5E20", marginBottom: 6 },
//   headerSubtitle: { fontSize: 14, color: "#4E8A4C", marginBottom: 30 },
//   centerWrapper: { alignItems: "center", justifyContent: "center", gap: 18 },
//   cardWrap: { width: CARD_W, borderRadius: 16, elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
//   card: { alignItems: "center", backgroundColor: "#fff", borderRadius: 16, paddingVertical: 20, paddingHorizontal: 10 },
//   iconCircle: { width: 80, height: 80, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 12, elevation: 4 },
//   cardTitle: { fontSize: 18, fontWeight: "700", color: "#0F5132" },
//   cardSubtitle: { fontSize: 13, color: "#5C705E", textAlign: "center", marginTop: 4, width: 230 },
// });
// app/select-role.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  Alert,
  AccessibilityInfo,
} from "react-native";
import { useRouter } from "expo-router";
import { useRole } from "../context/RoleContext";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "./i18n/LanguageContext"; // <- translation hook

const { width } = Dimensions.get("window");
const CARD_W = Math.min(340, width - 48);

export default function SelectRole() {
  const router = useRouter();
  const { setRole } = useRole(); // must be provided by RoleContext
  const { t } = useLanguage(); // translation function
  const animVals = useRef([new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)]).current;
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const onPressIn = (i: number) => {
    Animated.spring(animVals[i], { toValue: 0.96, useNativeDriver: true }).start();
  };

  const onPressOut = (i: number) => {
    Animated.spring(animVals[i], { toValue: 1, useNativeDriver: true }).start();
  };

  // localized role definitions
  const ROLES = [
    {
      key: "farmer",
      title: t("farmer"),
      color1: "#A7F3D0",
      color2: "#43A047",
      subtitle: t("cropmgmt_sub") || "Manage fields, view weather & sell crops",
      icon: <MaterialCommunityIcons name="tractor" size={36} color="#fff" />,
    },
    {
      key: "buyer",
      title: t("buyer"),
      color1: "#BBDEFB",
      color2: "#0288D1",
      subtitle: t("market_sub") || "Browse listings & place orders from farmers",
      icon: <FontAwesome5 name="shopping-cart" size={34} color="#fff" />,
    },
    {
      key: "admin",
      title: t("admin"),
      color1: "#E1BEE7",
      color2: "#9C27B0",
      subtitle: t("admin_sub") || "Monitor platform, users and system reports",
      icon: <MaterialCommunityIcons name="shield-account" size={36} color="#fff" />,
    },
  ];

  const chooseRole = async (key: string, title: string, i: number) => {
    if (savingIndex !== null) return;
    setSavingIndex(i);

    Animated.sequence([
      Animated.timing(animVals[i], { toValue: 1.06, duration: 120, useNativeDriver: true }),
      Animated.timing(animVals[i], { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();

    try {
      await setRole?.(key as "farmer" | "buyer" | "admin");
      AccessibilityInfo.announceForAccessibility(`${title} ${t("selected") || "selected"}`);
      router.replace("/login");
    } catch (err) {
      console.warn("SelectRole error:", err);
      Alert.alert(t("error") || "Error", t("save_role_failed") || "Could not save role. Try again.");
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.container}>
      <Text style={styles.headerTitle}>{t("welcome")}, {t("appName")}</Text>
      <Text style={styles.headerSubtitle}>{t("selectRole") || "Select your role to get started"}</Text>

      <View style={styles.centerWrapper}>
        {ROLES.map((r, i) => {
          const scale = animVals[i];
          return (
            <Animated.View key={r.key} style={[styles.cardWrap, { transform: [{ scale }] }]}>
              <Pressable
                onPressIn={() => onPressIn(i)}
                onPressOut={() => onPressOut(i)}
                onPress={() => chooseRole(r.key, r.title, i)}
                android_ripple={{ color: "#ffffff22" }}
                style={styles.card}
                accessibilityLabel={`${r.title}. ${r.subtitle}`}
                accessible
              >
                <LinearGradient colors={[r.color1, r.color2]} start={[0,0]} end={[1,1]} style={styles.iconCircle}>
                  {r.icon}
                </LinearGradient>

                <Text style={styles.cardTitle}>{r.title}</Text>
                <Text style={styles.cardSubtitle}>{r.subtitle}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#1B5E20", marginBottom: 6 },
  headerSubtitle: { fontSize: 14, color: "#4E8A4C", marginBottom: 30, textAlign: "center", paddingHorizontal: 12 },
  centerWrapper: { alignItems: "center", justifyContent: "center", gap: 18 },
  cardWrap: { width: CARD_W, borderRadius: 16, elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  card: { alignItems: "center", backgroundColor: "#fff", borderRadius: 16, paddingVertical: 20, paddingHorizontal: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 12, elevation: 4 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#0F5132" },
  cardSubtitle: { fontSize: 13, color: "#5C705E", textAlign: "center", marginTop: 4, width: 230 },
});
