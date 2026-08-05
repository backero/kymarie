import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Kumarie account to track orders and manage your addresses.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
