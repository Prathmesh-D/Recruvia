import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Bangers } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { BrandingEdge } from "@/components/BrandingEdge";
import { GlobalLoader } from "@/components/GlobalLoader";
import { MotionLayoutProvider } from "@/components/MotionLayoutProvider";
import { Toaster } from "sonner";

const logoFont = localFont({
  src: "../fonts/GulfsDisplay-Normal.ttf",
  variable: "--font-logo-custom",
  display: "swap",
});

const headingFont = Bricolage_Grotesque({
  variable: "--font-heading-custom",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recruvia — Resume Screening Assistant",
  description:
    "Upload resumes, paste your Job Description, and get an organized list of candidates to help you screen applicants efficiently.",
  keywords: [
    "resume screening",
    "AI recruiting",
    "candidate ranking",
    "HR tool",
    "hiring",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${inter.variable} ${logoFont.variable} ${bangers.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-surface text-neutral-900 font-sans antialiased">
        <MotionLayoutProvider>
          <GlobalLoader />
          <BrandingEdge />
          <main className="flex-1 flex flex-col pt-16">{children}</main>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#fff',
                border: '1px solid #EFE6DE',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                color: '#1a1a1a',
                fontFamily: 'var(--font-inter)',
              },
              className: 'rounded-xl',
            }}
          />
        </MotionLayoutProvider>
      </body>
    </html>
  );
}
