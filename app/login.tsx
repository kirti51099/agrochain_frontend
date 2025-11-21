
// import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Alert,
//   Animated,
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
// import { useLanguage } from "./i18n/LanguageContext"; // correct relative path

// type RoleKey = "farmer" | "buyer" | "admin";

// const ROLE_STORAGE_KEYS = ["app_role", "agro_role_v1"];

// type OfflineUser = {
//   role: RoleKey;
//   email: string;
//   password: string;
//   name: string;
//   emoji: string;
//   gradient: [string, string];
// };

// const OFFLINE_USERS: OfflineUser[] = [
//   {
//     role: "farmer",
//     email: "farmer@test.com",
//     password: "Farmer123",
//     name: "Demo Farmer",
//     emoji: "🌾",
//     gradient: ["#C8E6C9", "#43A047"],
//   },
//   {
//     role: "buyer",
//     email: "buyer@test.com",
//     password: "Buyer123",
//     name: "Demo Buyer",
//     emoji: "🛒",
//     gradient: ["#BBDEFB", "#1E88E5"],
//   },
//   {
//     role: "admin",
//     email: "admin@test.com",
//     password: "Admin123",
//     name: "Demo Admin",
//     emoji: "🛡️",
//     gradient: ["#E1BEE7", "#8E24AA"],
//   },
// ];

// const normalizeRole = (role?: string | null): RoleKey | null => {
//   if (!role) return null;
//   const lower = role.toLowerCase();
//   if (lower === "farmer" || lower === "buyer" || lower === "admin") return lower;
//   return null;
// };

// const persistRole = async (value: RoleKey) => {
//   await Promise.all(
//     ROLE_STORAGE_KEYS.map(async (key) => {
//       try {
//         await AsyncStorage.setItem(key, value);
//       } catch (err) {
//         console.warn("Failed to persist role to", key, err);
//       }
//     }),
//   );
// };

// const readStoredRole = async () => {
//   for (const key of ROLE_STORAGE_KEYS) {
//     try {
//       const stored = await AsyncStorage.getItem(key);
//       const normalized = normalizeRole(stored);
//       if (normalized) return normalized;
//     } catch (err) {
//       console.warn("Failed to read role from", key, err);
//     }
//   }
//   return null;
// };

// export default function Login() {
//   const router = useRouter();
//   const roleContext = useRole ? useRole() : { role: null, setRole: null, setUser: null };
//   const { role, setRole, setUser } = roleContext;
//   const { t, language } = useLanguage();

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

//   const getDemoName = (r: RoleKey) => {
//     if (r === "farmer") return t("demo_farmer") || "Demo Farmer";
//     if (r === "buyer") return t("demo_buyer") || "Demo Buyer";
//     return t("demo_admin") || "Demo Admin";
//   };

//   const getDemoSubtitle = (r: RoleKey) => {
//     if (r === "farmer") return t("continue_as_farmer") || "Continue as Farmer";
//     if (r === "buyer") return t("continue_as_buyer") || "Continue as Buyer";
//     return t("continue_as_admin") || "Continue as Admin";
//   };

//   const resolveDestination = async (currentRole?: string | null) => {
//     let resolved = normalizeRole(currentRole);
//     if (!resolved) {
//       resolved = await readStoredRole();
//     }
//     if (!resolved) {
//       resolved = "farmer";
//     }

//     if (resolved === "farmer") return "/dashboard";
//     if (resolved === "buyer") return "/buyer";
//     if (resolved === "admin") return "/admin/dashboard";
//     return "/dashboard"; // Default to farmer dashboard
//   };

//   const completeLogin = async ({
//     role: resolvedRole,
//     name,
//     email: resolvedEmail,
//     token,
//     offline,
//     notice,
//   }: {
//     role: RoleKey | null;
//     name?: string;
//     email?: string;
//     token?: string;
//     offline?: boolean;
//     notice?: string;
//   }) => {
//     if (!resolvedRole) throw new Error("Role missing from login response");

//     if (token) {
//       await AsyncStorage.setItem("auth_token", token);
//     }

//     await persistRole(resolvedRole);
//     if (setRole) {
//       await setRole(resolvedRole);
//     }

//     if (resolvedEmail) {
//       await AsyncStorage.setItem("user_email", resolvedEmail);
//     }
//     if (name) {
//       await AsyncStorage.setItem("user_name", name);
//     }

//     if (setUser) {
//       await setUser({
//         name,
//         email: resolvedEmail,
//         role: resolvedRole,
//       });
//     }

//     const prettyRole = resolvedRole.charAt(0).toUpperCase() + resolvedRole.slice(1);
//     const messageParts = [`${t("welcome") || "Welcome"} ${name || prettyRole}`];
//     if (offline) {
//       messageParts.push(t("offline_login_notice") || "Demo data will be shown until the backend is online.");
//     }
//     if (notice) {
//       messageParts.push(notice);
//     }

//     Alert.alert("✅ " + (t("login_success") || "Login Success"), messageParts.join("\n\n"));
//     const destination = await resolveDestination(resolvedRole);
//     router.replace(destination);
//   };

//   const loginOffline = async (user: OfflineUser, options?: { notice?: string }) => {
//     await completeLogin({
//       role: user.role,
//       name: user.name,
//       email: user.email,
//       token: `offline-${user.role}`,
//       offline: true,
//       notice: options?.notice,
//     });
//   };

//   const handleQuickLogin = async (user: OfflineUser) => {
//     try {
//       setLoading(true);
//       setEmail(user.email);
//       setPassword(user.password);
//       await loginOffline(user, {
//         notice: t("offline_mode") || "Offline mode enabled for preview.",
//       });
//     } catch (error) {
//       console.error("Quick login failed:", error);
//       Alert.alert(t("error") || "Error", t("try_again") || "Try again");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateAndLogin = async () => {
//     if (!email.trim()) return Alert.alert(t("enter_email") || "Enter email");
//     if (!password) return Alert.alert(t("enter_password") || "Enter password");

//     setLoading(true);
//     try {
//       const { BACKEND_BASE } = await import("../constants/backend");
//       const res = await fetch(`${BACKEND_BASE}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: email.trim(), password }),
//       });

//       const text = await res.text();
//       let data: any = {};
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         console.error("Failed to parse response:", text);
//         throw new Error(`Server returned invalid response (${res.status})`);
//       }

//       if (!res.ok) {
//         const errorMsg = data.message || data.error || `Login failed (${res.status})`;
//         console.error("Login error response:", data);
        
//         // Provide helpful error messages
//         if (res.status === 401 || res.status === 404) {
//           throw new Error(
//             language === "mr" 
//               ? "अवैध ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा."
//               : "Invalid email or password. Please check your credentials and try again."
//           );
//         }
//         throw new Error(errorMsg);
//       }

//       let userRole = normalizeRole(data.user?.role) || normalizeRole(role);
//       if (!userRole) {
//         const storedRole = await readStoredRole();
//         userRole = storedRole ?? "farmer";
//         if (!storedRole) {
//           console.warn("[Login] Backend did not return role. Defaulting to farmer.");
//         }
//       }
      
//       // Store auth token if provided
//       if (data.token) {
//         await AsyncStorage.setItem("auth_token", String(data.token));
//       }

//       await persistRole(userRole);
//       await setRole?.(userRole);

//       if (data.user?.name) {
//         await AsyncStorage.setItem("user_name", String(data.user.name));
//       }
//       if (data.user?.email) {
//         await AsyncStorage.setItem("user_email", String(data.user.email));
//       } else {
//         await AsyncStorage.setItem("user_email", email.trim());
//       }
      
//       // Update user in context
//       if (setUser) {
//         if (data.user) {
//           await setUser({
//             name: data.user.name,
//             email: data.user.email || email.trim(),
//             role: userRole,
//           });
//         } else {
//           await setUser({
//             email: email.trim(),
//             role: userRole,
//           });
//         }
//       }

//       await completeLogin({
//         role: userRole,
//         name: data.user?.name,
//         email: data.user?.email || email.trim(),
//         token: data.token,
//       });
//       return;
//     } catch (err: any) {
//       console.error("Login error:", err);

//       const networkIssue =
//         err?.message?.includes("Network request failed") || err?.message?.includes("Failed to fetch");

//       if (networkIssue) {
//         try {
//           const preferredRole =
//             normalizeRole(role) || (await readStoredRole()) || ("farmer" as RoleKey);
//           const fallbackUser =
//             OFFLINE_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ||
//             OFFLINE_USERS.find((u) => u.role === preferredRole) ||
//             OFFLINE_USERS[0];

//           await loginOffline(fallbackUser, {
//             notice:
//               (t("login_network_issue") || "Unable to reach the server right now.") +
//               "\n\n" +
//               (t("try_demo_login") || "You are viewing the offline demo."),
//           });
//           return;
//         } catch (offlineError) {
//           console.error("Offline fallback failed:", offlineError);
//         }
//       }

//       const errorMessage = err?.message || t("try_again") || "Try again";
//       Alert.alert(
//         t("login_failed") || "Login failed", 
//         errorMessage + (language === "mr" 
//           ? "\n\nटीप: जर तुम्ही नवीन आहात, तर प्रथम नोंदणी करा."
//           : "\n\nNote: If you're new, please register first.")
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#fff" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
//       <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.header}>
//         <View style={styles.logoRow}>
//           <Image source={require("../assets/images/logo.jpg")} style={styles.smallLogo} resizeMode="contain" />
//           <Text style={styles.appName}>{t("appName")}</Text>
//         </View>
//         <Text style={styles.welcome}>{t("welcome")} {role ? role[0].toUpperCase() + role.slice(1) : t("farmer")} 🌿</Text>
//         <Text style={styles.sub}>{t("login_sub") || "Smart Farming & Crop Marketplace Login"}</Text>
//       </LinearGradient>

//       <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingTop: 1, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
//         <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slideUp }] }]}>
//           <View style={styles.inputRow}>
//             <MaterialIcons name="email" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
//             <TextInput placeholder={t("email")} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#8aa08a" />
//           </View>

//           <View style={[styles.inputRow, { marginTop: 12 }]}>
//             <MaterialIcons name="lock" size={20} color="#3e7a3e" style={{ marginRight: 8 }} />
//             <TextInput placeholder={t("password")} secureTextEntry={secure} value={password} onChangeText={setPassword} style={styles.input} placeholderTextColor="#8aa08a" />
//             <TouchableOpacity onPress={() => setSecure((s) => !s)} style={styles.eyeBtn}>
//               <MaterialIcons name={secure ? "visibility-off" : "visibility"} size={18} color="#497f49" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.rowBetween}>
//             <TouchableOpacity onPress={() => Alert.alert(t("forgot_password") || "Forgot Password", t("feature_coming") || "Feature coming soon!")}>
//               <Text style={styles.forgot}>{t("forgot_password")}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => { setEmail("farmer@test.com"); setPassword("Farmer123"); }}>
//               <Text style={styles.demoFill}>{t("demo_creds") || "Demo creds"}</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity style={styles.loginBtn} onPress={validateAndLogin} activeOpacity={0.85} disabled={loading}>
//             <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.loginGradient}>
//               <Text style={styles.loginText}>{loading ? t("signing_in") || "Signing in..." : t("login")}</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <Text style={styles.orText}>{t("or_continue_with") || "or continue with"}</Text>

//           <View style={styles.socialRow}>
//             <TouchableOpacity style={styles.socialBtn}><FontAwesome name="google" size={18} color="#DB4437" /><Text style={styles.socialText}>Google</Text></TouchableOpacity>
//             <TouchableOpacity style={styles.socialBtn}><MaterialIcons name="phone" size={18} color="#0B8043" /><Text style={styles.socialText}>{t("phone") || "Phone"}</Text></TouchableOpacity>
//           </View>

//           <View style={styles.bottomRow}>
//             <Text style={styles.noAcc}>{t("no_account") || "Don’t have an account?"}</Text>
//             <TouchableOpacity onPress={() => router.push("/register")}><Text style={styles.signUp}> {t("register")}</Text></TouchableOpacity>
//           </View>

//           <View style={styles.quickSection}>
//             <Text style={styles.quickTitle}>{t("quick_role_login") || "Quick role login"}</Text>
//             <Text style={styles.quickSubtitle}>{t("quick_role_login_sub") || "Use demo access if the backend is offline."}</Text>
//             {OFFLINE_USERS.map((demo) => (
//               <TouchableOpacity
//                 key={demo.role}
//                 style={styles.quickCard}
//                 onPress={() => handleQuickLogin(demo)}
//                 disabled={loading}
//                 activeOpacity={0.85}
//               >
//                 <LinearGradient colors={demo.gradient} style={styles.quickGradient}>
//                   <Text style={styles.quickEmoji}>{demo.emoji}</Text>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.quickName}>{getDemoName(demo.role)}</Text>
//                     <Text style={styles.quickDesc}>{getDemoSubtitle(demo.role)}</Text>
//                   </View>
//                   <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
//                 </LinearGradient>
//               </TouchableOpacity>
//             ))}
//             <Text style={styles.quickHint}>
//               {t("offline_hint") || "These shortcuts log you in with demo data when the server is unreachable."}
//             </Text>
//           </View>
//         </Animated.View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   header: { paddingTop: Platform.OS === "ios" ? 80 : 60, paddingBottom: 60, alignItems: "center", borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
//   logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   smallLogo: { width: 45, height: 45 },
//   appName: { fontSize: 22, fontWeight: "800", color: "#2E7D32", marginLeft: 8 },
//   welcome: { fontSize: 22, fontWeight: "800", color: "#1B5E20" },
//   sub: { fontSize: 14, color: "#4E6E33", marginTop: 4, textAlign: "center" },
//   card: { backgroundColor: "#fff", borderRadius: 18, marginHorizontal: 20, padding: 20, elevation: 8, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
//   inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F6FFF6", borderRadius: 12, paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 14 : 10 },
//   input: { flex: 1, fontSize: 16, color: "#163b16" },
//   eyeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
//   rowBetween: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: "center" },
//   forgot: { color: "#2E7D32", fontSize: 13 },
//   demoFill: { color: "#7b9f7b", fontSize: 13 },
//   loginBtn: { marginTop: 18, borderRadius: 12, overflow: "hidden" },
//   loginGradient: { paddingVertical: 14, alignItems: "center" },
//   loginText: { color: "#fff", fontWeight: "800", fontSize: 16 },
//   orText: { textAlign: "center", marginTop: 16, color: "#7b9f7b", fontSize: 13 },
//   socialRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
//   socialBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#F1FFF6", borderRadius: 10 },
//   socialText: { marginLeft: 6, color: "#2E7D32", fontWeight: "700" },
//   bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 18, alignItems: "center" },
//   noAcc: { color: "#7b9f7b" },
//   signUp: { color: "#2E7D32", fontWeight: "800" },
//   quickSection: { marginTop: 24 },
//   quickTitle: { fontSize: 16, fontWeight: "800", color: "#1B5E20" },
//   quickSubtitle: { fontSize: 13, color: "#4E6E33", marginTop: 4, marginBottom: 12 },
//   quickCard: { marginBottom: 12, borderRadius: 14, overflow: "hidden" },
//   quickGradient: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16 },
//   quickEmoji: { fontSize: 24, marginRight: 12 },
//   quickName: { fontSize: 15, fontWeight: "700", color: "#0F5132" },
//   quickDesc: { fontSize: 12, color: "#1B5E20", marginTop: 2 },
//   quickHint: { fontSize: 12, color: "#5C705E", marginTop: 6 },
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
// import { BACKEND_BASE } from "../constants/backend";
// import { useRole } from "../context/RoleContext";
// import { useLanguage } from "./i18n/LanguageContext";

// const { height } = Dimensions.get("window");

// export default function Login() {
//   const router = useRouter();
//   const { role, setRole } = useRole();
//   const { t, language } = useLanguage();

//   // Animations
//   const fade = useRef(new Animated.Value(0)).current;
//   const slideUp = useRef(new Animated.Value(24)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
//       Animated.spring(slideUp, { toValue: 0, friction: 7, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   // Form state
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [secure, setSecure] = useState(true);
//   const [loading, setLoading] = useState(false);

//   // Debug: log backend base once
//   useEffect(() => {
//     console.log("[Login] BACKEND_BASE =", BACKEND_BASE);
//   }, []);

//   // Resolve destination route based on role
//   const resolveDestination = async (userRole?: string | null) => {
//     const r = (userRole || role || "farmer").toLowerCase();
//     if (r === "farmer") return "/dashboard";
//     if (r === "buyer") return "/buyer/index";
//     if (r === "admin") return "/admin/dashboard";
//     return "/dashboard";
//   };

//   // Small health test button (to confirm app→backend connection)
//   const testBackendHealth = async () => {
//     try {
//       const url = `${BACKEND_BASE}/health`;
//       console.log("[Login] Testing backend health:", url);
//       const res = await fetch(url);
//       const json = await res.json();
//       console.log("[Login] Health response:", json);
//       Alert.alert("Health OK", JSON.stringify(json));
//     } catch (err: any) {
//       console.error("[Login] Health test failed:", err);
//       Alert.alert("Health FAILED", err?.message || "Network error");
//     }
//   };

//   const validateAndLogin = async () => {
//     if (!email.trim()) {
//       return Alert.alert(t("enter_email") || "Enter email");
//     }
//     if (!password) {
//       return Alert.alert(t("enter_password") || "Enter password");
//     }

//     setLoading(true);
//     try {
//       const url = `${BACKEND_BASE}/api/auth/login`;
//       console.log("[Login] Calling:", url);

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: email.trim(),
//           password,
//         }),
//       });

//       const text = await res.text();
//       let data: any = {};
//       try {
//         data = JSON.parse(text);
//       } catch (e) {
//         console.error("[Login] Failed to parse response:", text);
//         throw new Error(`Server returned invalid response (${res.status})`);
//       }

//       if (!res.ok) {
//         const errorMsg = data.message || data.error || `Login failed (${res.status})`;
//         console.error("[Login] Error response:", data);

//         // Friendly messages for auth errors
//         if (res.status === 401 || res.status === 404) {
//           throw new Error(
//             language === "mr"
//               ? "अवैध ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा."
//               : "Invalid email or password. Please check your credentials and try again."
//           );
//         }
//         throw new Error(errorMsg);
//       }

//       // Success: we have token + user object
//       console.log("[Login] Success:", data);

//       const user = data.user || {};
//       const backendRole = (user.role || role || "farmer").toLowerCase();

//       // Save token & basic user data
//       if (data.token) {
//         await AsyncStorage.setItem("auth_token", String(data.token));
//       }
//       if (user.name) {
//         await AsyncStorage.setItem("user_name", String(user.name));
//       }
//       if (user.email || email.trim()) {
//         await AsyncStorage.setItem("user_email", String(user.email || email.trim()));
//       }

//       await setRole?.(backendRole as any);
//       await AsyncStorage.setItem("app_role", backendRole);

//       const prettyRole = backendRole.charAt(0).toUpperCase() + backendRole.slice(1);
//       Alert.alert(
//         "✅ " + (t("login_success") || "Login Success"),
//         `${t("welcome") || "Welcome"} ${user.name || prettyRole}`
//       );

//       const destination = await resolveDestination(backendRole);
//       console.log("[Login] Routing to:", destination);
//       router.replace(destination);
//     } catch (err: any) {
//       console.error("[Login] Login error:", err);

//       const networkIssue =
//         err?.message?.includes("Network request failed") ||
//         err?.message?.includes("Failed to fetch");

//       let msg = err?.message || (t("try_again") || "Try again");

//       if (networkIssue) {
//         msg =
//           (t("login_network_issue") || "Unable to reach the server right now.") +
//           "\n\n" +
//           (t("check_wifi") || "Please check that your phone and backend are on the same network.");
//       }

//       Alert.alert(
//         t("login_failed") || "Login failed",
//         msg +
//           (language === "mr"
//             ? "\n\nटीप: जर तुम्ही नवीन आहात, तर प्रथम नोंदणी करा."
//             : "\n\nNote: If you're new, please register first.")
//       );
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
//           <Image
//             source={require("../assets/images/logo.jpg")}
//             style={styles.smallLogo}
//             resizeMode="contain"
//           />
//           <Text style={styles.appName}>{t("appName")}</Text>
//         </View>
//         <Text style={styles.welcome}>
//           {t("welcome")}{" "}
//           {role ? role[0].toUpperCase() + role.slice(1) : t("farmer")} 🌿
//         </Text>
//         <Text style={styles.sub}>
//           {t("login_sub") || "Smart Farming & Crop Marketplace Login"}
//         </Text>
//       </LinearGradient>

//       <ScrollView
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
//         keyboardShouldPersistTaps="handled"
//       >
//         <Animated.View
//           style={{
//             opacity: fade,
//             transform: [{ translateY: slideUp }],
//           }}
//         >
//           <View style={styles.card}>
//             <View style={styles.inputRow}>
//               <MaterialIcons
//                 name="email"
//                 size={20}
//                 color="#3e7a3e"
//                 style={{ marginRight: 8 }}
//               />
//               <TextInput
//                 placeholder={t("email")}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 value={email}
//                 onChangeText={setEmail}
//                 style={styles.input}
//                 placeholderTextColor="#8aa08a"
//               />
//             </View>

//             <View style={[styles.inputRow, { marginTop: 12 }]}>
//               <MaterialIcons
//                 name="lock"
//                 size={20}
//                 color="#3e7a3e"
//                 style={{ marginRight: 8 }}
//               />
//               <TextInput
//                 placeholder={t("password")}
//                 secureTextEntry={secure}
//                 value={password}
//                 onChangeText={setPassword}
//                 style={styles.input}
//                 placeholderTextColor="#8aa08a"
//               />
//               <TouchableOpacity
//                 onPress={() => setSecure((s) => !s)}
//                 style={styles.eyeBtn}
//               >
//                 <MaterialIcons
//                   name={secure ? "visibility-off" : "visibility"}
//                   size={18}
//                   color="#497f49"
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.rowBetween}>
//               <TouchableOpacity
//                 onPress={() =>
//                   Alert.alert(
//                     t("forgot_password") || "Forgot Password",
//                     t("feature_coming") || "Feature coming soon!"
//                   )
//                 }
//               >
//                 <Text style={styles.forgot}>{t("forgot_password")}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   setEmail("farmer@test.com");
//                   setPassword("Farmer123");
//                 }}
//               >
//                 <Text style={styles.demoFill}>{t("demo_creds") || "Demo creds"}</Text>
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity
//               style={styles.loginBtn}
//               onPress={validateAndLogin}
//               activeOpacity={0.85}
//               disabled={loading}
//             >
//               <LinearGradient
//                 colors={["#43A047", "#2E7D32"]}
//                 style={styles.loginGradient}
//               >
//                 <Text style={styles.loginText}>
//                   {loading ? t("signing_in") || "Signing in..." : t("login")}
//                 </Text>
//               </LinearGradient>
//             </TouchableOpacity>

//             {/* 🔍 Backend health quick test */}
//             <TouchableOpacity
//               style={[styles.loginBtn, { marginTop: 10, backgroundColor: "#E0F2F1" }]}
//               onPress={testBackendHealth}
//               activeOpacity={0.85}
//             >
//               <Text style={[styles.loginText, { color: "#00695C" }]}>
//                 Test Backend Health
//               </Text>
//             </TouchableOpacity>

//             <Text style={styles.orText}>{t("or_continue_with") || "or continue with"}</Text>

//             <View style={styles.socialRow}>
//               <TouchableOpacity style={styles.socialBtn}>
//                 <FontAwesome name="google" size={18} color="#DB4437" />
//                 <Text style={styles.socialText}>Google</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.socialBtn}>
//                 <MaterialIcons name="phone" size={18} color="#0B8043" />
//                 <Text style={styles.socialText}>{t("phone") || "Phone"}</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.bottomRow}>
//               <Text style={styles.noAcc}>
//                 {t("no_account") || "Don’t have an account?"}
//               </Text>
//               <TouchableOpacity onPress={() => router.push("/register")}>
//                 <Text style={styles.signUp}> {t("register")}</Text>
//               </TouchableOpacity>
//             </View>
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
//     marginHorizontal: 0,
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
//     marginTop: 8,
//   },
//   input: { flex: 1, fontSize: 16, color: "#163b16" },
//   eyeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   forgot: { fontSize: 13, color: "#4E8A4C" },
//   demoFill: { fontSize: 13, color: "#0B8043", fontWeight: "600" },
//   loginBtn: {
//     marginTop: 18,
//     borderRadius: 14,
//     overflow: "hidden",
//   },
//   loginGradient: {
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   loginText: { color: "#fff", fontSize: 16, fontWeight: "700" },
//   orText: { marginTop: 18, textAlign: "center", color: "#666" },
//   socialRow: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     marginTop: 10,
//   },
//   socialBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F1F8E9",
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   socialText: { marginLeft: 6, color: "#33691E", fontWeight: "600" },
//   bottomRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 18,
//   },
//   noAcc: { color: "#555" },
//   signUp: { color: "#2E7D32", fontWeight: "700" },
// });
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
import { BACKEND_BASE } from "../constants/backend"; // still used for health test
import { useRole } from "../context/RoleContext";
import { useLanguage } from "./i18n/LanguageContext";

// 🔥 Firebase imports
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseconfig";

const { height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const { t, language } = useLanguage();

  // Animations
  const fade = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideUp, { toValue: 0, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("[Login] BACKEND_BASE =", BACKEND_BASE);
  }, []);

  const resolveDestination = async (userRole?: string | null) => {
    const r = (userRole || role || "farmer").toLowerCase();
    if (r === "farmer") return "/dashboard";
    if (r === "buyer") return "/buyer/index";
    if (r === "admin") return "/admin/dashboard";
    return "/dashboard";
  };

  // Health test still uses Node backend (for your disease APIs etc)
  const testBackendHealth = async () => {
    try {
      const url = `${BACKEND_BASE}/health`;
      console.log("[Login] Testing backend health:", url);
      const res = await fetch(url);
      const json = await res.json();
      console.log("[Login] Health response:", json);
      Alert.alert("Health OK", JSON.stringify(json));
    } catch (err: any) {
      console.error("[Login] Health test failed:", err);
      Alert.alert("Health FAILED", err?.message || "Network error");
    }
  };

  const validateAndLogin = async () => {
    if (!email.trim()) {
      return Alert.alert(t("enter_email") || "Enter email");
    }
    if (!password) {
      return Alert.alert(t("enter_password") || "Enter password");
    }

    setLoading(true);
    try {
      // 1) Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = userCredential.user.uid;

      // 2) Fetch profile from Firestore
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error(
          language === "mr"
            ? "यूजर डेटा सापडला नाही. कृपया पुन्हा नोंदणी करा."
            : "User profile not found in database. Please register again."
        );
      }

      const user = userSnap.data() || {};
      const backendRole = (user.role || role || "farmer").toLowerCase();

      // 3) Save basic details locally
      if (user.name) {
        await AsyncStorage.setItem("user_name", String(user.name));
      }
      if (user.email || email.trim()) {
        await AsyncStorage.setItem("user_email", String(user.email || email.trim()));
      }
      await setRole?.(backendRole as any);
      await AsyncStorage.setItem("app_role", backendRole);

      const prettyRole = backendRole.charAt(0).toUpperCase() + backendRole.slice(1);
      Alert.alert(
        "✅ " + (t("login_success") || "Login Success"),
        `${t("welcome") || "Welcome"} ${user.name || prettyRole}`
      );

      // 4) Navigate based on role
      const destination = await resolveDestination(backendRole);
      console.log("[Login] Routing to:", destination);
      router.replace(destination);
    } catch (err: any) {
      console.error("[Login] Login error:", err);

      const authError =
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password" ||
        (err?.message && err.message.includes("auth"));

      let msg = err?.message || (t("try_again") || "Try again");

      if (authError) {
        msg =
          language === "mr"
            ? "अवैध ईमेल किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा."
            : "Invalid email or password. Please check your credentials and try again.";
      }

      Alert.alert(
        t("login_failed") || "Login failed",
        msg +
          (language === "mr"
            ? "\n\nटीप: जर तुम्ही नवीन आहात, तर प्रथम नोंदणी करा."
            : "\n\nNote: If you're new, please register first.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require("../assets/images/logo.jpg")}
            style={styles.smallLogo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>{t("appName")}</Text>
        </View>
        <Text style={styles.welcome}>
          {t("welcome")}{" "}
          {role ? role[0].toUpperCase() + role.slice(1) : t("farmer")} 🌿
        </Text>
        <Text style={styles.sub}>
          {t("login_sub") || "Smart Farming & Crop Marketplace Login"}
        </Text>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateY: slideUp }],
          }}
        >
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <MaterialIcons
                name="email"
                size={20}
                color="#3e7a3e"
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder={t("email")}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#8aa08a"
              />
            </View>

            <View style={[styles.inputRow, { marginTop: 12 }]}>
              <MaterialIcons
                name="lock"
                size={20}
                color="#3e7a3e"
                style={{ marginRight: 8 }}
              />
              <TextInput
                placeholder={t("password")}
                secureTextEntry={secure}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                placeholderTextColor="#8aa08a"
              />
              <TouchableOpacity
                onPress={() => setSecure((s) => !s)}
                style={styles.eyeBtn}
              >
                <MaterialIcons
                  name={secure ? "visibility-off" : "visibility"}
                  size={18}
                  color="#497f49"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.rowBetween}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    t("forgot_password") || "Forgot Password",
                    t("feature_coming") || "Feature coming soon!"
                  )
                }
              >
                <Text style={styles.forgot}>{t("forgot_password")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setEmail("farmer@test.com");
                  setPassword("Farmer123");
                }}
              >
                <Text style={styles.demoFill}>{t("demo_creds") || "Demo creds"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={validateAndLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              <LinearGradient
                colors={["#43A047", "#2E7D32"]}
                style={styles.loginGradient}
              >
                <Text style={styles.loginText}>
                  {loading ? t("signing_in") || "Signing in..." : t("login")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 🔍 Backend health quick test (for Node backend APIs) */}
            <TouchableOpacity
              style={[styles.loginBtn, { marginTop: 10, backgroundColor: "#E0F2F1" }]}
              onPress={testBackendHealth}
              activeOpacity={0.85}
            >
              <Text style={[styles.loginText, { color: "#00695C" }]}>
                Test Backend Health
              </Text>
            </TouchableOpacity>

            <Text style={styles.orText}>{t("or_continue_with") || "or continue with"}</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <FontAwesome name="google" size={18} color="#DB4437" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <MaterialIcons name="phone" size={18} color="#0B8043" />
                <Text style={styles.socialText}>{t("phone") || "Phone"}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.noAcc}>
                {t("no_account") || "Don’t have an account?"}
              </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.signUp}> {t("register")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 60,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  smallLogo: { width: 45, height: 45 },
  appName: { fontSize: 22, fontWeight: "800", color: "#2E7D32", marginLeft: 8 },
  welcome: { fontSize: 22, fontWeight: "800", color: "#1B5E20" },
  sub: { fontSize: 14, color: "#4E6E33", marginTop: 4, textAlign: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 0,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6FFF6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    marginTop: 8,
  },
  input: { flex: 1, fontSize: 16, color: "#163b16" },
  eyeBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  forgot: { fontSize: 13, color: "#4E8A4C" },
  demoFill: { fontSize: 13, color: "#0B8043", fontWeight: "600" },
  loginBtn: {
    marginTop: 18,
    borderRadius: 14,
    overflow: "hidden",
  },
  loginGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  orText: { marginTop: 18, textAlign: "center", color: "#666" },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  socialText: { marginLeft: 6, color: "#33691E", fontWeight: "600" },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  noAcc: { color: "#555" },
  signUp: { color: "#2E7D32", fontWeight: "700" },
});
