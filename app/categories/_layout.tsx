// app/categories/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function CategoriesLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#2e7d32",
        headerStyle: { backgroundColor: "#f1f8f4" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Categories" }} />
      <Stack.Screen name="details" options={{ title: "Category Details" }} />
      
    </Stack>
  );
}
