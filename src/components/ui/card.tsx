import type { ReactNode } from "react";
import { View } from "react-native";

export type AppCardProps = {
  children: ReactNode;
  className?: string;
};

export function AppCard({ children, className = "" }: AppCardProps) {
  return (
    <View className={`design-surface p-5 ${className}`}>{children}</View>
  );
}
