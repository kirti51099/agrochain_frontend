// app/splash.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Splash() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(1)).current;

  // duration the splash stays visible (ms). Change this to make it longer/shorter.
  const VISIBLE_MS = 8000; // 8000 ms = 8 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      // fade out then navigate
      Animated.timing(opacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/onboarding");
      });
    }, VISIBLE_MS);

    return () => {
      clearTimeout(timer);
      opacity.stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // responsive logo size
  const logoSize = Math.min(320, Math.round(SCREEN_WIDTH * 0.7));

  // Tap to skip immediately
  const handleSkip = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => router.replace("/onboarding"));
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleSkip} style={styles.container}>
      <Animated.View style={[styles.wrap, { opacity }]}>
        <Image
          // <-- Make sure this path and file name exactly match your asset:
          // assets/images/logo.png
          source={require("../assets/images/logo.jpg")}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />

        <Text style={styles.title}>AgroChain</Text>
        <Text style={styles.subtitle}>Smart Farming & Crop Marketplace</Text>

        <ActivityIndicator
          size="large"
          color="#43A047"
          style={{ marginTop: 20 }}
        />

        <Text style={styles.hint}>Tap anywhere to skip</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F1F8E9" },
  wrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#33691E",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#4E6E33",
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: "#8AAE79",
  },
});
