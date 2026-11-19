import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";

export function AuthLayout() {
  // 페이지에 있는 동안 401로 토큰이 지워져도 로그인 페이지로 이동
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) return <Navigate to="/login" />;

  // 하위 페이지(/me, /me/edit)를 이 자리에 렌더링
  return <Outlet />;
}