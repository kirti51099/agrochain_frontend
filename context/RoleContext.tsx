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
type User = { name?: string; email?: string; role?: RoleType } | null;
type RoleCtx = { 
  role: RoleType; 
  user: User;
  setRole: (r: RoleType) => Promise<void>; 
  setUser: (u: User) => Promise<void>;
  clearRole: () => Promise<void> 
};

const KEY = "agro_role_v1";
const USER_KEY = "agro_user_v1";
const Ctx = createContext<RoleCtx | undefined>(undefined);

export const RoleProvider: React.FC<{ children: any }> = ({ children }) => {
  const [role, setRoleState] = useState<RoleType>(null);
  const [user, setUserState] = useState<User>(null);
  
  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        if (v === "farmer" || v === "buyer" || v === "admin") setRoleState(v as RoleType);
        
        const userName = await AsyncStorage.getItem("user_name");
        const userEmail = await AsyncStorage.getItem("user_email");
        if (userName || userEmail) {
          setUserState({ name: userName || undefined, email: userEmail || undefined, role: v as RoleType || undefined });
        }
      } catch (e) { console.warn("Role load failed", e); }
    })();
  }, []);
  
  const setRole = async (r: RoleType) => {
    if (r) await AsyncStorage.setItem(KEY, r);
    else await AsyncStorage.removeItem(KEY);
    setRoleState(r);
  };
  
  const setUser = async (u: User) => {
    if (u) {
      if (u.name) await AsyncStorage.setItem("user_name", u.name);
      if (u.email) await AsyncStorage.setItem("user_email", u.email);
      setUserState(u);
    } else {
      await AsyncStorage.removeItem("user_name");
      await AsyncStorage.removeItem("user_email");
      setUserState(null);
    }
  };
  
  const clearRole = async () => { 
    await AsyncStorage.removeItem(KEY);
    await AsyncStorage.removeItem("user_name");
    await AsyncStorage.removeItem("user_email");
    setRoleState(null);
    setUserState(null);
  };
  
  return <Ctx.Provider value={{ role, user, setRole, setUser, clearRole }}>{children}</Ctx.Provider>;
};
export const useRole = () => { const c = useContext(Ctx); if (!c) throw new Error("useRole must be used inside RoleProvider"); return c; };
