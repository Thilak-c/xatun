import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { Navbar } from "@/components/Navbar.jsx";
// import { SessionProvider } from 'next-auth/react';
import Providers from './providers';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Xatun – Where Fashion Meets Fantasy",
  description: "Step into the enchanting world of Xatun, where ancient legends meet modern design. Inspired by the mythical realm of Xatun, our clothing brand offers one-of-a-kind, fantasy-inspired apparel that blends timeless aesthetics with contemporary trends. From intricately designed capes to rugged, earthy textures, each piece is crafted to tell a story and empower you to embrace your individuality.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>

          <Navbar />
          {children}
          <ToastContainer />
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
