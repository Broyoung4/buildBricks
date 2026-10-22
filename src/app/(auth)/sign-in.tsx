import { useLocalSearchParams } from "expo-router";
import { AuthScreen } from "../../components/auth/auth-screen";

export default function SignIn() {
  const { role } = useLocalSearchParams<{ role?: string }>();

  return <AuthScreen mode="sign-in" role={role} />;
}
