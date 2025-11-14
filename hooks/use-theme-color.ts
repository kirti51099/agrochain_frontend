// hooks/use-theme-color.ts
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

export function useThemeColor(props: { light?: string; dark?: string } = {}, key: keyof typeof Colors.light) {
  const theme = useColorScheme() === "dark" ? "dark" : "light";
  const fromProps = theme === "light" ? props.light : props.dark;
  if (fromProps) return fromProps;
  return (Colors as any)[theme][key];
}
