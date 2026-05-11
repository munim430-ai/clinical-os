import { ClinicalShell } from "@/components/layout/ClinicalShell";
import { signIn, signUp } from "@/lib/auth";
import { triggerSelectionHaptic } from "@/lib/clinical-haptics";
import { router } from "expo-router";
import { Eye, EyeOff, Pill } from "lucide-react";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Mode = "signin" | "signup" | "verify";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  async function handleSignIn() {
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      triggerSelectionHaptic();
      router.replace("/(tabs)/home/index" as any);
    } catch (e: any) {
      Alert.alert("Sign in failed", e?.message ?? "Check your credentials");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp() {
    if (!email.trim() || !password || !name.trim()) return;
    setLoading(true);
    try {
      const data = await signUp(email.trim(), password, name.trim());
      if (data?.requireEmailVerification) {
        setPendingEmail(email.trim());
        setMode("verify");
      } else {
        triggerSelectionHaptic();
        router.replace("/(tabs)/home/index" as any);
      }
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!code.trim()) return;
    setLoading(true);
    try {
      await signIn(pendingEmail, password);
      triggerSelectionHaptic();
      router.replace("/(tabs)/home/index" as any);
    } catch {
      Alert.alert(
        "Verification",
        "Enter the code from your email, then sign in.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ClinicalShell>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="mb-8 items-center">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-[28px] border border-border bg-ink-800">
              <Pill size={38} color="#C8F53C" strokeWidth={1.4} />
            </View>
            <Text className="font-heading text-[28px] text-text-primary">
              Clinical OS
            </Text>
            <Text className="mt-1 font-body text-[13px] text-text-muted">
              {mode === "signin"
                ? "Welcome back"
                : mode === "signup"
                  ? "Create your account"
                  : "Verify your email"}
            </Text>
          </View>

          {mode === "verify" ? (
            <View className="rounded-clinical border border-border bg-ink-800 p-5">
              <Text className="mb-4 font-body text-[13px] text-text-secondary">
                A 6-digit code was sent to {pendingEmail}. Enter it below, then
                sign in.
              </Text>
              <Field
                label="Verification code"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="number-pad"
              />
              <TouchableOpacity
                onPress={handleVerify}
                disabled={loading}
                className="mt-4 items-center rounded-clinical bg-mint py-4"
                activeOpacity={0.82}
              >
                {loading ? (
                  <ActivityIndicator color="#0C0C0E" />
                ) : (
                  <Text className="font-bodySemi text-[15px] text-text-inverse">
                    Continue
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMode("signin")}
                className="mt-3 items-center py-2"
              >
                <Text className="font-body text-[13px] text-text-muted">
                  Back to sign in
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="rounded-clinical border border-border bg-ink-800 p-5">
              {mode === "signup" ? (
                <Field
                  label="Full name"
                  value={name}
                  onChangeText={setName}
                  placeholder="Dr. Jane Smith"
                />
              ) : null}
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View className="relative">
                <Field
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min 6 characters"
                  secureTextEntry={!showPass}
                  last
                />
                <TouchableOpacity
                  onPress={() => setShowPass((v) => !v)}
                  className="absolute right-0 bottom-3"
                  hitSlop={10}
                >
                  {showPass ? (
                    <EyeOff size={18} color="#505058" strokeWidth={1.6} />
                  ) : (
                    <Eye size={18} color="#505058" strokeWidth={1.6} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={mode === "signin" ? handleSignIn : handleSignUp}
                disabled={loading}
                className="mt-5 items-center rounded-clinical bg-mint py-4"
                activeOpacity={0.82}
              >
                {loading ? (
                  <ActivityIndicator color="#0C0C0E" />
                ) : (
                  <Text className="font-bodySemi text-[15px] text-text-inverse">
                    {mode === "signin" ? "Sign in" : "Create account"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  triggerSelectionHaptic();
                  setMode(mode === "signin" ? "signup" : "signin");
                }}
                className="mt-3 items-center py-2"
                activeOpacity={0.78}
              >
                <Text className="font-body text-[13px] text-text-muted">
                  {mode === "signin"
                    ? "No account? Sign up"
                    : "Already registered? Sign in"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              triggerSelectionHaptic();
              router.replace("/(tabs)/home/index" as any);
            }}
            className="mt-4 items-center py-2"
            activeOpacity={0.78}
          >
            <Text className="font-body text-[12px] text-text-muted">
              Continue without account
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ClinicalShell>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  last = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  last?: boolean;
}) {
  return (
    <View className={`py-3 ${last ? "" : "border-b border-border-soft"}`}>
      <Text className="mb-1 font-body text-[11px] text-text-muted">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#505058"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "sentences"}
        autoCorrect={false}
        selectionColor="#C8F53C"
        className="font-body text-[15px] text-text-primary"
      />
    </View>
  );
}
