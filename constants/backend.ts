// // constants/backend.ts
// export const BACKEND_BASE = "http://10.88.137.176:4000";
// // app/constants/backend.ts
// // import { Platform } from "react-native";

// // // If testing on Android emulator use 10.0.2.2; on iOS simulator localhost; on physical phone use your computer IP.
// // const LAN_IP = "10.88.137.176"; // <-- your machine IP

// // export const BACKEND_BASE =
// //   Platform.OS === "android"
// //     ? "http://10.0.2.2:4000"               // Android emulator
// //     : `http://${LAN_IP}:4000`;            // iOS simulator or real device using LAN_IP

// // If you run the app on a real phone with Expo Go, ensure your phone is on same network and use `http://${LAN_IP}:4000`.


// app/constants/backend.ts
// // app/constants/backend.ts
// // constants/backend.ts
// import { Platform } from "react-native";
// import Constants from "expo-constants";

// // Override via Expo env when available (works both in dev + builds)
// const ENV_BASE = process.env.EXPO_PUBLIC_BACKEND_BASE?.trim();

// const LAN_IP = "10.59.206.176"; // <- update this whenever your IPv4 changes
// const DEFAULT_LAN = `http://${LAN_IP}:4001`;
// const ANDROID_EMULATOR = "http://10.0.2.2:4001";
// const LOCALHOST = "http://localhost:4001";    //10.161.121.176

// const isExpoGo = Constants.appOwnership === "expo";
// const isAndroid = Platform.OS === "android";
// const isWeb = Platform.OS === "web";

// // Heuristic: Expo Go + Android + not running on a real device => emulator
// const isAndroidEmulator = isAndroid && (!Constants.isDevice || Constants.systemName?.toLowerCase().includes("sdk"));

// const autoBase = (() => {
//   if (ENV_BASE) return ENV_BASE;
//   if (isWeb) return LOCALHOST;
//   if (isAndroidEmulator) return ANDROID_EMULATOR;
//   return DEFAULT_LAN;
// })();

// export const BACKEND_BASE = autoBase;


// import { Platform } from "react-native";
// import Constants from "expo-constants";

// // Your laptop IP address

// export const BACKEND_BASE = "http://10.59.206.176:4001";
// const PORT = 4001;

// // Base URLs
// const DEFAULT_LAN = `http://${LAN_IP}:${PORT}`;
// const ANDROID_EMULATOR = `http://10.0.2.2:${PORT}`;
// const LOCALHOST = `http://localhost:${PORT}`;

// // Platform checks
// const isAndroid = Platform.OS === "android";
// const isWeb = Platform.OS === "web";

// // Detect Android Emulator
// const isAndroidEmulator =
//   isAndroid &&
//   (!Constants.isDevice || Constants.systemName?.toLowerCase().includes("sdk"));

// // Auto select backend URL
// const autoBase = (() => {
//   if (isWeb) return LOCALHOST;
//   if (isAndroidEmulator) return ANDROID_EMULATOR;
//   return DEFAULT_LAN;
// })();

// // Export final backend base URL
// export const BACKEND_BASE = autoBase;


// constants/backend.ts

export const BACKEND_BASE = "http://10.59.206.176:4001";
