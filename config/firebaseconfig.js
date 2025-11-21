// // config/firebaseConfig.ts
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyDWPYGCFd5Zy_EnKk1aKG8GZd_OjhRsAqE",
//   authDomain: "agrochain-4214c.firebaseapp.com",
//   projectId: "agrochain-4214c",
//   storageBucket: "agrochain-4214c.firebasestorage.app",
//   messagingSenderId: "314948052757",
//   appId: "1:314948052757:web:fd9c1aeb0f9573c8d56b1c",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// export default app;
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyDWPYGCFd5Zy_EnKk1aKG8GZd_OjhRsAqE",
//   authDomain: "agrochain-4214c.firebaseapp.com",
//   projectId: "agrochain-4214c",
//   storageBucket: "agrochain-4214c.firebasestorage.app",
//   messagingSenderId: "314948052757",
//   appId: "1:314948052757:web:fd9c1aeb0f9573c8d56b1c",
// };

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

// config/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWPYGCFd5Zy_EnKk1aKG8GZd_OjhRsAqE",
  authDomain: "agrochain-4214c.firebaseapp.com",
  projectId: "agrochain-4214c",
  storageBucket: "agrochain-4214c.firebasestorage.app",
  messagingSenderId: "314948052757",
  appId: "1:314948052757:web:fd9c1aeb0f9573c8d56b1c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

