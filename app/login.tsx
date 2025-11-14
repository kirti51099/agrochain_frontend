// // app/login.tsx
// import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useRole } from "../context/RoleContext";

// const { height } = Dimensions.get("window");

// export default function Login() {
//   const router = useRouter();
//   const { role } = useRole(); // role loaded from context (may be null while loading)

//   // Animations
//   const fade = useRef(new Animated.Value(0)).current;
//   const slideUp = useRef(new Animated.Value(24)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
//       Animated.spring(slideUp, { toValue: 0, friction: 7, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [secure, setSecure] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Decide destination route from role (async: may read from AsyncStorage if role not present)
//   const resolveDestination = async (currentRole?: string | null) => {
//     let r = currentRole ?? null;
//     if (!r) {
//       try {
//         const stored = await AsyncStorage.getItem("app_role");
//         if (stored) r = stored;
//       } catch (e) {
//         console.warn("Failed to read role from storage", e);
//       }
//     }

//     // Map role -> route (adjust these if your files live elsewhere)
//     if (r === "farmer") return "/dashboard";
//     if (r === "buyer") return "/buyer"; // your buyer index page
//     if (r === "admin") return "/admin"; // change if you use a different admin route
//     // fallback
//     return "/farmer/dashboard";
//   };

//   const validateAndLogin = async () => {
//     if (!email.trim()) return Alert.alert("Enter email");
//     if (!password) return Alert.alert("Enter password");

//     setLoading(true);
//     try {
//       // simulate network/auth delay (replace with real API call)
//       await new Promise((r) => setTimeout(r, 900));

//       // Debug: log current role from context
//       console.log("Login success, role (from context):", role);

//       Alert.alert("✅ Login Success", `Welcome ${role ? role[0].toUpperCase() + role.slice(1) : "Farmer"}`);

//       // Resolve destination (await in case role not available yet)
//       const destination = await resolveDestination(role);
//       console.log("Routing to:", destination);
//       // use replace so back button won't return to login
//       router.replace(destination);
//     } catch (err: any) {
//       console.error("Login error:", err);
//       Alert.alert("Login failed", err?.message || "Try again");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#fff" }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.header}>
//         <View style={styles.logoRow}>
//           <Image source={require("../assets/images/logo.jpg")} style={styles.smallLogo} resizeMode="contain" />
//           <Text style={styles.appName}>AgroChain</Text>
//         </View>
//         <Text style={styles.welcome}>Welcome {role ? role[0].toUpperCase() + role.slice(1) : "Farmer"} 🌿</Text>
//         <Text style={styles.sub}>Smart Farming & Crop Marketplace Login</Text>
//       </LinearGradient>

//       <ScrollView
//         contentContainerStyle={{
//           flexGrow: 1,
//           justifyContent: "center",
//           paddingTop: 1,
//           paddingBottom: 30,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
//           <View style={styles.inputRow}>
//             <MaterialIcons name="email" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
//             <TextInput
//               placeholder="Email"
//               autoCapitalize="none"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//               style={styles.input}
//               placeholderTextColor="#8aa08a"
//             />
//           </View>

//           <View style={[styles.inputRow, { marginTop: 12 }]}>
//             <MaterialIcons name="lock" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
//             <TextInput
//               placeholder="Password"
//               secureTextEntry={secure}
//               value={password}
//               onChangeText={setPassword}
//               style={styles.input}
//               placeholderTextColor="#8aa08a"
//             />
//             <TouchableOpacity onPress={() => setSecure((s) => !s)} style={styles.eyeBtn}>
//               <MaterialIcons name={secure ? "visibility-off" : "visibility"} size={18} color="#497f49" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.rowBetween}>
//             <TouchableOpacity onPress={() => Alert.alert("Forgot Password", "Feature coming soon!")}>
//               <Text style={styles.forgot}>Forgot password?</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 setEmail("farmer@example.com");
//                 setPassword("Farmer123");
//               }}
//             >
//               <Text style={styles.demoFill}>Demo creds</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={styles.loginBtn}
//             onPress={validateAndLogin}
//             activeOpacity={0.85}
//             disabled={loading}
//           >
//             <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.loginGradient}>
//               <Text style={styles.loginText}>{loading ? "Signing in..." : "Login"}</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <Text style={styles.orText}>or continue with</Text>

//           <View style={styles.socialRow}>
//             <TouchableOpacity style={styles.socialBtn}>
//               <FontAwesome name="google" size={18} color="#DB4437" />
//               <Text style={styles.socialText}>Google</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.socialBtn}>
//               <MaterialIcons name="phone" size={18} color="#0B8043" />
//               <Text style={styles.socialText}>Phone</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.bottomRow}>
//             <Text style={styles.noAcc}>Don’t have an account?</Text>
//             <TouchableOpacity onPress={() => router.push("/register")}>
//               <Text style={styles.signUp}> Sign up</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     paddingTop: Platform.OS === "ios" ? 80 : 60,
//     paddingBottom: 60,
//     alignItems: "center",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   smallLogo: { width: 45, height: 45 },
//   appName: { fontSize: 22, fontWeight: "800", color: "#2E7D32", marginLeft: 8 },
//   welcome: { fontSize: 22, fontWeight: "800", color: "#1B5E20" },
//   sub: { fontSize: 14, color: "#4E6E33", marginTop: 4, textAlign: "center" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginHorizontal: 20,
//     padding: 20,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F6FFF6",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 14 : 10,
//   },
//   input: { flex: 1, fontSize: 16, color: "#163b16" },
//   eyeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//     alignItems: "center",
//   },
//   forgot: { color: "#2E7D32", fontSize: 13 },
//   demoFill: { color: "#7b9f7b", fontSize: 13 },
//   loginBtn: { marginTop: 18, borderRadius: 12, overflow: "hidden" },
//   loginGradient: { paddingVertical: 14, alignItems: "center" },
//   loginText: { color: "#fff", fontWeight: "800", fontSize: 16 },
//   orText: { textAlign: "center", marginTop: 16, color: "#7b9f7b", fontSize: 13 },
//   socialRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
//   socialBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: "#F1FFF6",
//     borderRadius: 10,
//   },
//   socialText: { marginLeft: 6, color: "#2E7D32", fontWeight: "700" },
//   bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 18, alignItems: "center" },
//   noAcc: { color: "#7b9f7b" },
//   signUp: { color: "#2E7D32", fontWeight: "800" },
// });
// app/select-role.tsx


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
// import { useLanguage } from "./i18n/LanguageContext"; // language hook

// const { width } = Dimensions.get("window");
// const CARD_W = Math.min(340, width - 48);

// export default function SelectRole() {
//   const router = useRouter();
//   const { setRole } = useRole(); // must be provided by RoleContext
//   const { t } = useLanguage();

//   const ROLES = [
//     {
//       key: "farmer",
//       title: t("farmer"),
//       color1: "#A7F3D0",
//       color2: "#43A047",
//       subtitle: t("role_farmer_sub") /* Manage fields, view weather & sell crops */,
//       icon: <MaterialCommunityIcons name="tractor" size={36} color="#fff" />,
//     },
//     {
//       key: "buyer",
//       title: t("buyer"),
//       color1: "#BBDEFB",
//       color2: "#0288D1",
//       subtitle: t("role_buyer_sub") /* Browse listings & place orders from farmers */,
//       icon: <FontAwesome5 name="shopping-cart" size={34} color="#fff" />,
//     },
//     {
//       key: "admin",
//       title: t("admin"),
//       color1: "#E1BEE7",
//       color2: "#9C27B0",
//       subtitle: t("role_admin_sub") /* Monitor platform, users and system reports */,
//       icon: <MaterialCommunityIcons name="shield-account" size={36} color="#fff" />,
//     },
//   ];

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
//       AccessibilityInfo.announceForAccessibility(`${title} ${t("selected")}`);
//       console.log("[SelectRole] saved role:", key);

//       // route to login
//       router.replace("/login");
//     } catch (err) {
//       console.warn("[SelectRole] setRole failed:", err);
//       Alert.alert(t("error"), t("role_save_failed"));
//     } finally {
//       setSavingIndex(null);
//     }
//   };

//   return (
//     <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.container}>
//       <Text style={styles.headerTitle}>🌾 {t("welcome_to")} {t("appName")}</Text>
//       <Text style={styles.headerSubtitle}>{t("select_your_role")}</Text>

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
//                 accessibilityLabel={`${t("select")} ${r.title}`}
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


// app/login.tsx
// import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useRole } from "../context/RoleContext";
// import { useLanguage } from "./i18n/LanguageContext"; // language hook

// const { height } = Dimensions.get("window");

// export default function Login() {
//   const router = useRouter();
//   const { role } = useRole(); // role loaded from context (may be null while loading)
//   const { t } = useLanguage();

//   // Animations
//   const fade = useRef(new Animated.Value(0)).current;
//   const slideUp = useRef(new Animated.Value(24)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
//       Animated.spring(slideUp, { toValue: 0, friction: 7, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [secure, setSecure] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Decide destination route from role (async: may read from AsyncStorage if role not present)
//   const resolveDestination = async (currentRole?: string | null) => {
//     let r = currentRole ?? null;
//     if (!r) {
//       try {
//         const stored = await AsyncStorage.getItem("app_role");
//         if (stored) r = stored;
//       } catch (e) {
//         console.warn("Failed to read role from storage", e);
//       }
//     }

//     // Map role -> route (adjust these if your files live elsewhere)
//     if (r === "farmer") return "/farmer/dashboard";
//     if (r === "buyer") return "/buyer/index";
//     if (r === "admin") return "/admin/dashboard";
//     // fallback
//     return "/farmer/dashboard";
//   };

//   const validateAndLogin = async () => {
//     if (!email.trim()) return Alert.alert(t("enter_email") || "Enter email");
//     if (!password) return Alert.alert(t("enter_password") || "Enter password");

//     setLoading(true);
//     try {
//       // simulate network/auth delay (replace with real API call)
//       await new Promise((r) => setTimeout(r, 900));

//       // Debug: log current role from context
//       console.log("Login success, role (from context):", role);

//       Alert.alert("✅ " + t("login_success") || "Login Success", `${t("welcome") || "Welcome"} ${role ? role[0].toUpperCase() + role.slice(1) : t("farmer")}`);

//       // Resolve destination (await in case role not available yet)
//       const destination = await resolveDestination(role);
//       console.log("Routing to:", destination);
//       // use replace so back button won't return to login
//       router.replace(destination);
//     } catch (err: any) {
//       console.error("Login error:", err);
//       Alert.alert(t("login_failed") || "Login failed", err?.message || t("try_again") || "Try again");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1, backgroundColor: "#fff" }}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.header}>
//         <View style={styles.logoRow}>
//           <Image source={require("../assets/images/logo.jpg")} style={styles.smallLogo} resizeMode="contain" />
//           <Text style={styles.appName}>{t("appName")}</Text>
//         </View>
//         <Text style={styles.welcome}>{t("welcome")} {role ? role[0].toUpperCase() + role.slice(1) : t("farmer")} 🌿</Text>
//         <Text style={styles.sub}>{t("login_sub") || "Smart Farming & Crop Marketplace Login"}</Text>
//       </LinearGradient>

//       <ScrollView
//         contentContainerStyle={{
//           flexGrow: 1,
//           justifyContent: "center",
//           paddingTop: 1,
//           paddingBottom: 30,
//         }}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
//           <View style={styles.inputRow}>
//             <MaterialIcons name="email" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
//             <TextInput
//               placeholder={t("email")}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//               style={styles.input}
//               placeholderTextColor="#8aa08a"
//             />
//           </View>

//           <View style={[styles.inputRow, { marginTop: 12 }]}>
//             <MaterialIcons name="lock" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
//             <TextInput
//               placeholder={t("password")}
//               secureTextEntry={secure}
//               value={password}
//               onChangeText={setPassword}
//               style={styles.input}
//               placeholderTextColor="#8aa08a"
//             />
//             <TouchableOpacity onPress={() => setSecure((s) => !s)} style={styles.eyeBtn}>
//               <MaterialIcons name={secure ? "visibility-off" : "visibility"} size={18} color="#497f49" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.rowBetween}>
//             <TouchableOpacity onPress={() => Alert.alert(t("forgot_password") || "Forgot Password", t("feature_coming") || "Feature coming soon!")}>
//               <Text style={styles.forgot}>{t("forgot_password")}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 setEmail("farmer@example.com");
//                 setPassword("Farmer123");
//               }}
//             >
//               <Text style={styles.demoFill}>{t("demo_creds") || "Demo creds"}</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={styles.loginBtn}
//             onPress={validateAndLogin}
//             activeOpacity={0.85}
//             disabled={loading}
//           >
//             <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.loginGradient}>
//               <Text style={styles.loginText}>{loading ? t("signing_in") || "Signing in..." : t("login")}</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <Text style={styles.orText}>{t("or_continue_with") || "or continue with"}</Text>

//           <View style={styles.socialRow}>
//             <TouchableOpacity style={styles.socialBtn}>
//               <FontAwesome name="google" size={18} color="#DB4437" />
//               <Text style={styles.socialText}>Google</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.socialBtn}>
//               <MaterialIcons name="phone" size={18} color="#0B8043" />
//               <Text style={styles.socialText}>{t("phone") || "Phone"}</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.bottomRow}>
//             <Text style={styles.noAcc}>{t("no_account") || "Don’t have an account?"}</Text>
//             <TouchableOpacity onPress={() => router.push("/register")}>
//               <Text style={styles.signUp}> {t("register")}</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     paddingTop: Platform.OS === "ios" ? 80 : 60,
//     paddingBottom: 60,
//     alignItems: "center",
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   smallLogo: { width: 45, height: 45 },
//   appName: { fontSize: 22, fontWeight: "800", color: "#2E7D32", marginLeft: 8 },
//   welcome: { fontSize: 22, fontWeight: "800", color: "#1B5E20" },
//   sub: { fontSize: 14, color: "#4E6E33", marginTop: 4, textAlign: "center" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     marginHorizontal: 20,
//     padding: 20,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 4 },
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F6FFF6",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === "ios" ? 14 : 10,
//   },
//   input: { flex: 1, fontSize: 16, color: "#163b16" },
//   eyeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//     alignItems: "center",
//   },
//   forgot: { color: "#2E7D32", fontSize: 13 },
//   demoFill: { color: "#7b9f7b", fontSize: 13 },
//   loginBtn: { marginTop: 18, borderRadius: 12, overflow: "hidden" },
//   loginGradient: { paddingVertical: 14, alignItems: "center" },
//   loginText: { color: "#fff", fontWeight: "800", fontSize: 16 },
//   orText: { textAlign: "center", marginTop: 16, color: "#7b9f7b", fontSize: 13 },
//   socialRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
//   socialBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     backgroundColor: "#F1FFF6",
//     borderRadius: 10,
//   },
//   socialText: { marginLeft: 6, color: "#2E7D32", fontWeight: "700" },
//   bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 18, alignItems: "center" },
//   noAcc: { color: "#7b9f7b" },
//   signUp: { color: "#2E7D32", fontWeight: "800" },
// });
// app/login.tsx
// app/login.tsx
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRole } from "../context/RoleContext";
import { useLanguage } from "./i18n/LanguageContext"; // correct relative path

export default function Login() {
  const router = useRouter();
  const { role } = useRole ? useRole() : { role: null };
  const { t } = useLanguage();

  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const resolveDestination = async (currentRole?: string | null) => {
    let r = currentRole ?? null;
    if (!r) {
      try {
        const stored = await AsyncStorage.getItem("app_role");
        if (stored) r = stored;
      } catch (e) {
        console.warn("Failed to read role from storage", e);
      }
    }
    if (r === "farmer") return "/dashboard";
    if (r === "buyer") return "/buyer/index";
    if (r === "admin") return "/admin/dashboard";
    return "/farmer/dashboard";
  };

  const validateAndLogin = async () => {
    if (!email.trim()) return Alert.alert(t("enter_email") || "Enter email");
    if (!password) return Alert.alert(t("enter_password") || "Enter password");

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      Alert.alert("✅", `${t("welcome")} ${role ? role[0].toUpperCase() + role.slice(1) : t("farmer")}`);
      const destination = await resolveDestination(role);
      router.replace(destination);
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert(t("login_failed") || "Login failed", err?.message || t("try_again") || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.header}>
        <View style={styles.logoRow}>
          <Image source={require("../assets/images/logo.jpg")} style={styles.smallLogo} resizeMode="contain" />
          <Text style={styles.appName}>{t("appName")}</Text>
        </View>
        <Text style={styles.welcome}>{t("welcome")} {role ? role[0].toUpperCase() + role.slice(1) : t("farmer")} 🌿</Text>
        <Text style={styles.sub}>{t("login_sub") || "Smart Farming & Crop Marketplace Login"}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingTop: 1, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
          <View style={styles.inputRow}>
            <MaterialIcons name="email" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
            <TextInput placeholder={t("email")} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#8aa08a" />
          </View>

          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <MaterialIcons name="lock" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
            <TextInput placeholder={t("password")} secureTextEntry={secure} value={password} onChangeText={setPassword} style={styles.input} placeholderTextColor="#8aa08a" />
            <TouchableOpacity onPress={() => setSecure((s) => !s)} style={styles.eyeBtn}>
              <MaterialIcons name={secure ? "visibility-off" : "visibility"} size={18} color="#497f49" />
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity onPress={() => Alert.alert(t("forgot_password") || "Forgot Password", t("feature_coming") || "Feature coming soon!")}>
              <Text style={styles.forgot}>{t("forgot_password")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setEmail("farmer@example.com"); setPassword("Farmer123"); }}>
              <Text style={styles.demoFill}>{t("demo_creds") || "Demo creds"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={validateAndLogin} activeOpacity={0.85} disabled={loading}>
            <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.loginGradient}>
              <Text style={styles.loginText}>{loading ? t("signing_in") || "Signing in..." : t("login")}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.orText}>{t("or_continue_with") || "or continue with"}</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}><FontAwesome name="google" size={18} color="#DB4437" /><Text style={styles.socialText}>Google</Text></TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}><MaterialIcons name="phone" size={18} color="#0B8043" /><Text style={styles.socialText}>{t("phone") || "Phone"}</Text></TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.noAcc}>{t("no_account") || "Don’t have an account?"}</Text>
            <TouchableOpacity onPress={() => router.push("/register")}><Text style={styles.signUp}> {t("register")}</Text></TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: Platform.OS === "ios" ? 80 : 60, paddingBottom: 60, alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  smallLogo: { width: 45, height: 45 },
  appName: { fontSize: 22, fontWeight: "800", color: "#2E7D32", marginLeft: 8 },
  welcome: { fontSize: 22, fontWeight: "800", color: "#1B5E20" },
  sub: { fontSize: 14, color: "#4E6E33", marginTop: 4, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 20, padding: 20, elevation: 8, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F6FFF6", borderRadius: 12, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 14 : 10 },
  input: { flex: 1, fontSize: 16, color: "#163b16" },
  eyeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: "center" },
  forgot: { color: "#2E7D32", fontSize: 13 },
  demoFill: { color: "#7b9f7b", fontSize: 13 },
  loginBtn: { marginTop: 18, borderRadius: 12, overflow: "hidden" },
  loginGradient: { paddingVertical: 14, alignItems: "center" },
  loginText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  orText: { textAlign: "center", marginTop: 16, color: "#7b9f7b", fontSize: 13 },
  socialRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  socialBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#F1FFF6", borderRadius: 10 },
  socialText: { marginLeft: 6, color: "#2E7D32", fontWeight: "700" },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 18, alignItems: "center" },
  noAcc: { color: "#7b9f7b" },
  signUp: { color: "#2E7D32", fontWeight: "800" },
});
