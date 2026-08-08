"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import AuthRouter from "./AuthRouter";

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
  
  if (!appId) {
    console.error("Missing NEXT_PUBLIC_PRIVY_APP_ID in env.");
  }

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
