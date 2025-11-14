// app/smart-assistant/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function SmartAssistantLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="crop-recommendation" options={{ title: "Crop Recommendation" }} />
      <Stack.Screen name="disease-detection" options={{ title: "Disease Detection" }} />
      <Stack.Screen name="leaf-identification" options={{ title: "Leaf Identification" }} />
      <Stack.Screen name="pesticide-recommendation" options={{ title: "Pesticide Recommendation" }} />
    </Stack>
  );
}
