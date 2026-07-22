import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ChatProvider } from "@/components/arbio-chat";
import { PasswordGate } from "@/components/password-gate";
import { LanguageProvider } from "@/components/lang";

export const metadata: Metadata = {
  title: "Arbio Property Owner App",
  description: "Property Owner App Mockup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full">
        <LanguageProvider>
          <PasswordGate>
            <ChatProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 min-w-0">{children}</main>
              </div>
            </ChatProvider>
          </PasswordGate>
        </LanguageProvider>
      </body>
    </html>
  );
}
