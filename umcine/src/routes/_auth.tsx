import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuthStore } from "@/stores/auth-store";

// 로그인한 사용자만 접근할 수 있는 페이지들의 공통 Layout Route
// _로 시작하는 pathless 라우트라 URL에는 /_auth가 붙지 않음
export const Route = createFileRoute("/_auth")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});