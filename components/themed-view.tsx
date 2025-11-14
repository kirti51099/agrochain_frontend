// components/themed-view.tsx
import React from "react";
import { View, ViewProps } from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";

export type ThemedViewProps = ViewProps & { lightColor?: string; darkColor?: string };

export function ThemedView({ style, lightColor, darkColor, ...rest }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  return <View style={[{ backgroundColor }, style]} {...rest} />;
}
