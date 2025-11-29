"use client";
import ReduxProvider from "@/app/ReduxProvider";
import { AppProvider } from "../context/AuthContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </AppProvider>
  );
}
