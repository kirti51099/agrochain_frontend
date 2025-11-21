



// // app/crop-recommendation.tsx
// // app/crop-recommendation.tsx
// // app/crop-recommendation.tsx  (replace entire file)
// // app/crop-recommendation.tsx  (replace existing)
// // app/smart-assistant/crop-recommendation.tsx
// import { LinearGradient } from "expo-linear-gradient";
// import React, { memo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Image,
//   ImageBackground,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";

// import { BACKEND_BASE } from "../../constants/backend"; // <- correct relative path for app/smart-assistant

// // Online fallback (no local placeholder file required)
// const FALLBACK_IMAGE = {
//   uri: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg",
// };

// // Crop card: shows horizontal scrollable images if available
// const CropCard = memo(function CropCard({ item, onSelect }: any) {
//   const images: string[] = Array.isArray(item.images)
//     ? item.images
//     : item.imageUrl
//     ? [item.imageUrl]
//     : [];

//   return (
//     <View style={styles.card}>
//       <View style={{ width: "100%", height: 110 }}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={{ paddingHorizontal: 8, alignItems: "center" }}
//         >
//           {images.length ? (
//             images.map((uri, idx) => (
//               <Image
//                 key={idx}
//                 source={{ uri }}
//                 style={styles.cardImage}
//                 onError={() => console.warn("Image load failed:", uri)}
//               />
//             ))
//           ) : (
//             <Image source={FALLBACK_IMAGE} style={styles.cardImage} />
//           )}
//         </ScrollView>
//       </View>

//       <Text style={styles.cropName}>🌾 {item.name}</Text>
//       <Text style={styles.relevance}>
//         Relevance: {item.relevanceScore ?? item.rawScore ?? 0}%
//       </Text>
//       {Number(item.relevanceScore) >= 80 && (
//         <Text style={styles.badge}>⭐ Best Match</Text>
//       )}

//       <View style={{ flexDirection: "row", marginTop: 8 }}>
//         <TouchableOpacity style={styles.buttonSmall} onPress={() => onSelect(item)}>
//           <Text style={styles.buttonTextSmall}>Accept</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.buttonSmall, { marginLeft: 8, backgroundColor: "#4CAF50" }]}
//           onPress={() =>
//             Alert.alert(item.name, item.reasons?.join(", ") || "No details available")
//           }
//         >
//           <Text style={styles.buttonTextSmall}>Why?</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// });

// export default function CropRecommendation() {
//   const [soil, setSoil] = useState("");
//   const [temperature, setTemperature] = useState("");
//   const [rainfall, setRainfall] = useState("");
//   const [recommendedCrops, setRecommendedCrops] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleRecommend = async () => {
//     if (!soil || !temperature || !rainfall) {
//       Alert.alert("Please enter all farm conditions!");
//       return;
//     }
//     setLoading(true);
//     setRecommendedCrops([]);
//     try {
//       const payload = { soilType: soil.trim(), temperature: Number(temperature), rainfall: Number(rainfall) };
//       const res = await fetch(`${BACKEND_BASE}/api/crops/recommend`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error("Server error: " + txt);
//       }

//       const json = await res.json();
//       // server should return { recommendations: [...] } or an array
//       const list = Array.isArray(json.recommendations) ? json.recommendations : Array.isArray(json) ? json : [];
//       setRecommendedCrops(list);
//       if (!list.length) Alert.alert("No recommendations", "No crops matched your inputs.");
//     } catch (err: any) {
//       console.error("Recommend error", err);
//       Alert.alert("Error", err.message || String(err));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = async (crop: any) => {
//     try {
//       const body = {
//         farmerId: null,
//         requestPayload: { soilType: soil, temperature: Number(temperature), rainfall: Number(rainfall), _recommendedList: recommendedCrops },
//         chosenCrop: { _id: crop._id, name: crop.name, relevanceScore: crop.relevanceScore },
//       };
//       const res = await fetch(`${BACKEND_BASE}/api/crops/select`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error("Failed to log selection: " + t);
//       }
//       Alert.alert("Logged", `You chose ${crop.name}.`);
//     } catch (err: any) {
//       console.error("Select error", err);
//       Alert.alert("Error", err.message || String(err));
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#d0f0c0" }}>
//       <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <LinearGradient colors={["#d0f0c0", "#a0e1e0"]} style={styles.container}>
//             <View style={styles.heroContainer}>
//               <ImageBackground
//   source={{ uri: "https://images.unsplash.com/photo-1524592917347-8f3b7b38b8a0" }}
//   style={styles.heroBackground}
//   imageStyle={{ resizeMode: "cover" }}
// >

//                 <View style={styles.heroOverlay}>
//                   <Text style={styles.heroTitle}>🌾 Crop Recommendation</Text>
//                   <Text style={styles.heroSubtitle}>Find the best crop for your soil and weather conditions.</Text>
//                 </View>
//               </ImageBackground>
//             </View>

//             <View style={styles.inputPanel}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Soil Type 🌱 (e.g. black, loam, clay)"
//                 value={soil}
//                 onChangeText={setSoil}
//                 autoCapitalize="words"
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Temperature ☀️ (°C)"
//                 keyboardType="numeric"
//                 value={temperature}
//                 onChangeText={setTemperature}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Rainfall 🌧️ (mm)"
//                 keyboardType="numeric"
//                 value={rainfall}
//                 onChangeText={setRainfall}
//               />

//               <TouchableOpacity style={styles.button} onPress={handleRecommend} disabled={loading}>
//                 <Text style={styles.buttonText}>{loading ? "Analyzing..." : "Recommend 🌾"}</Text>
//               </TouchableOpacity>

//               {loading && (
//                 <View style={{ marginTop: 10, alignItems: "center" }}>
//                   <ActivityIndicator size="small" color="#2a9d8f" />
//                   <Text style={styles.loadingText}>Processing farm data...</Text>
//                 </View>
//               )}
//             </View>

//             <FlatList
//               data={recommendedCrops}
//               keyExtractor={(item: any) => item._id || item.name}
//               contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
//               renderItem={({ item }) => <CropCard item={item} onSelect={handleSelect} />}
//               ListEmptyComponent={!loading && <Text style={styles.noCrop}>🌱 Enter details and tap "Recommend" to begin!</Text>}
//             />
//           </LinearGradient>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingHorizontal: 12 },
//   heroContainer: { width: "100%", height: 220, borderRadius: 18, overflow: "hidden", marginTop: 12, marginBottom: 14, elevation: 6 },
//   heroBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
//   heroOverlay: { backgroundColor: "rgba(255,255,255,0.25)", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", paddingHorizontal: 12 },
//   heroTitle: { fontSize: 24, fontWeight: "bold", color: "#2a9d8f", textAlign: "center" },
//   heroSubtitle: { fontSize: 14, color: "#222", textAlign: "center", opacity: 0.9 },

//   inputPanel: { backgroundColor: "rgba(255,255,255,0.35)", borderRadius: 14, padding: 12, marginBottom: 10 },
//   input: { borderWidth: 1, borderColor: "#a0c4b0", padding: 10, borderRadius: 10, marginBottom: 8, backgroundColor: "#fff", fontSize: 14 },
//   button: { backgroundColor: "#2a9d8f", padding: 12, borderRadius: 10, alignItems: "center" },
//   buttonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
//   loadingText: { textAlign: "center", color: "#045d56", marginTop: 5 },

//   card: { width: "100%", marginVertical: 8, padding: 12, borderRadius: 14, backgroundColor: "#ffffffdd", elevation: 4 },
//   cardImage: { width: "100%", height: 200, borderRadius: 10, marginRight: 10 },
//   cropName: { fontSize: 16, fontWeight: "800", color: "#045d56", marginTop: 10 },
//   relevance: { marginTop: 6, color: "#333" },
//   badge: { backgroundColor: "#b5e48c", color: "#1b4332", fontSize: 12, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 4, alignSelf: "flex-start" },
//   buttonSmall: { backgroundColor: "#006d77", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
//   buttonTextSmall: { color: "#fff", fontSize: 14, fontWeight: "700" },
//   noCrop: { textAlign: "center", marginTop: 40, color: "#333", fontSize: 15 }
// });



import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { BACKEND_BASE } from "../../constants/backend";
import { CROP_IMAGES } from "../../constants/cropImages";

// If no local image found, we show a simple text box instead of external image
const CropCard = memo(function CropCard({ item, onSelect }: any) {
  const cropKey = (item.name || "").toLowerCase().trim();
  const localImage = CROP_IMAGES[cropKey];

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>

        {localImage ? (
          <Image source={localImage} style={styles.cardImage} />
        ) : (
          <View
            style={[
              styles.cardImage,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Text style={{ color: "#6b7280", fontSize: 12 }}>
              No image available
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.cropName}>🌾 {item.name}</Text>
      <Text style={styles.relevance}>
        Relevance: {item.relevanceScore ?? item.rawScore ?? 0}%
      </Text>
      {Number(item.relevanceScore) >= 80 && (
        <Text style={styles.badge}>⭐ Best Match</Text>
      )}

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={() => onSelect(item)}
        >
          <Text style={styles.buttonTextSmall}>Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonSmall,
            { marginLeft: 8, backgroundColor: "#4CAF50" },
          ]}
          onPress={() =>
            Alert.alert(
              item.name,
              item.reasons?.join(", ") || "No details available"
            )
          }
        >
          <Text style={styles.buttonTextSmall}>Why?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function CropRecommendation() {
  const [soil, setSoil] = useState("");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [recommendedCrops, setRecommendedCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    if (!soil || !temperature || !rainfall) {
      Alert.alert("Please enter all farm conditions!");
      return;
    }
    setLoading(true);
    setRecommendedCrops([]);
    try {
      const payload = {
        soilType: soil.trim(),
        temperature: Number(temperature),
        rainfall: Number(rainfall),
      };
      const res = await fetch(`${BACKEND_BASE}/api/crops/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error("Server error: " + txt);
      }

      const json = await res.json();
      const list = Array.isArray(json.recommendations)
        ? json.recommendations
        : Array.isArray(json)
        ? json
        : [];
      setRecommendedCrops(list);
      if (!list.length)
        Alert.alert("No recommendations", "No crops matched your inputs.");
    } catch (err: any) {
      console.error("Recommend error", err);
      Alert.alert("Error", err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (crop: any) => {
    try {
      const body = {
        farmerId: null,
        requestPayload: {
          soilType: soil,
          temperature: Number(temperature),
          rainfall: Number(rainfall),
          _recommendedList: recommendedCrops,
        },
        chosenCrop: {
          _id: crop._id,
          name: crop.name,
          relevanceScore: crop.relevanceScore,
        },
      };
      const res = await fetch(`${BACKEND_BASE}/api/crops/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error("Failed to log selection: " + t);
      }
      Alert.alert("Logged", `You chose ${crop.name}.`);
    } catch (err: any) {
      console.error("Select error", err);
      Alert.alert("Error", err.message || String(err));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#d0f0c0" }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <LinearGradient
            colors={["#d0f0c0", "#a0e1e0"]}
            style={styles.container}
          >
            <View style={styles.heroContainer}>
              <ImageBackground
                source={{
                  uri: "https://images.unsplash.com/photo-1524592917347-8f3b7b38b8a0",
                }}
                style={styles.heroBackground}
                imageStyle={{ resizeMode: "cover" }}
              >
                <View style={styles.heroOverlay}>
                  <Text style={styles.heroTitle}>🌾 Crop Recommendation</Text>
                  <Text style={styles.heroSubtitle}>
                    Find the best crop for your soil and weather conditions.
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.inputPanel}>
              <TextInput
                style={styles.input}
                placeholder="Soil Type 🌱 (e.g. black, loam, clay)"
                value={soil}
                onChangeText={setSoil}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Temperature ☀️ (°C)"
                keyboardType="numeric"
                value={temperature}
                onChangeText={setTemperature}
              />
              <TextInput
                style={styles.input}
                placeholder="Rainfall 🌧️ (mm)"
                keyboardType="numeric"
                value={rainfall}
                onChangeText={setRainfall}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleRecommend}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Analyzing..." : "Recommend 🌾"}
                </Text>
              </TouchableOpacity>

              {loading && (
                <View style={{ marginTop: 10, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#2a9d8f" />
                  <Text style={styles.loadingText}>
                    Processing farm data...
                  </Text>
                </View>
              )}
            </View>

            <FlatList
              data={recommendedCrops}
              keyExtractor={(item: any) => item._id || item.name}
              contentContainerStyle={{ paddingBottom: 80, paddingTop: 12 }}
              renderItem={({ item }) => (
                <CropCard item={item} onSelect={handleSelect} />
              )}
              ListEmptyComponent={
                !loading && (
                  <Text style={styles.noCrop}>
                    🌱 Enter details and tap "Recommend" to begin!
                  </Text>
                )
              }
            />
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12 },
  heroContainer: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 14,
    elevation: 6,
  },
  heroBackground: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroOverlay: {
    backgroundColor: "rgba(255,255,255,0.25)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2a9d8f",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#222",
    textAlign: "center",
    opacity: 0.9,
  },

  inputPanel: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#a0c4b0",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#2a9d8f",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "bold" },
  loadingText: { textAlign: "center", color: "#045d56", marginTop: 5 },

  card: {
    width: "100%",
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#ffffffdd",
    elevation: 4,
  },
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  imageWrapper: {
  width: "100%",
  height: 180,
  marginBottom: 10,
},

  cropName: { fontSize: 16, fontWeight: "800", color: "#045d56", marginTop: 10 },
  relevance: { marginTop: 6, color: "#333" },
  badge: {
    backgroundColor: "#b5e48c",
    color: "#1b4332",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  buttonSmall: {
    backgroundColor: "#006d77",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonTextSmall: { color: "#fff", fontSize: 14, fontWeight: "700" },
  noCrop: { textAlign: "center", marginTop: 40, color: "#333", fontSize: 15 },
});
