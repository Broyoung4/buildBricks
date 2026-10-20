import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/images";

const StyledImage = styled(Image);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});

type UserRole = "buyer" | "seller" | "skilled-pro" | "logistics";

const roles: {
  id: UserRole;
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    id: "buyer",
    icon: "⌂",
    title: "I am a Buyer",
    description: "Plan a build, compare suppliers and hire trusted pros.",
  },
  {
    id: "seller",
    icon: "▤",
    title: "I am a Seller",
    description: "List materials, manage orders and grow your sales.",
  },
  {
    id: "skilled-pro",
    icon: "⚒",
    title: "I am a Skilled Pro",
    description: "Showcase your craft and find your next project.",
  },
  {
    id: "logistics",
    icon: "▰",
    title: "I provide Logistics",
    description: "Deliver building supplies and track your earnings.",
  },
];

export default function Onboarding() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");

  return (
    <View className="flex-1 bg-onboarding-background">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          className="flex-1 bg-onboarding-background"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          <StatusBar style="dark" />
          <View className="px-[9%] pb-8 pt-7">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-[42px] w-[42px] overflow-hidden rounded-[11px] bg-onboarding-logo-tile">
                  <StyledImage
                    source={images.buildbricksLogo}
                    contentFit="contain"
                    accessibilityLabel="BuildBricks logo"
                    className="absolute -left-6 -top-[17px] h-[90px] w-[90px]"
                  />
                </View>
                <View>
                  <Text className="font-brand-bold text-[14px] leading-[19px] text-onboarding-logo-title">
                    BuildBricks
                  </Text>
                  <Text className="font-brand-medium text-[9px] leading-[14px] tracking-[2px] text-onboarding-tagline">
                    BUILD WITH CONFIDENCE
                  </Text>
                </View>
              </View>
              <View className="rounded-full border border-onboarding-country-border bg-onboarding-card-background px-[11px] py-[5px]">
                <Text className="font-brand-medium text-[10px] leading-[15px] text-onboarding-country-text">
                  NIGERIA
                </Text>
              </View>
            </View>

            <View className="mt-8">
              <View className="self-start rounded-full bg-onboarding-badge-background px-[10px] py-[4px]">
                <Text className="font-brand-semibold text-[10px] leading-[14px] text-onboarding-badge-text">
                  YOUR BUILD, BETTER CONNECTED
                </Text>
              </View>
              <Text className="mt-[14px] font-brand-bold text-[27px] leading-[33px] text-onboarding-title">
                Welcome to{"\n"}BuildBricks
              </Text>
              <Text className="mt-2 font-brand text-[14px] leading-[23px] text-onboarding-body">
                Plan with clarity, compare with confidence, and find the right
                people to bring your project to life.
              </Text>
            </View>

            <View className="mb-2 mt-6 flex-row items-center justify-between">
              <Text className="font-brand-semibold text-[12px] leading-[18px] text-onboarding-section-title">
                How will you use BuildBricks?
              </Text>
              <Text className="font-brand text-[11px] leading-4 text-onboarding-helper-text">
                Choose one
              </Text>
            </View>

            <View className="gap-[9px]">
              {roles.map((role) => {
                const isSelected = selectedRole === role.id;

                return (
                  <Pressable
                    key={role.id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected }}
                    aria-checked={isSelected}
                    accessibilityLabel={`${role.title}. ${role.description}`}
                    onPress={() => setSelectedRole(role.id)}
                    className={`min-h-[76px] flex-row items-center gap-3 rounded-[18px] border px-3 py-[10px] ${
                      isSelected
                        ? "border-onboarding-selected-border bg-onboarding-selected-background"
                        : "border-onboarding-card-border bg-onboarding-card-background"
                    }`}
                  >
                    <View
                      className={`h-[38px] w-[38px] items-center justify-center rounded-[11px] ${
                        isSelected
                          ? "bg-onboarding-selected-icon-background"
                          : "bg-onboarding-icon-background"
                      }`}
                    >
                      <Text
                        className={`font-brand-medium text-[19px] leading-6 ${
                          isSelected
                            ? "text-onboarding-selected-icon"
                            : "text-onboarding-icon"
                        }`}
                      >
                        {role.icon}
                      </Text>
                    </View>
                    <View className="min-w-0 flex-1">
                      <Text className="font-brand-semibold text-[12px] leading-[18px] text-onboarding-role-title">
                        {role.title}
                      </Text>
                      <Text className="mt-1 font-brand text-[11px] leading-[17px] text-onboarding-role-description">
                        {role.description}
                      </Text>
                    </View>
                    <View
                      className={`h-[18px] w-[18px] items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-onboarding-selected-indicator bg-onboarding-selected-indicator"
                          : "border-onboarding-indicator-border bg-onboarding-card-background"
                      }`}
                    >
                      {isSelected ? (
                        <Text className="text-[12px] leading-4 text-onboarding-action-text">
                          ✓
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View className="mt-4 min-h-[52px] items-center justify-center rounded-[11px] bg-onboarding-action-background">
              <Text className="font-brand-semibold text-[13px] leading-5 text-onboarding-action-text">
                Create{" "}
                {selectedRole === "skilled-pro" ? "skilled pro" : selectedRole}{" "}
                account
              </Text>
            </View>

            <View className="mt-3 flex-row items-center justify-center gap-3">
              <Text className="font-brand text-[11px] leading-[17px] text-onboarding-role-description">
                Already have an account?
              </Text>
              <Text className="font-brand-semibold text-[11px] leading-[17px] text-onboarding-auth-action">
                Sign in
              </Text>
            </View>

            <View className="mx-1 mt-5 h-px bg-onboarding-divider" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
