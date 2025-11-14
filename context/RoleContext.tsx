// // context/RoleContext.tsx
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { createContext, useContext, useEffect, useState } from "react";

// type Role = "farmer" | "buyer" | "admin" | null;
// type RoleContextType = { role: Role; setRole: (r: Role) => Promise<void> | void; };

// const RoleContext = createContext<RoleContextType>({ role: null, setRole: async () => {} });

// export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [role, setRoleState] = useState<Role>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         const saved = await AsyncStorage.getItem("role");
//         if (saved) setRoleState(saved as Role);
//       } catch (e) {}
//     })();
//   }, []);

//   const setRole = async (r: Role) => {
//     setRoleState(r);
//     try {
//       if (r) await AsyncStorage.setItem("role", r);
//       else await AsyncStorage.removeItem("role");
//     } catch (e) {}
//   };

//   return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
// };

// export const useRole = () => useContext(RoleContext);
// context/RoleContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RoleType = "farmer" | "buyer" | "admin" | null;
type RoleCtx = { role: RoleType; setRole: (r: RoleType) => Promise<void>; clearRole: () => Promise<void> };

const KEY = "agro_role_v1";
const Ctx = createContext<RoleCtx | undefined>(undefined);

export const RoleProvider: React.FC<{ children: any }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleType>(null);
  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        if (v === "farmer" || v === "buyer" || v === "admin") setRoleState(v as RoleType);
      } catch (e) { console.warn("Role load failed", e); }
    })();
  }, []);
  const setRole = async (r: RoleType) => {
    if (r) await AsyncStorage.setItem(KEY, r);
    else await AsyncStorage.removeItem(KEY);
    setRoleState(r);
  };
  const clearRole = async () => { await AsyncStorage.removeItem(KEY); setRoleState(null); };
  return <Ctx.Provider value={{ role, setRole, clearRole }}>{children}</Ctx.Provider>;
};
export const useRole = () => { const c = useContext(Ctx); if (!c) throw new Error("useRole must be used inside RoleProvider"); return c; };
