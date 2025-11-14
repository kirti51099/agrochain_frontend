// app/i18n/LanguageContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "./i18n";

type LanguageContextValue = {
  language: string;
  changeLanguage: (lang: "en" | "mr") => Promise<void>;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>(i18n.getLocale());

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("appLanguage");
        if (saved === "mr" || saved === "en") {
          i18n.setLocale(saved);
          setLanguage(saved);
        } else {
          // if no saved lang, keep default 'en'
          i18n.setLocale("en");
          setLanguage("en");
        }
      } catch (e) {
        // ignore and keep defaults
        i18n.setLocale("en");
        setLanguage("en");
      }
    })();
  }, []);

  const changeLanguage = async (lang: "en" | "mr") => {
    i18n.setLocale(lang);
    setLanguage(lang);
    try {
      await AsyncStorage.setItem("appLanguage", lang);
    } catch {
      // ignore write errors
    }
  };

  const value: LanguageContextValue = {
    language,
    changeLanguage,
    t: i18n.t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
};
