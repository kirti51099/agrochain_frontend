// components/themed-text.tsx
import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";

export type ThemedTextProps = TextProps & { type?: "default" | "title" | "link" };

export function ThemedText({ style, type = "default", ...rest }: ThemedTextProps) {
  const color = useThemeColor({}, "text");
  const typeStyle = type === "title" ? styles.title : styles.default;
  return <Text style={[{ color }, typeStyle, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: { fontSize: 16, lineHeight: 22 },
  title: { fontSize: 28, fontWeight: "700", lineHeight: 34 }
});
