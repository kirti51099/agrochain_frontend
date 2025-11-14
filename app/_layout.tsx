// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { RoleProvider } from "../context/RoleContext"; // no .tsx extension
import LanguageProvider from "./i18n/LanguageContext";

export default function Layout() {
  return (
    <RoleProvider>
      <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
      </LanguageProvider>
    </RoleProvider>
  );
}
