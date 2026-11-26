"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  // 페이지에 있는 동안 401로 토큰이 지워져도 로그인 페이지로 이동
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) router.replace("/login");
  }, [accessToken, router]);

  if (!accessToken) return null;

  // 하위 페이지(/me, /me/edit)를 이 자리에 렌더링
  return <>{children}</>;
}