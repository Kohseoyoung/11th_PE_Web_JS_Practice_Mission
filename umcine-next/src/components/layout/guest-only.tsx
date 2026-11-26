"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

// 이미 로그인했으면 로그인 페이지 대신 홈으로
export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) router.replace("/");
  }, [accessToken, router]);

  if (accessToken) return null;
  return <>{children}</>;
}