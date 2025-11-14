// import { useRouter } from "expo-router";
// import React, { useRef, useState } from "react";
// import {
//   Dimensions,
//   Image,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useLanguage } from "./i18n/LanguageContext"; // ✅ added
// import LanguagePicker from "./i18n/LanguagePicker"; // ✅ added

// const { width, height } = Dimensions.get("window");

// export default function OnboardingScreen() {
//   const router = useRouter();
//   const scrollRef = useRef<ScrollView | null>(null);
//   const [index, setIndex] = useState(0);
//   const { t } = useLanguage(); // ✅ translation hook

//   const slides = [
//     {
//       key: "logo",
//       image: require("../assets/images/logo.jpg"),
//       title: `${t("welcome")} ${t("appName")}`,
//       subtitle: "Smart farming in your pocket",
//     },
//     {
//       key: "slide1",
//       image: require("../assets/images/onboarding1.jpg"),
//       title: t("smartAssistant"),
//       subtitle: t("cropRecommendation"),
//     },
//     {
//       key: "slide2",
//       image: require("../assets/images/onboarding2.jpg"),
//       title: t("diseaseDetection"),
//       subtitle: t("pesticideRecommendation"),
//     },
//     {
//       key: "slide3",
//       image: require("../assets/images/onboarding3.jpg"),
//       title: "Market Access",
//       subtitle: "Connect with buyers and sell your produce at fair prices.",
//     },
//     {
//       key: "slide4",
//       image: require("../assets/images/onboarding4.jpg"),
//       title: t("getStarted"),
//       subtitle: "Join AgroChain and grow smarter today.",
//     },
//   ];

//   function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
//     const x = e.nativeEvent.contentOffset.x;
//     const newIndex = Math.round(x / width);
//     if (newIndex !== index) setIndex(newIndex);
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         ref={scrollRef}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//         contentContainerStyle={{ alignItems: "center" }}
//       >
//         {slides.map((s, i) => (
//           <View key={s.key} style={[styles.slide, { width }]}>
//             <Image
//               source={s.image}
//               style={i === 0 ? styles.logoImage : styles.image}
//               resizeMode={i === 0 ? "contain" : "cover"}
//             />
//             <Text style={styles.title}>{s.title}</Text>
//             <Text style={styles.subtitle}>{s.subtitle}</Text>

//             {i === slides.length - 1 ? (
//               <>
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={() => router.replace("/select-role")}
//                 >
//                   <Text style={styles.buttonText}>{t("getStarted")}</Text>
//                 </TouchableOpacity>
//                 <LanguagePicker /> {/* ✅ language switch */}
//               </>
//             ) : null}
//           </View>
//         ))}
//       </ScrollView>

//       {/* pagination dots */}
//       <View style={styles.dots}>
//         {slides.map((_, i) => (
//           <View
//             key={i}
//             style={[styles.dot, index === i ? styles.dotActive : undefined]}
//           />
//         ))}
//       </View>

//       {/* Skip / Next controls */}
//       <View style={styles.controls}>
//         {index < slides.length - 1 ? (
//           <>
//             <TouchableOpacity
//               onPress={() => router.replace("/select-role")}
//               style={styles.controlBtn}
//             >
//               <Text style={styles.controlText}>Skip</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 const next = Math.min(index + 1, slides.length - 1);
//                 scrollRef.current?.scrollTo({ x: next * width, animated: true });
//                 setIndex(next);
//               }}
//               style={[
//                 styles.controlBtn,
//                 { backgroundColor: "#2E7D32", borderRadius: 20, paddingHorizontal: 14 },
//               ]}
//             >
//               <Text style={[styles.controlText, { color: "#fff" }]}>Next</Text>
//             </TouchableOpacity>
//           </>
//         ) : null}
//       </View>
//     </View>
//   );
// }

// const { width: w, height: h } = Dimensions.get("window");
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#E8F5E9" },
//   slide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
//   logoImage: { width: w * 0.6, height: h * 0.35, marginBottom: 18 },
//   image: { width: w * 0.9, height: h * 0.45, marginBottom: 18, borderRadius: 12 },
//   title: { fontSize: 24, fontWeight: "800", color: "#1B5E20", marginTop: 6, textAlign: "center" },
//   subtitle: { fontSize: 15, color: "#555", textAlign: "center", marginTop: 8, paddingHorizontal: 8 },
//   button: { marginTop: 28, backgroundColor: "#43A047", paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   dots: { position: "absolute", bottom: 110, left: 0, right: 0, flexDirection: "row", justifyContent: "center" },
//   dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#cfd8ce", marginHorizontal: 6 },
//   dotActive: { backgroundColor: "#1B5E20", width: 14, height: 8, borderRadius: 8 },
//   controls: { position: "absolute", bottom: 30, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   controlBtn: { paddingHorizontal: 16, paddingVertical: 8 },
//   controlText: { color: "#2E7D32", fontWeight: "700" },
// });
// app/onboarding.tsx
// app/onboarding.tsx
// app/onboarding.tsx
// app/onboarding.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import LanguagePicker from "./i18n/LanguagePicker";
import { useLanguage } from "./i18n/LanguageContext";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const scrollRef = useRef<ScrollView | null>(null);
  const [index, setIndex] = useState(0);

  const slides = [
    {
      key: "logo",
      image: require("../assets/images/logo.jpg"),
      title: `${t("welcome")} ${t("appName")}`,
      subtitle: t("getStarted"),
    },
    {
      key: "slide1",
      image: require("../assets/images/onboarding1.jpg"),
      title: t("smartAssistant"),
      subtitle: t("cropRecommendation"),
    },
    {
      key: "slide2",
      image: require("../assets/images/onboarding2.jpg"),
      title: t("diseaseDetection"),
      subtitle: t("pesticideRecommendation"),
    },
    {
      key: "slide3",
      image: require("../assets/images/onboarding3.jpg"),
      title: t("marketAccess") ?? "Market Access",
      subtitle: t("marketSubtitle") ?? "Connect with buyers and sell your produce at fair prices.",
    },
    {
      key: "slide4",
      image: require("../assets/images/onboarding4.jpg"),
      title: t("getStarted"),
      subtitle: t("joinNow") ?? "Join AgroChain and grow smarter today.",
    },
  ];

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / width);
    if (newIndex !== index) setIndex(newIndex);
  }

  return (
    <View style={styles.container}>
      {/* Language picker at top-right so user can switch immediately */}
      <View style={styles.langContainer}>
        <LanguagePicker />
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {slides.map((s, i) => (
          <View key={s.key} style={[styles.slide, { width }]}>
            <Image
              source={s.image}
              style={i === 0 ? styles.logoImage : styles.image}
              resizeMode={i === 0 ? "contain" : "cover"}
            />
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.subtitle}>{s.subtitle}</Text>

            {i === slides.length - 1 && (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.button}
                onPress={() => {
                  // optionally set AsyncStorage 'hasSeenOnboarding' here
                  router.replace("/select-role");
                }}
              >
                <Text style={styles.buttonText}>{t("getStarted")}</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, index === i ? styles.dotActive : undefined]} />
        ))}
      </View>

      <View style={styles.controls}>
        {index < slides.length - 1 ? (
          <>
            <TouchableOpacity onPress={() => router.replace("/select-role")} style={styles.controlBtn}>
              <Text style={styles.controlText}>{t("skip") ?? "Skip"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const next = Math.min(index + 1, slides.length - 1);
                scrollRef.current?.scrollTo({ x: next * width, animated: true });
                setIndex(next);
              }}
              style={[styles.controlBtn, { backgroundColor: "#2E7D32", borderRadius: 20, paddingHorizontal: 14 }]}
            >
              <Text style={[styles.controlText, { color: "#fff" }]}>{t("next") ?? "Next"}</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E8F5E9" },
  slide: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  logoImage: { width: width * 0.6, height: height * 0.35, marginBottom: 18 },
  image: { width: width * 0.9, height: height * 0.45, marginBottom: 18, borderRadius: 12 },
  title: { fontSize: 24, fontWeight: "800", color: "#1B5E20", marginTop: 6, textAlign: "center" },
  subtitle: { fontSize: 15, color: "#555", textAlign: "center", marginTop: 8, paddingHorizontal: 8 },
  button: { marginTop: 28, backgroundColor: "#43A047", paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // language container (top-right)
  langContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 14,
    zIndex: 20,
  },

  dots: { position: "absolute", bottom: 110, left: 0, right: 0, flexDirection: "row", justifyContent: "center" },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#cfd8ce", marginHorizontal: 6 },
  dotActive: { backgroundColor: "#1B5E20", width: 14, height: 8, borderRadius: 8 },
  controls: { position: "absolute", bottom: 30, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  controlBtn: { paddingHorizontal: 16, paddingVertical: 8 },
  controlText: { color: "#2E7D32", fontWeight: "700" },
});
