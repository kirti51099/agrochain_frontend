// // app/smart-assistant/disease-detection.tsx
// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Platform,
//   ImageBackground,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Animated, { FadeIn, FadeInUp, withSpring, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
// import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// const BACKEND_BASE = "http://10.58.115.176:5000"; // change if needed

// export default function DiseaseDetection() {
//   const router = useRouter();
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [record, setRecord] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const scale = useSharedValue(1);
//   const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== "web") {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== "granted") {
//           Alert.alert("Permission required", "Please enable photo permissions in settings.");
//         }
//       }
//     })();
//   }, []);

//   async function pickImage() {
//     try {
//       const res = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 0.8,
//         allowsEditing: true,
//       });
//       const cancelled = (res as any).cancelled ?? (res as any).canceled;
//       if (!cancelled) {
//         const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
//         setImageUri(uri);
//         setRecord(null);
//         setError(null);
//       }
//     } catch (e) {
//       console.warn(e);
//       Alert.alert("Error", "Could not open gallery.");
//     }
//   }

//   async function takePhoto() {
//     try {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission required", "Please enable camera permission.");
//         return;
//       }
//       const res = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
//       const cancelled = (res as any).cancelled ?? (res as any).canceled;
//       if (!cancelled) {
//         const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
//         setImageUri(uri);
//         setRecord(null);
//         setError(null);
//       }
//     } catch (e) {
//       console.warn(e);
//       Alert.alert("Error", "Could not open camera.");
//     }
//   }

//   async function analyzeDisease() {
//     if (!imageUri) {
//       Alert.alert("No image", "Pick or take a photo first.");
//       return;
//     }

//     setLoading(true);
//     setRecord(null);
//     setError(null);

//     try {
//       const filenameParts = imageUri.split("/");
//       const name = filenameParts[filenameParts.length - 1];
//       const match = /\.(\w+)$/.exec(name);
//       const ext = match ? match[1].toLowerCase() : "jpg";
//       const mime = ext === "png" ? "image/png" : "image/jpeg";

//       const form = new FormData();
//       // @ts-ignore - React Native FormData typing differs slightly
//       form.append("image", { uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""), name, type: mime });

//       const resp = await fetch(`${BACKEND_BASE}/api/images/upload`, {
//         method: "POST",
//         body: form,
//       });

//       const text = await resp.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = { message: text }; }

//       if (!resp.ok && resp.status !== 200) {
//         const msg = json?.message || `Server error (${resp.status})`;
//         setError(msg);
//         Alert.alert("Upload failed", msg);
//         setLoading(false);
//         return;
//       }

//       // backend returns { record: { ... } } or record directly
//       const rec = json.record ?? json;
//       setRecord(rec);
//       // store selected disease for pesticide module (safe step)
//       try {
//         const diag = (rec && (rec.diagnosis ?? rec.apiResponse?.suggestions?.[0]?.plant_name)) || "";
//         if (diag && diag.length > 0) {
//           await AsyncStorage.setItem("pesticide_disease", String(diag));
//         } else {
//           // clear previous if none
//           await AsyncStorage.removeItem("pesticide_disease");
//         }
//       } catch (e) {
//         console.warn("AsyncStorage set failed:", e);
//       }
//     } catch (err: any) {
//       console.error(err);
//       setError(err?.message || "Failed to analyze");
//       Alert.alert("Error", String(err?.message || err));
//     } finally {
//       setLoading(false);
//     }
//   }

//   // When pressing "Open Pesticide Recommendations" we ensure AsyncStorage has disease then navigate
//   async function openPesticide() {
//     const diag = record?.diagnosis ?? record?.apiResponse?.suggestions?.[0]?.plant_name ?? null;
//     try {
//       if (diag) await AsyncStorage.setItem("pesticide_disease", String(diag));
//     } catch (e) {
//       console.warn("AsyncStorage save failed", e);
//     }
//     router.push("/smart-assistant/pesticide-recommendation");
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.wrap}>
//       <ImageBackground
//         source={{ uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6" }}
//         style={styles.hero}
//         imageStyle={{ opacity: 0.18 }}
//       >
//         <View style={styles.heroInner}>
//           <Text style={styles.title}>Disease Detection</Text>
//           <Text style={styles.subtitle}>Snap a leaf, get AI-driven diagnosis & remedies.</Text>
//         </View>
//       </ImageBackground>

//       <Animated.View entering={FadeInUp} style={[styles.preview, imageUri ? {} : { justifyContent: "center", alignItems: "center" }]}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.image} />
//         ) : (
//           <View style={styles.placeholder}>
//             <Feather name="image" size={46} color="#6b7280" />
//             <Text style={styles.placeholderText}>No image selected</Text>
//           </View>
//         )}
//       </Animated.View>

//       <View style={styles.row}>
//         <Animated.View style={[animatedStyle, { flex: 1 }]}>
//           <TouchableOpacity
//             onPressIn={() => (scale.value = withSpring(0.98))}
//             onPressOut={() => (scale.value = withSpring(1))}
//             style={[styles.actionBtn, { backgroundColor: "#047857" }]}
//             onPress={pickImage}
//           >
//             <Feather name="image" size={18} color="#fff" />
//             <Text style={styles.actionText}>Gallery</Text>
//           </TouchableOpacity>
//         </Animated.View>

//         <Animated.View style={[animatedStyle, { flex: 1 }]}>
//           <TouchableOpacity
//             onPressIn={() => (scale.value = withSpring(0.98))}
//             onPressOut={() => (scale.value = withSpring(1))}
//             style={[styles.actionBtn, { backgroundColor: "#0ea5a4" }]}
//             onPress={takePhoto}
//           >
//             <MaterialCommunityIcons name="camera-iris" size={18} color="#fff" />
//             <Text style={styles.actionText}>Camera</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>

//       <TouchableOpacity
//         style={[styles.cta, { backgroundColor: "#2563eb" }]}
//         onPress={analyzeDisease}
//         disabled={loading}
//       >
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Analyze</Text>}
//       </TouchableOpacity>

//       {error ? <Text style={styles.errorText}>{error}</Text> : null}

//       {record ? (
//         <Animated.View entering={FadeIn} style={styles.resultCard}>
//           <Text style={styles.resultTitle}>Diagnosis</Text>
//           <Text style={styles.resultLine}>Name: <Text style={{ fontWeight: "800" }}>{record.diagnosis ?? "—"}</Text></Text>
//           <Text style={styles.resultLine}>Confidence: {record.confidence ? record.confidence + "%" : "-"}</Text>

//           {record.apiResponse?.suggestions && record.apiResponse.suggestions.length > 0 && (
//             <>
//               <Text style={[styles.resultTitle, { marginTop: 12 }]}>Top Suggestions</Text>
//               {record.apiResponse.suggestions.slice(0, 3).map((s: any, idx: number) => (
//                 <View key={idx} style={styles.suggest}>
//                   <Text style={styles.suggestName}>{s.plant_name ?? (s.plant && s.plant.scientific_name) ?? "Unknown"}</Text>
//                   <Text style={styles.suggestConf}>{s.probability ? Math.round(s.probability * 100) + "%" : "-"}</Text>
//                 </View>
//               ))}
//             </>
//           )}

//           <Text style={[styles.resultTitle, { marginTop: 12 }]}>Quick Remedies</Text>
//           <Text style={{ color: "#333" }}>
//             {record.diagnosis ? `Based on ${record.diagnosis}, check recommended pesticides or organic treatments.` : "No diagnosis available."}
//           </Text>

//           <TouchableOpacity style={[styles.openBtn]} onPress={openPesticide}>
//             <Text style={styles.openBtnText}>Open Pesticide Recommendations</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       ) : null}

//       <View style={{ height: 40 }} />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { padding: 16, backgroundColor: "#f6fff7" },
//   hero: { width: "100%", height: 160, borderRadius: 12, marginBottom: 12, overflow: "hidden", justifyContent: "center" },
//   heroInner: { paddingHorizontal: 18 },
//   title: { fontSize: 22, fontWeight: "900", color: "#064e3b" },
//   subtitle: { color: "#0f5132", marginTop: 6 },
//   preview: { height: 260, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", borderWidth: 1, borderColor: "#e6eee8" },
//   placeholder: { justifyContent: "center", alignItems: "center", flex: 1 },
//   placeholderText: { color: "#6b7280", marginTop: 8 },
//   image: { width: "100%", height: "100%", resizeMode: "cover" },
//   row: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
//   actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 10, marginHorizontal: 6 },
//   actionText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
//   cta: { marginTop: 12, padding: 14, borderRadius: 12, alignItems: "center" },
//   ctaText: { color: "#fff", fontSize: 16, fontWeight: "900" },
//   errorText: { color: "#b00020", marginTop: 12 },
//   resultCard: { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e6eee8" },
//   resultTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
//   resultLine: { color: "#223", marginBottom: 6 },
//   suggest: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f2f5f2" },
//   suggestName: { fontWeight: "700" },
//   suggestConf: { color: "#228" },
//   openBtn: { marginTop: 14, backgroundColor: "#0f5132", padding: 12, borderRadius: 10, alignItems: "center" },
//   openBtnText: { color: "#fff", fontWeight: "800" },
// });


// app/smart-assistant/disease-detection.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn, FadeInUp, withSpring, useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BACKEND_BASE } from "../../constants/backend"; // <-- use centralized backend constant

export default function DiseaseDetection() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Please enable photo permissions in settings.");
        }
      }
    })();
  }, []);

  async function pickImage() {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      const cancelled = (res as any).cancelled ?? (res as any).canceled;
      if (!cancelled) {
        const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
        setImageUri(uri);
        setRecord(null);
        setError(null);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Could not open gallery.");
    }
  }

  async function takePhoto() {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please enable camera permission.");
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
      const cancelled = (res as any).cancelled ?? (res as any).canceled;
      if (!cancelled) {
        const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
        setImageUri(uri);
        setRecord(null);
        setError(null);
      }
    } catch (e) {
      console.warn(e);
      Alert.alert("Error", "Could not open camera.");
    }
  }

  async function analyzeDisease() {
    if (!imageUri) {
      Alert.alert("No image", "Pick or take a photo first.");
      return;
    }

    setLoading(true);
    setRecord(null);
    setError(null);

    try {
      // prepare filename & mime
      const filenameParts = imageUri.split("/");
      const name = filenameParts[filenameParts.length - 1] || `photo.${Platform.OS === "android" ? "jpg" : "jpg"}`;
      const match = /\.(\w+)$/.exec(name);
      const ext = match ? match[1].toLowerCase() : "jpg";
      const mime = ext === "png" ? "image/png" : "image/jpeg";

      // FormData for RN: for Android uri must be the raw uri, for iOS remove file://
      const fileForForm: any = {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name,
        type: mime,
      };

      const form = new FormData();
      // backend expects field "image"
      // @ts-ignore (React Native FormData typing differs)
      form.append("image", fileForForm);

      // Send request to backend route (make sure backend exposes this)
      const resp = await fetch(`${BACKEND_BASE}/api/disease/detect`, {
        method: "POST",
        body: form,
        // DO NOT set Content-Type — fetch will set the multipart boundary
      });

      const text = await resp.text();
      let json;
      try { json = JSON.parse(text); } catch { json = { message: text }; }

      if (!resp.ok) {
        const msg = json?.message || `Server error (${resp.status})`;
        setError(msg);
        Alert.alert("Upload failed", msg);
        setLoading(false);
        return;
      }

      // Normalize response structure: accept either { record: {...} } or direct object
      const rec = json.record ?? json;
      setRecord(rec);

      // Save diagnosis name for pesticide module (best-effort)
      try {
        const diag =
          (rec && (rec.diagnosis ?? rec.apiResponse?.suggestions?.[0]?.plant_name ?? rec.label ?? rec.plant)) || "";
        if (diag && diag.length > 0) {
          await AsyncStorage.setItem("pesticide_disease", String(diag));
        } else {
          await AsyncStorage.removeItem("pesticide_disease");
        }
      } catch (e) {
        console.warn("AsyncStorage set failed:", e);
      }
    } catch (err: any) {
      console.error(err);
      const message = err?.message ?? "Failed to analyze image";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  }

  async function openPesticide() {
    const diag = record?.diagnosis ?? record?.apiResponse?.suggestions?.[0]?.plant_name ?? null;
    try {
      if (diag) await AsyncStorage.setItem("pesticide_disease", String(diag));
    } catch (e) {
      console.warn("AsyncStorage save failed", e);
    }
    router.push("/smart-assistant/pesticide-recommendation");
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6" }}
        style={styles.hero}
        imageStyle={{ opacity: 0.18 }}
      >
        <View style={styles.heroInner}>
          <Text style={styles.title}>Disease Detection</Text>
          <Text style={styles.subtitle}>Snap a leaf, get AI-driven diagnosis & remedies.</Text>
        </View>
      </ImageBackground>

      <Animated.View entering={FadeInUp} style={[styles.preview, imageUri ? {} : { justifyContent: "center", alignItems: "center" }]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Feather name="image" size={46} color="#6b7280" />
            <Text style={styles.placeholderText}>No image selected</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.row}>
        <Animated.View style={[animatedStyle, { flex: 1 }]}>
          <TouchableOpacity
            onPressIn={() => (scale.value = withSpring(0.98))}
            onPressOut={() => (scale.value = withSpring(1))}
            style={[styles.actionBtn, { backgroundColor: "#047857" }]}
            onPress={pickImage}
            disabled={loading}
          >
            <Feather name="image" size={18} color="#fff" />
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[animatedStyle, { flex: 1 }]}>
          <TouchableOpacity
            onPressIn={() => (scale.value = withSpring(0.98))}
            onPressOut={() => (scale.value = withSpring(1))}
            style={[styles.actionBtn, { backgroundColor: "#0ea5a4" }]}
            onPress={takePhoto}
            disabled={loading}
          >
            <MaterialCommunityIcons name="camera-iris" size={18} color="#fff" />
            <Text style={styles.actionText}>Camera</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.cta, { backgroundColor: loading ? "#9ecbbf" : "#2563eb" }]}
        onPress={analyzeDisease}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Analyze</Text>}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {record ? (
        <Animated.View entering={FadeIn} style={styles.resultCard}>
          <Text style={styles.resultTitle}>Diagnosis</Text>
          <Text style={styles.resultLine}>Name: <Text style={{ fontWeight: "800" }}>{record.diagnosis ?? record.label ?? "—"}</Text></Text>
          <Text style={styles.resultLine}>Confidence: {record.confidence ? record.confidence + "%" : (record.score ? Math.round(record.score * 100) + "%" : "-")}</Text>

          {record.apiResponse?.suggestions && record.apiResponse.suggestions.length > 0 && (
            <>
              <Text style={[styles.resultTitle, { marginTop: 12 }]}>Top Suggestions</Text>
              {record.apiResponse.suggestions.slice(0, 3).map((s: any, idx: number) => (
                <View key={idx} style={styles.suggest}>
                  <Text style={styles.suggestName}>{s.plant_name ?? (s.plant && s.plant.scientific_name) ?? "Unknown"}</Text>
                  <Text style={styles.suggestConf}>{s.probability ? Math.round(s.probability * 100) + "%" : "-"}</Text>
                </View>
              ))}
            </>
          )}

          <Text style={[styles.resultTitle, { marginTop: 12 }]}>Quick Remedies</Text>
          <Text style={{ color: "#333" }}>
            {record.diagnosis ? `Based on ${record.diagnosis}, check recommended pesticides or organic treatments.` : "No diagnosis available."}
          </Text>

          <TouchableOpacity style={[styles.openBtn]} onPress={openPesticide}>
            <Text style={styles.openBtnText}>Open Pesticide Recommendations</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 16, backgroundColor: "#f6fff7" },
  hero: { width: "100%", height: 160, borderRadius: 12, marginBottom: 12, overflow: "hidden", justifyContent: "center" },
  heroInner: { paddingHorizontal: 18 },
  title: { fontSize: 22, fontWeight: "900", color: "#064e3b" },
  subtitle: { color: "#0f5132", marginTop: 6 },
  preview: { height: 260, borderRadius: 12, overflow: "hidden", backgroundColor: "#fff", borderWidth: 1, borderColor: "#e6eee8" },
  placeholder: { justifyContent: "center", alignItems: "center", flex: 1 },
  placeholderText: { color: "#6b7280", marginTop: 8 },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 12, borderRadius: 10, marginHorizontal: 6 },
  actionText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
  cta: { marginTop: 12, padding: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "900" },
  errorText: { color: "#b00020", marginTop: 12 },
  resultCard: { marginTop: 16, padding: 14, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e6eee8" },
  resultTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  resultLine: { color: "#223", marginBottom: 6 },
  suggest: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f2f5f2" },
  suggestName: { fontWeight: "700" },
  suggestConf: { color: "#228" },
  openBtn: { marginTop: 14, backgroundColor: "#0f5132", padding: 12, borderRadius: 10, alignItems: "center" },
  openBtnText: { color: "#fff", fontWeight: "800" },
});
