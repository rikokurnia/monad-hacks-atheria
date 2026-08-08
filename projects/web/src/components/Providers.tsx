"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import AuthRouter from "./AuthRouter";

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmsk6rsk701u30cjzuw5iy9pd";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["wallet", "email"],
        appearance: {
          theme: "light",
          accentColor: "#0891b2", // Cyan 600
          logo: "https://cryptologos.cc/logos/monad-logo.png",
        },
      }}
    >
      <AuthRouter>
        {children}
      </AuthRouter>
    </PrivyProvider>
  );
}
