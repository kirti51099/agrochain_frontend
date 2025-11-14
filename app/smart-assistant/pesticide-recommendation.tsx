// app/smart-assistant/pesticide-recommendation.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Reads disease from AsyncStorage (set by disease screen).
 * Attractive cards, fallback and sample button included.
 */

const RECOMMENDATIONS: Record<string, any> = {
  "powdery mildew": {
    pesticides: ["Myclobutanil (follow label)", "Sulfur spray"],
    organic: ["Baking soda + soap spray", "Prune infected parts & burn carefully"],
    notes: "Apply in evenings. Rotate active ingredients to avoid resistance.",
  },
  aphids: {
    pesticides: ["Imidacloprid (label guidance)", "Lambda-cyhalothrin"],
    organic: ["Soap + water spray", "Introduce ladybugs or neem oil applications"],
    notes: "Avoid spraying during peak pollinator activity.",
  },
  "late blight": {
    pesticides: ["Mancozeb (follow label)", "Copper oxychloride"],
    organic: ["Remove infected plants, increase airflow", "Use copper-based organic protectants"],
    notes: "Quarantine infected plots and avoid overhead irrigation.",
  },
};

export default function PesticideRecommendation() {
  const [loading, setLoading] = useState(true);
  const [disease, setDisease] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  function lookup(d?: string | null) {
    if (!d) { setResult(null); return; }
    const key = d.toLowerCase().trim();
    if (RECOMMENDATIONS[key]) { setResult({ key, ...RECOMMENDATIONS[key] }); return; }
    const found = Object.keys(RECOMMENDATIONS).find(k => key.includes(k) || k.includes(key));
    if (found) { setResult({ key: found, ...RECOMMENDATIONS[found] }); return; }
    setResult(null);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = (await AsyncStorage.getItem("pesticide_disease")) ?? "";
        console.log("pesticide: AsyncStorage disease ->", stored);
        if (mounted && stored && stored.trim().length > 0) {
          setDisease(stored);
          lookup(stored);
        } else {
          setDisease(null);
          setResult(null);
        }
      } catch (e) {
        console.warn("pesticide read failed", e);
        setDisease(null);
        setResult(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#064e3b" /></View>;

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Animated.View entering={FadeIn}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="bug-check" size={36} color="#064e3b" />
          <Text style={styles.title}>Pesticide & Remedy Recommendations</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Detected disease</Text>
          <Text style={styles.disease}>{disease ?? "Not provided"}</Text>
        </View>

        {result ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recommended Pesticides</Text>
              {result.pesticides.map((p: string, i: number) => (
                <Text key={i} style={styles.item}>• {p}</Text>
              ))}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Organic / Cultural</Text>
              {result.organic.map((o: string, i: number) => (
                <Text key={i} style={styles.item}>• {o}</Text>
              ))}
              {result.notes ? <Text style={styles.notes}>{result.notes}</Text> : null}
            </View>
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.muted}>No exact recommendation found for this disease.</Text>
            <Text style={{ marginTop: 8 }}>Try:</Text>
            <Text style={styles.item}>• Upload a clearer leaf photo</Text>
            <Text style={styles.item}>• Try a more general disease name</Text>

            <TouchableOpacity style={[styles.sampleBtn]} onPress={async () => {
              try {
                await AsyncStorage.setItem("pesticide_disease", "Aphids");
                const stored = await AsyncStorage.getItem("pesticide_disease");
                setDisease(stored);
                lookup(stored);
              } catch (e) {
                Alert.alert("Error", "Could not set sample disease");
              }
            }}>
              <Text style={styles.sampleBtnText}>Use sample (Aphids)</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 18, backgroundColor: "#f7fff7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "900", color: "#064e3b" },
  infoCard: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#e6f3ea" },
  label: { color: "#5b6b63", fontSize: 12 },
  disease: { marginTop: 6, fontSize: 16, fontWeight: "800", color: "#0a7a58" },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginTop: 12, borderWidth: 1, borderColor: "#eef7ef" },
  cardTitle: { fontWeight: "800", color: "#0a7a58", marginBottom: 8 },
  item: { marginTop: 6, color: "#333" },
  notes: { marginTop: 8, color: "#444", fontStyle: "italic" },
  muted: { color: "#6b7280" },
  sampleBtn: { marginTop: 12, backgroundColor: "#10B981", padding: 10, borderRadius: 10, alignItems: "center" },
  sampleBtnText: { color: "#fff", fontWeight: "800" },
});
