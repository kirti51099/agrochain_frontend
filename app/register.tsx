// // app/register.tsx
// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import React, { useMemo, useState } from "react";
// import {
//   AccessibilityInfo,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import RNPickerSelect from "react-native-picker-select";
// import { useRole } from "../context/RoleContext";
// import { useLanguage } from "./i18n/LanguageContext"; // ✅ language hook
// import LanguagePicker from "./i18n/LanguagePicker"; // ✅ for bottom switch

// export default function Register() {
//   const router = useRouter();
//   const { setRole } = useRole ? useRole() : { setRole: (r: string) => Promise.resolve() };
//   const { t } = useLanguage(); // ✅ get translation function

//   // form state
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setLocalRole] = useState<"farmer" | "buyer" | "admin" | "">("");
//   const [address, setAddress] = useState("");

//   // UI state
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // validations (derived)
//   const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
//   const passwordStrong = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password), [password]);
//   const passwordsMatch = useMemo(() => password.length > 0 && password === confirmPassword, [password, confirmPassword]);
//   const addressValid = useMemo(() => address.trim().length >= 5, [address]);
//   const formValid = name.trim() && emailValid && passwordStrong && passwordsMatch && role && addressValid;

//   const roleOptions = [
//     { label: t("farmer"), value: "farmer" },
//     { label: t("buyer"), value: "buyer" },
//     { label: t("admin"), value: "admin" },
//   ];

//   async function handleRegister() {
//     if (!formValid) {
//       AccessibilityInfo.announceForAccessibility("Please complete all fields correctly");
//       return Alert.alert("Validation", "Please fill all fields correctly before submitting.");
//     }

//     setSubmitting(true);

//     try {
//       await setRole?.(role);

//       Alert.alert("✅ Success", "Registration successful!");

//       if (role === "farmer") router.replace("/farmer/dashboard");
//       else if (role === "buyer") router.replace("/buyer/index");
//       else if (role === "admin") router.replace("/admin/dashboard");
//       else router.replace("/login");
//     } catch (err: any) {
//       console.error("Register error", err);
//       Alert.alert("Error", err?.message || "Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
//       <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.top}>
//         <Text style={styles.brand}>{t("appName")}</Text>
//         <Text style={styles.subTitle}>{t("register")}</Text>
//       </LinearGradient>

//       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//         <Text style={styles.heading}>{t("register")}</Text>

//         <TextInput
//           placeholder={t("register") + " Name"}
//           value={name}
//           onChangeText={setName}
//           style={styles.input}
//           autoCapitalize="words"
//           accessibilityLabel="Full name"
//         />

//         <TextInput
//           placeholder={t("email")}
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           style={styles.input}
//           accessibilityLabel="Email"
//         />
//         <Text style={[styles.hint, email ? (emailValid ? styles.ok : styles.err) : {}]}>
//           {email ? (emailValid ? "✅ Valid email" : "❌ Invalid email") : ""}
//         </Text>

//         <View style={{ width: "100%" }}>
//           <TextInput
//             placeholder={t("password")}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry={!showPassword}
//             style={styles.input}
//             accessibilityLabel="Password"
//           />
//           <Text style={[styles.hint, password ? (passwordStrong ? styles.ok : styles.err) : {}]}>
//             {password
//               ? passwordStrong
//                 ? "✅ Strong password"
//                 : "❌ Use uppercase, lowercase and a number (6+ chars)"
//               : ""}
//           </Text>
//         </View>

//         <TextInput
//           placeholder={t("confirmPassword")}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry={!showPassword}
//           style={styles.input}
//           accessibilityLabel="Confirm password"
//         />
//         <Text style={[styles.hint, confirmPassword ? (passwordsMatch ? styles.ok : styles.err) : {}]}>
//           {confirmPassword
//             ? passwordsMatch
//               ? "✅ Passwords match"
//               : "❌ Passwords do not match"
//             : ""}
//         </Text>

//         <TextInput
//           placeholder={t("address")}
//           value={address}
//           onChangeText={setAddress}
//           style={styles.input}
//           accessibilityLabel="Address"
//         />
//         <Text style={[styles.hint, address ? (addressValid ? styles.ok : styles.err) : {}]}>
//           {address ? (addressValid ? "✅ Valid address" : "❌ Address too short") : ""}
//         </Text>

//         <View style={styles.pickerWrap}>
//           <RNPickerSelect
//             placeholder={{ label: t("selectRole"), value: "" }}
//             onValueChange={(v) => setLocalRole(v)}
//             value={role}
//             items={roleOptions}
//             style={{ inputIOS: styles.input, inputAndroid: styles.input }}
//             useNativeAndroidPickerStyle={false}
//             doneText="Done"
//             accessibilityLabel="Role"
//           />
//         </View>

//         <TouchableOpacity
//           activeOpacity={0.9}
//           onPress={handleRegister}
//           disabled={submitting}
//           style={[styles.cta, !formValid ? { opacity: 0.6 } : {}]}
//         >
//           <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.ctaInner}>
//             <Text style={styles.ctaText}>{submitting ? "Registering..." : t("register")}</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => router.push("/login")} style={styles.secondary}>
//           <Text style={styles.secondaryText}>{t("login")}</Text>
//         </TouchableOpacity>

//         {/* ✅ Language switch */}
//         <View style={{ marginTop: 10 }}>
//           <LanguagePicker />
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   top: {
//     paddingTop: Platform.OS === "ios" ? 70 : 50,
//     paddingBottom: 20,
//     alignItems: "center",
//     borderBottomLeftRadius: 18,
//     borderBottomRightRadius: 18,
//   },
//   brand: { fontSize: 22, fontWeight: "900", color: "#2E7D32" },
//   subTitle: { color: "#4E6E33", marginTop: 6 },

//   container: { alignItems: "center", paddingHorizontal: 20, paddingTop: 24 },
//   heading: { fontSize: 24, fontWeight: "800", marginBottom: 12, color: "#0f5132" },

//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 10,
//     backgroundColor: "#fff",
//   },
//   hint: { width: "100%", marginLeft: 6, marginTop: 6, fontSize: 13, color: "#777" },
//   ok: { color: "#0f9d58" },
//   err: { color: "#d32f2f" },

//   pickerWrap: { width: "100%", marginTop: 8 },

//   cta: { width: "100%", marginTop: 18, borderRadius: 12, overflow: "hidden" },
//   ctaInner: { paddingVertical: 14, alignItems: "center" },
//   ctaText: { color: "#fff", fontWeight: "800" },

//   secondary: { marginTop: 12 },
//   secondaryText: { color: "#497f49" },
// });
// app/register.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRole } from "../context/RoleContext";
import { useLanguage } from "./i18n/LanguageContext";
import LanguagePicker from "./i18n/LanguagePicker";

export default function Register() {
  const router = useRouter();
  const { setRole } = useRole ? useRole() : { setRole: (r: string) => Promise.resolve() };
  const { t } = useLanguage();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setLocalRole] = useState<"farmer" | "buyer" | "admin" | "">("");
  const [address, setAddress] = useState("");

  // UI state
  const [showPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // validations (derived)
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const passwordStrong = useMemo(() => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password), [password]);
  const passwordsMatch = useMemo(() => password.length > 0 && password === confirmPassword, [password, confirmPassword]);
  const addressValid = useMemo(() => address.trim().length >= 5, [address]);
  const formValid = Boolean(name.trim() && emailValid && passwordStrong && passwordsMatch && role && addressValid);

  const roleOptions = [
    { label: t("farmer"), value: "farmer" },
    { label: t("buyer"), value: "buyer" },
    { label: t("admin"), value: "admin" },
  ];

  async function handleRegister() {
    if (!formValid) {
      AccessibilityInfo.announceForAccessibility(t("please_complete_fields") || "Please complete all fields correctly");
      return Alert.alert(t("validation") || "Validation", t("fill_all_correctly") || "Please fill all fields correctly before submitting.");
    }

    setSubmitting(true);

    try {
      // persist role in context and AsyncStorage so login can route correctly
      await setRole?.(role);
      await AsyncStorage.setItem("app_role", role);

      // TODO: call backend register API here if available

      Alert.alert("✅ " + (t("success") || "Success"), t("registration_successful") || "Registration successful!");

      // route user to role-specific screen
      if (role === "farmer") router.replace("/farmer/dashboard");
      else if (role === "buyer") router.replace("/buyer/index");
      else if (role === "admin") router.replace("/admin/dashboard");
      else router.replace("/login");
    } catch (err: any) {
      console.error("Register error", err);
      Alert.alert(t("error") || "Error", err?.message || (t("registration_failed") || "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <LinearGradient colors={["#E8F5E9", "#F1FFF6"]} style={styles.top}>
        <Text style={styles.brand}>{t("appName")}</Text>
        <Text style={styles.subTitle}>{t("register")}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{t("register")}</Text>

        <TextInput
          placeholder={`${t("register")} ${t("name") || "Name"}`}
          value={name}
          onChangeText={setName}
          style={styles.input}
          autoCapitalize="words"
          accessibilityLabel={t("name")}
        />

        <TextInput
          placeholder={t("email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          accessibilityLabel={t("email")}
        />
        <Text style={[styles.hint, email ? (emailValid ? styles.ok : styles.err) : {}]}>
          {email ? (emailValid ? "✅ " + (t("valid_email") || "Valid email") : "❌ " + (t("invalid_email") || "Invalid email")) : ""}
        </Text>

        <View style={{ width: "100%" }}>
          <TextInput
            placeholder={t("password")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            accessibilityLabel={t("password")}
          />
          <Text style={[styles.hint, password ? (passwordStrong ? styles.ok : styles.err) : {}]}>
            {password ? (passwordStrong ? "✅ " + (t("strong_password") || "Strong password") : "❌ " + (t("password_requirements") || "Use uppercase, lowercase and a number (6+ chars)")) : ""}
          </Text>
        </View>

        <TextInput
          placeholder={t("confirmPassword")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          accessibilityLabel={t("confirmPassword")}
        />
        <Text style={[styles.hint, confirmPassword ? (passwordsMatch ? styles.ok : styles.err) : {}]}>
          {confirmPassword ? (passwordsMatch ? "✅ " + (t("passwords_match") || "Passwords match") : "❌ " + (t("passwords_not_match") || "Passwords do not match")) : ""}
        </Text>

        <TextInput
          placeholder={t("address")}
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          accessibilityLabel={t("address")}
        />
        <Text style={[styles.hint, address ? (addressValid ? styles.ok : styles.err) : {}]}>
          {address ? (addressValid ? "✅ " + (t("valid_address") || "Valid address") : "❌ " + (t("address_too_short") || "Address too short")) : ""}
        </Text>

        <View style={styles.pickerWrap}>
          <RNPickerSelect
            placeholder={{ label: t("selectRole"), value: "" }}
            onValueChange={(v) => setLocalRole(v)}
            value={role}
            items={roleOptions}
            style={{ inputIOS: styles.input, inputAndroid: styles.input }}
            useNativeAndroidPickerStyle={false}
            doneText={t("done") || "Done"}
            accessibilityLabel={t("selectRole")}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleRegister}
          disabled={submitting}
          style={[styles.cta, !formValid ? { opacity: 0.6 } : {}]}
        >
          <LinearGradient colors={["#43A047", "#2E7D32"]} style={styles.ctaInner}>
            <Text style={styles.ctaText}>{submitting ? (t("registering") || "Registering...") : t("register")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")} style={styles.secondary}>
          <Text style={styles.secondaryText}>{t("login")}</Text>
        </TouchableOpacity>

        {/* Language switch */}
        <View style={{ marginTop: 10 }}>
          <LanguagePicker />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  top: {
    paddingTop: Platform.OS === "ios" ? 70 : 50,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  brand: { fontSize: 22, fontWeight: "900", color: "#2E7D32" },
  subTitle: { color: "#4E6E33", marginTop: 6 },

  container: { alignItems: "center", paddingHorizontal: 20, paddingTop: 24 },
  heading: { fontSize: 24, fontWeight: "800", marginBottom: 12, color: "#0f5132" },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  hint: { width: "100%", marginLeft: 6, marginTop: 6, fontSize: 13, color: "#777" },
  ok: { color: "#0f9d58" },
  err: { color: "#d32f2f" },

  pickerWrap: { width: "100%", marginTop: 8 },

  cta: { width: "100%", marginTop: 18, borderRadius: 12, overflow: "hidden" },
  ctaInner: { paddingVertical: 14, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800" },

  secondary: { marginTop: 12 },
  secondaryText: { color: "#497f49" },
});
