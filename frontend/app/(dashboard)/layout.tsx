import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeProvider>
  );
}
