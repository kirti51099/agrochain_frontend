// app/i18n/LanguagePicker.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLanguage } from "./LanguageContext";

export default function LanguagePicker() {
  const { language, changeLanguage } = useLanguage();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.btn, language === "en" && styles.active]}
        onPress={() => changeLanguage("en")}
        activeOpacity={0.7}
      >
        <Feather name="globe" size={16} color={language === "en" ? "#fff" : "#2E7D32"} />
        <Text style={[styles.text, language === "en" && styles.activeText]}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, language === "mr" && styles.active]}
        onPress={() => changeLanguage("mr")}
        activeOpacity={0.7}
      >
        <Feather name="globe" size={16} color={language === "mr" ? "#fff" : "#2E7D32"} />
        <Text style={[styles.text, language === "mr" && styles.activeText]}>मराठी</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: "row", 
    justifyContent: "center", 
    gap: 12, 
    marginVertical: 8,
    alignItems: "center"
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  active: { 
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  text: { 
    color: "#333", 
    fontWeight: "700",
    fontSize: 14
  },
  activeText: { 
    color: "#fff" 
  },
});
