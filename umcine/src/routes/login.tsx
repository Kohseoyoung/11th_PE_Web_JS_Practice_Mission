import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/auth/login-page";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (useAuthStore.getState().accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});