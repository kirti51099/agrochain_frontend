


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
// import { BACKEND_BASE } from "../../constants/backend";

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
//       // prepare filename & mime
//       const filenameParts = imageUri.split("/");
//       const name = filenameParts[filenameParts.length - 1] || `photo.${Platform.OS === "android" ? "jpg" : "jpg"}`;
//       const match = /\.(\w+)$/.exec(name);
//       const ext = match ? match[1].toLowerCase() : "jpg";
//       const mime = ext === "png" ? "image/png" : "image/jpeg";

//       // FormData for RN: for Android uri must be the raw uri, for iOS remove file://
//       const fileForForm: any = {
//         uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
//         name,
//         type: mime,
//       };

//       const form = new FormData();
//       // backend expects field "image"
//       // @ts-ignore (React Native FormData typing differs)
//       form.append("image", fileForForm);

//       // Send request to backend route
//       const resp = await fetch(`${BACKEND_BASE}/api/disease/detect`, {
//         method: "POST",
//         body: form,
//         // DO NOT set Content-Type — fetch will set the multipart boundary
//       });

//       const text = await resp.text();
//       let json;
//       try { json = JSON.parse(text); } catch { json = { message: text }; }

//       if (!resp.ok) {
//         const msg = json?.message || `Server error (${resp.status})`;
//         setError(msg);
//         Alert.alert("Upload failed", msg);
//         setLoading(false);
//         return;
//       }

//       // Normalize response structure: accept either { record: {...} } or direct object
//       const rec = json.record ?? json;
//       setRecord(rec);

//       // 🔴 NEW: handle non-leaf images
//       if (rec && (rec.isLeafImage === false || rec.diagnosis === "Not a leaf / plant image")) {
//         try {
//           await AsyncStorage.removeItem("pesticide_disease");
//         } catch (e) {
//           console.warn("AsyncStorage remove failed:", e);
//         }
//         Alert.alert(
//           "Not a leaf image",
//           "This photo does not look like a plant leaf. Please take a clear photo of a single leaf."
//         );
//         setLoading(false);
//         return;
//       }

//       // Save diagnosis name for pesticide module (best-effort)
//       try {
//         const diag =
//           (rec && (rec.diagnosis ?? rec.apiResponse?.suggestions?.[0]?.plant_name ?? rec.label ?? rec.plant)) || "";
//         if (diag && diag.length > 0) {
//           await AsyncStorage.setItem("pesticide_disease", String(diag));
//         } else {
//           await AsyncStorage.removeItem("pesticide_disease");
//         }
//       } catch (e) {
//         console.warn("AsyncStorage set failed:", e);
//       }
//     } catch (err: any) {
//       console.error(err);
//       const message = err?.message ?? "Failed to analyze image";
//       setError(message);
//       Alert.alert("Error", message);
//     } finally {
//       setLoading(false);
//     }
//   }

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

//       {record && (
//         <Animated.View entering={FadeIn} style={styles.resultCard}>
//           <Text style={styles.resultTitle}>Result</Text>
//           <Text style={styles.resultLabel}>Diagnosis:</Text>
//           <Text style={styles.resultValue}>{record.diagnosis || "Unknown"}</Text>

//           {record.confidence != null && (
//             <>
//               <Text style={styles.resultLabel}>Confidence:</Text>
//               <Text style={styles.resultValue}>{record.confidence}%</Text>
//             </>
//           )}

//           <TouchableOpacity style={[styles.cta, { marginTop: 16 }]} onPress={openPesticide}>
//             <Text style={styles.ctaText}>Open Pesticide Recommendations</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { paddingBottom: 40, backgroundColor: "#f0fdf4" },
//   hero: { height: 180, justifyContent: "flex-end" },
//   heroInner: { padding: 16 },
//   title: { fontSize: 24, fontWeight: "700", color: "#fefce8" },
//   subtitle: { fontSize: 14, color: "#e5e7eb", marginTop: 4 },
//   preview: { margin: 16, borderRadius: 16, overflow: "hidden", backgroundColor: "#e5e7eb", height: 220 },
//   image: { width: "100%", height: "100%" },
//   placeholder: { alignItems: "center" },
//   placeholderText: { marginTop: 8, color: "#6b7280" },
//   row: { flexDirection: "row", paddingHorizontal: 16, marginTop: 8, gap: 12 },
//   actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 999 },
//   actionText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
//   cta: { marginHorizontal: 16, marginTop: 16, paddingVertical: 12, borderRadius: 999, alignItems: "center" },
//   ctaText: { color: "#fff", fontWeight: "700" },
//   errorText: { marginHorizontal: 16, marginTop: 8, color: "#b91c1c" },
//   resultCard: { marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: "#fff" },
//   resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, color: "#065f46" },
//   resultLabel: { fontSize: 14, fontWeight: "600", marginTop: 4, color: "#374151" },
//   resultValue: { fontSize: 14, color: "#111827" },
// });

// app/smart-assistant/disease-detection.tsx

// app/smart-assistant/disease-detection.tsx
import React, { useEffect, useState } from "react";
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
  SafeAreaView,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  FadeIn,
  FadeInUp,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BACKEND_BASE } from "../../constants/backend";

export default function DiseaseDetection() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scaleGallery = useSharedValue(1);
  const scaleCamera = useSharedValue(1);

  const galleryStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleGallery.value }],
  }));
  const cameraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleCamera.value }],
  }));

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please enable photo permissions in settings."
          );
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
      const res = await ImagePicker.launchCameraAsync({
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
      const filenameParts = imageUri.split("/");
      const name =
        filenameParts[filenameParts.length - 1] ||
        `photo.${Platform.OS === "android" ? "jpg" : "jpg"}`;
      const match = /\.(\w+)$/.exec(name);
      const ext = match ? match[1].toLowerCase() : "jpg";
      const mime = ext === "png" ? "image/png" : "image/jpeg";

      const fileForForm: any = {
        uri:
          Platform.OS === "android"
            ? imageUri
            : imageUri.replace("file://", ""),
        name,
        type: mime,
      };

      const form = new FormData();
      // backend expects field "image"
      // @ts-ignore
      form.append("image", fileForForm);

      const resp = await fetch(`${BACKEND_BASE}/api/disease/detect`, {
        method: "POST",
        body: form,
      });

      const text = await resp.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }

      if (!resp.ok) {
        const msg = json?.message || `Server error (${resp.status})`;
        setError(msg);
        Alert.alert("Upload failed", msg);
        setLoading(false);
        return;
      }

      const rec = json.record ?? json;
      setRecord(rec);

      // handle non-leaf images
      if (
        rec &&
        (rec.isLeafImage === false ||
          rec.diagnosis === "Not a leaf / plant image")
      ) {
        try {
          await AsyncStorage.removeItem("pesticide_disease");
        } catch (e) {
          console.warn("AsyncStorage remove failed:", e);
        }
        Alert.alert(
          "Not a leaf image",
          "This photo does not look like a plant leaf. Please take a clear photo of a single leaf."
        );
        setLoading(false);
        return;
      }

      // Save diagnosis for pesticide module
      try {
        const diag =
          (rec &&
            (rec.diagnosis ??
              rec.apiResponse?.suggestions?.[0]?.plant_name ??
              rec.label ??
              rec.plant)) ||
          "";
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
    const diag =
      record?.diagnosis ??
      record?.apiResponse?.suggestions?.[0]?.plant_name ??
      null;
    try {
      if (diag) await AsyncStorage.setItem("pesticide_disease", String(diag));
    } catch (e) {
      console.warn("AsyncStorage save failed", e);
    }
    router.push("/smart-assistant/pesticide-recommendation");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#bbf7d0" />
      <ScrollView contentContainerStyle={styles.scrollWrap}>
        {/* Header block (no background image now, neat solid color) */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Disease Detection</Text>
          <Text style={styles.headerSubtitle}>
            Upload a leaf photo to detect possible plant diseases with AI.
          </Text>
        </View>

        {/* Preview card */}
        <Animated.View
          entering={FadeInUp}
          style={[
            styles.previewCard,
            !imageUri && { justifyContent: "center", alignItems: "center" },
          ]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Feather name="image" size={46} color="#6b7280" />
              <Text style={styles.placeholderText}>No image selected</Text>
              <Text style={styles.placeholderHint}>
                Choose from gallery or use camera below.
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Buttons row */}
        <View style={styles.row}>
          <Animated.View style={[galleryStyle, { flex: 1 }]}>
            <TouchableOpacity
              onPressIn={() => (scaleGallery.value = withSpring(0.97))}
              onPressOut={() => (scaleGallery.value = withSpring(1))}
              style={[styles.actionBtn, { backgroundColor: "#047857" }]}
              onPress={pickImage}
            >
              <Feather name="image" size={18} color="#fff" />
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[cameraStyle, { flex: 1 }]}>
            <TouchableOpacity
              onPressIn={() => (scaleCamera.value = withSpring(0.97))}
              onPressOut={() => (scaleCamera.value = withSpring(1))}
              style={[styles.actionBtn, { backgroundColor: "#0ea5a4" }]}
              onPress={takePhoto}
            >
              <MaterialCommunityIcons
                name="camera-iris"
                size={18}
                color="#fff"
              />
              <Text style={styles.actionText}>Camera</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Analyze button */}
        <TouchableOpacity
          style={[styles.cta, { backgroundColor: "#2563eb" }]}
          onPress={analyzeDisease}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.ctaText}>Analyze</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Result */}
        {record && (
          <Animated.View entering={FadeIn} style={styles.resultCard}>
            <Text style={styles.resultTitle}>Result</Text>

            <Text style={styles.resultLabel}>Diagnosis</Text>
            <Text style={styles.resultValue}>
              {record.diagnosis || "Unknown"}
            </Text>

            {record.confidence != null && (
              <>
                <Text style={styles.resultLabel}>Confidence</Text>
                <Text style={styles.resultValue}>
                  {record.confidence}%
                </Text>
              </>
            )}

            <TouchableOpacity
              style={[styles.cta, { marginTop: 16 }]}
              onPress={openPesticide}
            >
              <Text style={styles.ctaText}>
                Open Pesticide Recommendations
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  scrollWrap: {
    paddingBottom: 24,
  },
  header: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#bbf7d0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#065f46",
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#166534",
  },
  previewCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    height: 230,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  placeholderText: {
    marginTop: 8,
    color: "#4b5563",
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderHint: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 999,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  cta: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    marginHorizontal: 16,
    marginTop: 8,
    color: "#b91c1c",
    fontSize: 13,
  },
  resultCard: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#065f46",
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
    color: "#4b5563",
  },
  resultValue: {
    fontSize: 14,
    color: "#111827",
    marginTop: 2,
  },
});
