import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./provider";
import { Toaster } from "@/components/ui/toaster";

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "HarmonyHub",
    description: "Communication Platform",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
            <body className={font.className}>
                <ReduxProvider>
                    {children}
                    <Toaster />
                </ReduxProvider>
            </body>
        </html>
    );
}
