import { AuthLayout } from "@/components/layout/auth-layout";
export default function Layout({ children }: LayoutProps<"/">) {
  return <AuthLayout>{children}</AuthLayout>;
}