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
// app/constants/backend.ts
// constants/backend.ts
import { Platform } from "react-native";
const LAN_IP = "10.24.203.176"; // your machine IP
export const BACKEND_BASE =
  Platform.OS === "android"
    ? `http://${LAN_IP}:4001`  // android emulator / device
    : `http://${LAN_IP}:4001`; // iOS simulator or device (when testing on LAN)

//   IPv4 Address. . . . . . . . . . . : 10.24.203.176