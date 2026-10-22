import { useLocalSearchParams } from "expo-router";
import { AuthScreen } from "../../components/auth/auth-screen";

export default function SignUp() {
  const { role } = useLocalSearchParams<{ role?: string }>();

  return <AuthScreen mode="sign-up" role={role} />;
}
