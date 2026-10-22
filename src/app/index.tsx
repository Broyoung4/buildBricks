import { useAuth, useClerk, useUser } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  const handleSignOut = async () => {
    await signOut();
    router.replace("/onboarding");
  };

  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "there";

  return (
    <View className="flex-1 bg-[#F6F8F6] px-[9%] pb-8 pt-7">
      <View className="mt-6 rounded-[22px] border border-[#DDE7E0] bg-white p-5 shadow-sm">
        <Text className="font-brand-semibold text-[11px] uppercase tracking-[1.4px] text-[#287C57]">
          BuildBricks
        </Text>
        <Text className="mt-3 font-brand-bold text-[30px] leading-[38px] text-[#29362F]">
          Welcome back, {displayName}
        </Text>
        <Text className="mt-2 font-brand text-[14px] leading-[23px] text-[#65736B]">
          Your workspace is ready. Continue planning materials, comparing sellers, and managing your build.
        </Text>

        <View className="mt-6 rounded-[16px] bg-[#EEF7F0] p-4">
          <Text className="font-brand-semibold text-[12px] uppercase tracking-[1.2px] text-[#287C57]">
            Account status
          </Text>
          <Text className="mt-2 font-brand text-[15px] leading-[22px] text-[#29362F]">
            Signed in and ready to continue.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={() => void handleSignOut()}
          className="mt-6 min-h-[52px] items-center justify-center rounded-[12px] bg-[#28745A]"
        >
          <Text className="font-brand-semibold text-[15px] leading-5 text-white">Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}
