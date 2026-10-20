import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

export type AppButtonVariant = "primary" | "secondary" | "ghost";

export type AppButtonProps = {
  children: ReactNode;
  variant?: AppButtonVariant;
  className?: string;
  textClassName?: string;
} & React.ComponentProps<typeof Pressable>;

const baseStyles = "items-center justify-center rounded-xl px-4 py-3";

const variantStyles: Record<AppButtonVariant, string> = {
  primary: "bg-[#006241]",
  secondary: "bg-[#E9EBED]",
  ghost: "border border-[#E4E7EA] bg-transparent",
};

const variantText: Record<AppButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-[#122428]",
  ghost: "text-[#122428]",
};

export function AppButton({
  children,
  variant = "primary",
  className = "",
  textClassName = "",
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <Text
        style={{ fontFamily: "Plus Jakarta Sans SemiBold" }}
        className={`${variantText[variant]} text-[14px] ${textClassName}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}
