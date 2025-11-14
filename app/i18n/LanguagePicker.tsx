// app/i18n/LanguagePicker.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useLanguage } from "./LanguageContext";

export default function LanguagePicker() {
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, language === "en" && styles.active]}
        onPress={() => changeLanguage("en")}
      >
        <Text style={[styles.text, language === "en" && styles.activeText]}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, language === "mr" && styles.active]}
        onPress={() => changeLanguage("mr")}
      >
        <Text style={[styles.text, language === "mr" && styles.activeText]}>मराठी</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: 8, marginVertical: 8 },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  active: { backgroundColor: "#2E7D32" },
  text: { color: "#000", fontWeight: "700" },
  activeText: { color: "#fff" },
});
