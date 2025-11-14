// app/buyer/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function BuyerLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="products" options={{ title: "Marketplace" }} />
      <Stack.Screen name="product-details" options={{ title: "Product" }} />
      <Stack.Screen name="cart" options={{ title: "My Cart" }} />
      <Stack.Screen name="orders" options={{ title: "Orders" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}
