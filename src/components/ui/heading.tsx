import type { ReactNode } from "react";
import { Text } from "react-native";

export type AppHeadingProps = {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
};

const fonts = {
  1: "Plus Jakarta Sans Bold",
  2: "Plus Jakarta Sans SemiBold",
  3: "Plus Jakarta Sans SemiBold",
  4: "Plus Jakarta Sans Medium",
} as const;

const sizes = {
  1: "text-[32px] leading-[38px]",
  2: "text-[24px] leading-[31px]",
  3: "text-[20px] leading-[26px]",
  4: "text-[16px] leading-[22px]",
} as const;

export function AppHeading({
  children,
  level = 2,
  className = "",
}: AppHeadingProps) {
  return (
    <Text
      style={{ fontFamily: fonts[level] }}
      className={`${sizes[level]} text-[#122428] ${className}`}
    >
      {children}
    </Text>
  );
}
