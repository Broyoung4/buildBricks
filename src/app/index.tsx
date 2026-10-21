import { ScrollView, Text, View } from "react-native";
import { Link } from "expo-router";
import { themeColors } from "../theme";
import { AppButton, AppCard, AppHeading } from "../components/ui";

const primaryColors = [
  { name: "Build Green", hex: themeColors.brand.primary },
  { name: "Sky Blue", hex: themeColors.brand.sky },
  { name: "Deep Sea", hex: themeColors.brand.deep },
  { name: "Orange", hex: themeColors.brand.orange },
];

const semanticColors = [
  { name: "Success", hex: themeColors.semantic.success },
  { name: "Warning", hex: themeColors.semantic.warning },
  { name: "Streak", hex: themeColors.semantic.streak },
  { name: "Error", hex: themeColors.semantic.error },
  { name: "Info", hex: themeColors.semantic.info },
];

const neutralColors = [
  { name: "Text / Primary", hex: themeColors.neutral.text.primary },
  { name: "Text / Secondary", hex: themeColors.neutral.text.secondary },
  { name: "Border", hex: themeColors.neutral.border },
  { name: "Surface", hex: themeColors.neutral.surface },
  { name: "Background", hex: themeColors.neutral.background },
];

const font = {
  regular: "Plus Jakarta Sans",
  medium: "Plus Jakarta Sans Medium",
  semibold: "Plus Jakarta Sans SemiBold",
  bold: "Plus Jakarta Sans Bold",
};

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-[#F3F2F0]">
      <View className="p-4">
        <AppHeading level={1} className="text-2xl font-bold text-primary">
          BUILDBRICKS
        </AppHeading>
        <Link href="/onboarding" asChild>
          <AppButton className="mt-4" accessibilityLabel="Open onboarding">
            Get started with BuildBricks
          </AppButton>
        </Link>
      </View>
    </ScrollView>
  );
}
