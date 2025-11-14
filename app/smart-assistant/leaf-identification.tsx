// app/leaf-identification.tsx
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BACKEND_BASE } from "../../constants/backend";



export default function LeafIdentification() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [record, setRecord] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!uploading) Animated.timing(progress, { toValue: 0, duration: 250, useNativeDriver: false }).start();
  }, [uploading]);

  const setProgress = (value: number) => Animated.timing(progress, { toValue: value, duration: 400, useNativeDriver: false }).start();

  async function pickImage() {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission required", "Please grant photo library permission.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true });
      const cancelled = (res as any).cancelled ?? (res as any).canceled;
      if (!cancelled) {
        const uri = (res as any).uri ?? (res as any)?.assets?.[0]?.uri;
        setImageUri(uri);
        setRecord(null);
        setError(null);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open gallery.");
    }
  }

  async function takePhoto() {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Permission required", "Please grant camera permission.");
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
      const cancelled = (res as any).cancelled ?? (res as any).canceled;
      if (!cancelled) {
        const uri = (res as any).uri ?? (res as any)?.assets?.[0]?.uri;
        setImageUri(uri);
        setRecord(null);
        setError(null);
      }
    } catch (e) {
      Alert.alert("Error", "Could not open camera.");
    }
  }

  async function uploadAndIdentify() {
    if (!imageUri) { Alert.alert("No image", "Pick or take a photo first."); return; }
    setUploading(true); setError(null); setRecord(null); setProgress(0.15);
    try {
      const parts = imageUri.split("/");
      const name = parts[parts.length - 1];
      const match = /\.(\w+)$/.exec(name);
      const ext = match ? match[1].toLowerCase() : "jpg";
      const mime = ext === "png" ? "image/png" : "image/jpeg";

      const form = new FormData();
      form.append("image", {
        uri: Platform.OS === "android" ? imageUri : imageUri.replace("file://", ""),
        name,
        type: mime,
      } as any);

      setProgress(0.35);

      const res = await fetch(`${BACKEND_BASE}/api/images/upload`, { method: "POST", headers: { "Content-Type": "multipart/form-data" }, body: form as any });
      const text = await res.text();
      let json: any = null;
      try { json = JSON.parse(text); } catch { json = null; }
      if (!res.ok) { setUploading(false); setError((json && json.message) || `Upload failed (${res.status})`); Alert.alert("Upload failed", error || "Server error"); return; }

      const rec = (json && (json.record || json)) || null;
      if (!rec) { setUploading(false); setError("No record returned from server"); return; }

      setRecord(rec);
      if (!rec.diagnosis || rec.diagnosis === "Pending" || rec.apiResponse?.status === "pending") {
        setPolling(true);
        // poll up to ~36s
        for (let i = 0; i < 12; i++) {
          await new Promise((r) => setTimeout(r, 3000));
          try {
            const chk = await fetch(`${BACKEND_BASE}/api/images/${rec._id || rec.id}`);
            const jr = await chk.json();
            setRecord(jr);
            setProgress(0.6 + ((i + 1) / 12) * 0.35);
            if (jr.diagnosis && jr.diagnosis !== "Pending" && jr.apiResponse?.status !== "pending") {
              setPolling(false); setUploading(false); setProgress(1); return;
            }
          } catch (e) { console.warn("poll error", e); }
        }
        setPolling(false); setUploading(false); setProgress(0.95); Alert.alert("Timed out", "Identification is taking longer than expected.");
      } else { setProgress(1); setUploading(false); }
    } catch (err: any) {
      setError(err.message || "Upload failed"); setUploading(false); setPolling(false);
    } finally { setTimeout(() => setProgress(0), 800); }
  }

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  const suggestions = (record && (record.apiResponse?.suggestions || record.apiResponse?.data?.suggestions || []))
    ? (record.apiResponse?.suggestions || record.apiResponse?.data?.suggestions).slice(0, 3).map((s: any, idx: number) => ({
      id: `${idx}-${s.plant_name || (s.plant && s.plant.scientific_name) || "Unknown"}`,
      name: s.plant_name || (s.plant && s.plant.scientific_name) || "Unknown",
      confidence: typeof s.probability === "number" ? Math.round(s.probability * 100) : null,
      wiki: (s.plant && s.plant.wiki_description && s.plant.wiki_description.value) || null,
    })) : [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }} />
        <View style={styles.hero}>
          <Image source={require("../../assets/images/hero_leaf.jpg")} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Snap a leaf. Get quick AI help.</Text>
            <Text style={styles.heroSubtitle}>Identify plants and check their health — fast and easy.</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} onPress={pickImage}>
            <FontAwesome5 name="images" size={28} color="#fff" />
            <Text style={styles.actionTitle}>Pick Photo</Text>
            <Text style={styles.actionSub}>From gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={takePhoto}>
            <MaterialCommunityIcons name="camera-iris" size={28} color="#fff" />
            <Text style={styles.actionTitle}>Take Photo</Text>
            <Text style={styles.actionSub}>Using camera</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.cta, uploading && { opacity: 0.8 }]} onPress={uploadAndIdentify} disabled={uploading}>
          {uploading ? <View style={styles.ctaInner}><ActivityIndicator color="#fff" style={{ marginRight: 10 }} /><Text style={styles.ctaText}>{polling ? "Analyzing..." : "Uploading..."}</Text></View> : <View style={styles.ctaInner}><Text style={styles.ctaText}>Upload & Identify</Text></View>}
        </TouchableOpacity>

        <View style={styles.previewBox}>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.previewImage} /> :
            <View style={styles.previewEmpty}><Feather name="image" size={36} color="#6b7280" /><Text style={styles.previewText}>No image selected</Text></View>}
        </View>

        <View style={styles.progressWrap}><Animated.View style={[styles.progressBar, { width: progressWidth }]} /></View>

        <View style={styles.resultCard}>
          <Text style={styles.resultHeading}>Result</Text>
          {!record && <Text style={styles.muted}>Nothing uploaded yet — try Upload & Identify.</Text>}
          {record && <>
            <Text style={styles.small}>ID: <Text style={styles.mono}>{record._id ?? record.id}</Text></Text>
            <Text style={styles.small}>Filename: <Text style={styles.mono}>{record.filename}</Text></Text>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.label}>Top suggestions</Text>
              {suggestions.length === 0 && <Text style={styles.muted}>No suggestions yet. Try a clearer leaf photo.</Text>}
              {suggestions.map((s: any) => (<View key={s.id} style={styles.suggestion}><Text style={styles.suggestName}>{s.name}</Text><Text style={styles.suggestConf}>{s.confidence ? `${s.confidence}%` : "-"}</Text></View>))}
            </View>

            {suggestions[0] && suggestions[0].wiki ? (<View style={styles.wikiBox}><Text style={styles.wikiTitle}>About {suggestions[0].name}</Text><Text style={styles.wikiText} numberOfLines={4}>{suggestions[0].wiki}</Text></View>) : null}

            <View style={{ marginTop: 12 }}>
              <TouchableOpacity style={styles.viewBtn} onPress={() => {
                if (record && record.url) {
                  const full = BACKEND_BASE + record.url;
                  Alert.alert("Uploaded image URL", full);
                }
              }}>
                <Text style={styles.viewBtnText}>View Uploaded Image</Text>
              </TouchableOpacity>
            </View>
          </>}
          {error && <Text style={[styles.muted, { marginTop: 8, color: "#b00020" }]}>{error}</Text>}
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipTitle}>Tips for good photos</Text>
          <View style={styles.tipRow}><Feather name="check-circle" size={16} color="#2f855a" /><Text style={styles.tipText}> Use a single leaf on plain background</Text></View>
          <View style={styles.tipRow}><Feather name="check-circle" size={16} color="#2f855a" /><Text style={styles.tipText}> Ensure good lighting and focus</Text></View>
          <View style={styles.tipRow}><Feather name="check-circle" size={16} color="#2f855a" /><Text style={styles.tipText}> Avoid hands or clutter around leaf</Text></View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6fff7" },
  container: { padding: 16, alignItems: "center" },
  hero: { width: "100%", height: 300, marginBottom: 25, borderRadius: 25, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 10, marginTop: -40 },
  heroImage: { flex: 1, width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)", paddingVertical: 40, paddingHorizontal: 22, alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 26, color: "#fff", fontWeight: "700", textAlign: "center", marginBottom: 8 },
  heroSubtitle: { fontSize: 17, color: "#e0e0e0", textAlign: "center", lineHeight: 24, maxWidth: "90%" },

  actionRow: { flexDirection: "row", width: "100%", justifyContent: "space-between", marginBottom: 12 },
  actionCard: { width: "48%", backgroundColor: "#2f8f73", padding: 14, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 6 }, shadowRadius: 8, elevation: 4 },
  actionTitle: { color: "#fff", fontWeight: "800", marginTop: 8 },
  actionSub: { color: "#d5f4e1", marginTop: 4 },

  cta: { width: "100%", backgroundColor: "#f06b4d", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginBottom: 12 },
  ctaInner: { flexDirection: "row", alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  previewBox: { width: "100%", height: 240, backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", justifyContent: "center", alignItems: "center", marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 6 },
  previewImage: { width: "100%", height: "100%", resizeMode: "cover" },
  previewEmpty: { justifyContent: "center", alignItems: "center", backgroundColor: "#f1f9f4", width: "100%", height: "100%", borderRadius: 20, borderWidth: 2, borderStyle: "dashed", borderColor: "#a7e2b2" },
  previewText: { color: "#6b7280", marginTop: 8, fontSize: 14, fontWeight: "500" },

  progressWrap: { width: "100%", height: 6, backgroundColor: "#eef7ef", borderRadius: 6, overflow: "hidden", marginBottom: 12 },
  progressBar: { height: "100%", backgroundColor: "#2f8f73" },

  resultCard: { width: "100%", backgroundColor: "#fff", borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4 },
  resultHeading: { fontSize: 18, fontWeight: "800", color: "#1b4332", marginBottom: 8 },
  muted: { color: "#6b7280" },
  small: { color: "#333", marginTop: 6 },
  mono: { fontFamily: Platform.OS === "android" ? "monospace" : "Courier", color: "#444" },

  label: { fontWeight: "700", marginBottom: 6 },
  suggestion: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f5f7f5" },
  suggestName: { fontWeight: "800", color: "#0f5132" },
  suggestConf: { color: "#2f8f73", fontWeight: "800" },

  wikiBox: { marginTop: 10, padding: 10, backgroundColor: "#f7fff7", borderRadius: 10 },
  wikiTitle: { fontWeight: "800", marginBottom: 6 },
  wikiText: { color: "#333" },

  viewBtn: { backgroundColor: "#1b6b5b", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  viewBtnText: { color: "#fff", fontWeight: "800" },

  tips: { marginTop: 12, width: "100%" },
  tipTitle: { fontWeight: "800", color: "#0f5132", marginBottom: 8 },
  tipRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  tipText: { marginLeft: 8, color: "#2d3748" },
});
