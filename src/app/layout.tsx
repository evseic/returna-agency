import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "EmailFlow | El. pašto klientų išlaikymo sistemos",
  description: "The inbox that earns.",
  keywords: ["klientų išlaikymas", "el. pašto rinkodara", "marketingo automatizavimas", "naujienlaiškiai", "vietinis verslas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className={`${inter.variable} ${spaceGrotesk.variable} scroll-smooth`}>
      <body className="font-sans bg-surface text-on-surface antialiased">
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.omnisend = window.omnisend || [];
              window.omnisend.push(["brandID", "6a32ec1f813d927fc4a68725"]);
              window.omnisend.push(["track", "$pageViewed"]);
              !function(){var e=document.createElement("script");
              e.type="text/javascript",e.async=!0,
              e.src="https://omnisnippet1.com/inshop/launcher-v2.js";
              var t=document.getElementsByTagName("script")[0];
              t.parentNode.insertBefore(e,t)}();
            `,
          }}
        />
      </body>
    </html>
  );
}
