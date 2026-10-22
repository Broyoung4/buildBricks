import { useAuth, useSignIn, useSignUp, useSSO } from "@clerk/expo";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants/images";

const StyledImage = styled(Image);

type AuthMode = "sign-in" | "sign-up";
type UserRole = "buyer" | "seller" | "skilled-pro" | "logistics";

type AuthScreenProps = {
  mode: AuthMode;
  role?: string | string[];
};

const roleLabels: Record<UserRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  "skilled-pro": "Skilled Pro",
  logistics: "Logistics",
};

function isUserRole(role: string): role is UserRole {
  return Object.keys(roleLabels).includes(role);
}

function isValidSignUpPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9\s]/.test(password)
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  otpOverlay: {
    ...StyleSheet.absoluteFill,
    color: "transparent",
    opacity: 0.02,
  },
});

export function AuthScreen({ mode, role }: AuthScreenProps) {
  const verificationInput = useRef<TextInput>(null);
  const passwordInput = useRef<TextInput>(null);
  const { isLoaded } = useAuth();
  const { signIn, errors: signInErrors } = useSignIn();
  const { signUp, errors: signUpErrors } = useSignUp();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerificationVisible, setIsVerificationVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const normalizedRole = Array.isArray(role) ? role[0] : role;
  const roleLabel = normalizedRole && isUserRole(normalizedRole) ? roleLabels[normalizedRole] : undefined;
  const isSignUp = mode === "sign-up";

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (!error || typeof error !== "object") {
      return fallback;
    }

    const maybeMessage = "message" in error ? error.message : undefined;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeErrors = "errors" in error ? error.errors : undefined;
    if (Array.isArray(maybeErrors) && maybeErrors.length > 0) {
      const firstError = maybeErrors[0];
      if (firstError && typeof firstError === "object" && "message" in firstError) {
        const message = firstError.message;
        if (typeof message === "string" && message.trim()) {
          return message;
        }
      }
    }

    return fallback;
  };

  const navigateAfterAuth = () => {
    router.replace("/");
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const trimmedEmail = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setEmailError("Enter a valid email address to continue.");
        return;
      }

      clearErrors();

      if (!password.trim()) {
        setPasswordError(isSignUp ? "Create a password to continue." : "Enter your password to continue.");
        return;
      }

      if (isSignUp) {
        if (!isValidSignUpPassword(password)) {
          setPasswordError(
            "Use at least 8 characters, including an uppercase letter, a number, and a special character.",
          );
          return;
        }

        const result = await signUp.create({ emailAddress: trimmedEmail, password });
        if (result.error) {
          setEmailError(getErrorMessage(result.error, "Unable to create your account. Please try again."));
          return;
        }

        const verificationResult = await signUp.verifications.sendEmailCode();
        if (verificationResult.error) {
          setEmailError(getErrorMessage(verificationResult.error, "Unable to send the verification code."));
          return;
        }

        setVerificationCode("");
        setIsVerificationVisible(true);
        return;
      }

      const result = await signIn.password({ emailAddress: trimmedEmail, password });
      if (result.error) {
        const message = getErrorMessage(result.error, "Incorrect email or password.");
        setPasswordError(message);
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: navigateAfterAuth });
        return;
      }

      if (signIn.status === "needs_second_factor") {
        setPasswordError("Additional verification is required before you can continue.");
        return;
      }
      setPasswordError("Unable to complete sign-in. Please try again.");
    } catch (error) {
      const fallback = isSignUp
        ? "Unable to create your account. Please try again."
        : "Unable to sign in. Please check your connection and try again.";
      const message = getErrorMessage(error, fallback);
      if (isSignUp) {
        setEmailError(message);
      } else {
        setPasswordError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(digits);
    setVerificationError("");
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setVerificationError("Enter the 6-digit verification code.");
      return;
    }

    setVerificationError("");
    setIsVerifying(true);

    try {
      const verificationResult = await signUp.verifications.verifyEmailCode({ code: verificationCode });
      if (verificationResult.error) {
        setVerificationError(
          getErrorMessage(verificationResult.error, "The verification code is invalid or expired."),
        );
        return;
      }

      if (signUp.status !== "complete") {
        const missingRequirements = signUp.missingFields
          .map((field) => field.replaceAll("_", " "))
          .join(", ");
        setVerificationError(
          missingRequirements
            ? `Your email is verified, but your account still requires: ${missingRequirements}.`
            : "Your email is verified, but account setup is not complete. Please try again.",
        );
        return;
      }

      const finalizeResult = await signUp.finalize();
      if (finalizeResult.error) {
        setVerificationError(
          getErrorMessage(finalizeResult.error, "Unable to finish account setup. Please try again."),
        );
        return;
      }

      Keyboard.dismiss();
      setIsVerificationVisible(false);
      router.replace("/");
    } catch (error) {
      setVerificationError(
        getErrorMessage(error, "We couldn't verify your code right now. Check your connection and try again."),
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        navigateAfterAuth();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Social sign-in is unavailable right now.";
      Alert.alert("Sign in unavailable", message);
    }
  };

  const closeVerification = () => {
    Keyboard.dismiss();
    setIsVerificationVisible(false);
  };

  const switchMode = () => {
    const params = normalizedRole && isUserRole(normalizedRole) ? { role: normalizedRole } : undefined;
    router.replace(isSignUp ? { pathname: "/sign-in", params } : { pathname: "/sign-up", params });
  };

  const authButtonText = isSignUp ? "Create account" : "Sign in";

  return (
    <View className="flex-1 bg-[#F6F8F6]">
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-[460px] self-center px-[9%] pb-8 pt-7">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-[42px] w-[42px] overflow-hidden rounded-[11px] bg-[#E7F1E9]">
                  <StyledImage
                    source={images.buildbricksLogo}
                    contentFit="contain"
                    accessibilityLabel="BuildBricks logo"
                    className="absolute -left-6 -top-[17px] h-[90px] w-[90px]"
                  />
                </View>
                <View>
                  <Text className="font-brand-bold text-[14px] leading-[19px] text-[#1D2A23]">
                    BuildBricks
                  </Text>
                  <Text className="font-brand-medium text-[9px] leading-[14px] tracking-[2px] text-[#7C8982]">
                    BUILD WITH CONFIDENCE
                  </Text>
                </View>
              </View>
              <View className="rounded-full border border-[#DDE7E0] bg-white px-[11px] py-[5px]">
                <Text className="font-brand-medium text-[10px] leading-[15px] text-[#46755D]">
                  NIGERIA
                </Text>
              </View>
            </View>

            <View className="mt-8">
              {roleLabel ? (
                <Text className="mb-2 font-brand-semibold text-[11px] uppercase leading-4 tracking-[1.2px] text-[#287C57]">
                  {roleLabel} account
                </Text>
              ) : null}
              <Text className="font-brand-bold text-[25px] leading-[33px] text-[#29362F]">
                {isSignUp ? "Create your account" : "Welcome back"}
              </Text>
              <Text className="mt-2 font-brand text-[14px] leading-[23px] text-[#65736B]">
                {isSignUp ? "Sign up with your email to get started." : "Sign in to your account with your email."}
              </Text>
            </View>

            <View className="mt-8">
              <View
                className={`min-h-[62px] flex-row items-center gap-3 rounded-[14px] border bg-white px-4 ${
                  emailError ? "border-[#D02C2C]" : "border-[#D7E0DA]"
                }`}
              >
                <Text accessible={false} className="font-brand-semibold text-[18px] text-[#37745C]">
                  ✉
                </Text>
                <TextInput
                  accessibilityLabel="Email address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  className="min-h-[58px] flex-1 font-brand text-[15px] text-[#29362F]"
                  keyboardType="email-address"
                  onBlur={() => {
                    if (!email.trim()) {
                      setEmailError("");
                    }
                  }}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                  onSubmitEditing={() => {
                    passwordInput.current?.focus();
                  }}
                  placeholder="Email address"
                  placeholderTextColor="#87938C"
                  returnKeyType="next"
                  textContentType="emailAddress"
                  underlineColorAndroid="transparent"
                  value={email}
                />
              </View>

              <View
                className={`mt-3 min-h-[62px] flex-row items-center gap-3 rounded-[14px] border bg-white px-4 ${
                  passwordError ? "border-[#D02C2C]" : "border-[#D7E0DA]"
                }`}
              >
                <Text accessible={false} className="font-brand-semibold text-[18px] text-[#37745C]">
                  •
                </Text>
                <TextInput
                  ref={passwordInput}
                  accessibilityLabel={isSignUp ? "Create password" : "Password"}
                  autoCapitalize="none"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  className="min-h-[58px] flex-1 font-brand text-[15px] text-[#29362F]"
                  onChangeText={(value) => {
                    setPassword(value);
                    if (passwordError) {
                      setPasswordError("");
                    }
                  }}
                  onSubmitEditing={() => void handleSubmit()}
                  placeholder={isSignUp ? "Create a password" : "Password"}
                  placeholderTextColor="#87938C"
                  returnKeyType="done"
                  secureTextEntry={!isPasswordVisible}
                  textContentType={isSignUp ? "newPassword" : "password"}
                  underlineColorAndroid="transparent"
                  value={password}
                />
                {password ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
                    accessibilityState={{ selected: isPasswordVisible }}
                    className="h-11 w-11 items-center justify-center"
                    onPress={() => setIsPasswordVisible((visible) => !visible)}
                  >
                    <View
                      className={`relative h-[13px] w-[20px] items-center justify-center rounded-full border-[1.5px] ${
                        isPasswordVisible ? "border-[#28745A]" : "border-[#65736B]"
                      }`}
                    >
                      <View
                        className={`h-[5px] w-[5px] rounded-full ${
                          isPasswordVisible ? "bg-[#28745A]" : "bg-[#65736B]"
                        }`}
                      />
                      {!isPasswordVisible ? (
                        <View className="absolute h-[1.5px] w-[23px] rotate-45 bg-[#65736B]" />
                      ) : null}
                    </View>
                  </Pressable>
                ) : !isSignUp ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Forgot password"
                    className="min-h-11 justify-center"
                    onPress={() => Alert.alert("Password reset", "Password reset is not connected yet.")}
                  >
                    <Text className="font-brand text-[12px] text-[#46755D]">Forgot password?</Text>
                  </Pressable>
                ) : null}
              </View>

              {passwordError ? (
                <Text accessibilityRole="alert" className="mt-2 font-brand text-[12px] leading-[18px] text-[#B42318]">
                  {passwordError}
                </Text>
              ) : null}
              {emailError ? (
                <Text accessibilityRole="alert" className="mt-2 font-brand text-[12px] leading-[18px] text-[#B42318]">
                  {emailError}
                </Text>
              ) : null}
              {signInErrors && signInErrors?.fields?.identifier && signInErrors.fields.identifier.message !== passwordError && signInErrors.fields.identifier.message !== emailError ? (
                <Text accessibilityRole="alert" className="mt-2 font-brand text-[12px] leading-[18px] text-[#B42318]">
                  {signInErrors.fields.identifier.message}
                </Text>
              ) : null}
              {signUpErrors && signUpErrors?.fields?.emailAddress && signUpErrors.fields.emailAddress.message !== emailError ? (
                <Text accessibilityRole="alert" className="mt-2 font-brand text-[12px] leading-[18px] text-[#B42318]">
                  {signUpErrors.fields.emailAddress.message}
                </Text>
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={authButtonText}
              className={`mt-6 min-h-[58px] items-center justify-center rounded-[13px] bg-[#28745A] active:bg-[#1F624B] ${
                isSubmitting ? "opacity-60" : ""
              }`}
              onPress={() => void handleSubmit()}
              disabled={!isLoaded || isSubmitting}
            >
              <Text className="font-brand-semibold text-[15px] leading-5 text-white">
                {authButtonText}
              </Text>
            </Pressable>

            <View nativeID="clerk-captcha" />

            <View className="my-7 flex-row items-center gap-3">
              <View className="h-px flex-1 bg-[#DDE5DF]" />
              <Text className="font-brand text-[13px] leading-5 text-[#7A8880]">
                Or continue with
              </Text>
              <View className="h-px flex-1 bg-[#DDE5DF]" />
            </View>

            <View className="gap-3">
              <Pressable
                accessibilityRole="button"
                className="min-h-[62px] flex-row items-center justify-center gap-3 rounded-[14px] border border-[#DDE5DF] bg-white active:bg-[#F5F8F6]"
                onPress={() => void handleSocialAuth("oauth_google")}
              >
                <Text className="font-brand-bold text-[20px] leading-6 text-[#4285F4]">G</Text>
                <Text className="font-brand text-[15px] leading-5 text-[#39463F]">
                  Continue with <Text className="font-brand-semibold">Google</Text>
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                className="min-h-[62px] flex-row items-center justify-center gap-3 rounded-[14px] border border-[#DDE5DF] bg-white active:bg-[#F5F8F6]"
                onPress={() => void handleSocialAuth("oauth_apple")}
              >
                <Text className="font-brand text-[15px] leading-5 text-[#39463F]">
                  Continue with <Text className="font-brand-semibold">Apple</Text>
                </Text>
              </Pressable>
            </View>

            <View className="mt-10 flex-row items-center justify-center gap-1">
              <Text className="font-brand text-[13px] leading-5 text-[#7A8880]">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </Text>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={isSignUp ? "Sign in" : "Create an account"}
                onPress={switchMode}
                className="min-h-11 justify-center px-1"
              >
                <Text className="font-brand-semibold text-[13px] leading-5 text-[#28745A]">
                  {isSignUp ? "Sign in" : "Create an account"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="fade"
        onRequestClose={closeVerification}
        statusBarTranslucent
        transparent
        visible={isVerificationVisible}
        onShow={() => verificationInput.current?.focus()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View className="absolute inset-0 bg-black/45" />
          <View className="rounded-[22px] bg-white px-5 pb-6 pt-5">
            <View className="flex-row items-start justify-between">
              <View className="mr-5 flex-1">
                <Text className="font-brand-bold text-[21px] leading-[29px] text-[#29362F]">
                  Check your email
                </Text>
                <Text className="mt-2 font-brand text-[13px] leading-[20px] text-[#65736B]">
                  We sent a verification code to {email.trim()}. Enter the 6-digit code below.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close verification"
                className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F2]"
                onPress={closeVerification}
              >
                <Text className="font-brand text-[22px] leading-6 text-[#526158]">×</Text>
              </Pressable>
            </View>

            <View className="relative mt-5 flex-row justify-between gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <View
                  key={index}
                  className={`h-[54px] min-w-0 flex-1 items-center justify-center rounded-[12px] border ${
                    verificationCode.length === index ? "border-[#28745A] bg-[#F6FAF7]" : "border-[#D7E0DA] bg-white"
                  }`}
                >
                  <Text className="font-brand-semibold text-[20px] leading-7 text-[#29362F]">
                    {verificationCode[index] ?? ""}
                  </Text>
                </View>
              ))}
              <TextInput
                ref={verificationInput}
                accessibilityHint="Enter the six-digit email verification code."
                accessibilityLabel="6-digit verification code"
                autoFocus
                caretHidden
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={handleVerificationCodeChange}
                onSubmitEditing={() => {
                  if (verificationCode.length === 6) {
                    void handleVerifyCode();
                  }
                }}
                selectionColor="transparent"
                style={styles.otpOverlay}
                textContentType="oneTimeCode"
                value={verificationCode}
              />
            </View>

            {verificationError ? (
              <Text
                accessibilityRole="alert"
                className="mt-3 font-brand text-[12px] leading-[18px] text-[#B42318]"
              >
                {verificationError}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              className={`mt-5 min-h-[52px] items-center justify-center rounded-[12px] bg-[#28745A] active:bg-[#1F624B] ${
                isVerifying ? "opacity-60" : ""
              }`}
              onPress={() => void handleVerifyCode()}
              disabled={isVerifying}
            >
              <Text className="font-brand-semibold text-[15px] leading-5 text-white">
                {isVerifying ? "Verifying..." : "Verify"}
              </Text>
            </Pressable>

            <Text className="mt-4 text-center font-brand text-[12px] leading-[18px] text-[#7A8880]">
              Didn’t receive a code? Check your email address and try again.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
