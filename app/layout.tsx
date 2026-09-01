import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lance Achacoso | Full Stack & Systems Engineer",
  description: "Portfolio of Lance Achacoso. Showcasing Full Stack Web Development, API Troubleshooting, and System Administration.",
  // You can add keywords too!
  keywords: ["Lance Achacoso", "Full Stack Developer", "Technical Support", "Next.js", "React", "Cybersecurity"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col selection:bg-emerald-500/30 selection:text-emerald-600 dark:selection:text-emerald-400`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}