import { Inter, Poppins } from 'next/font/google';
import "./globals.css";
import Footer from "@/components/footer";
import { Navbar } from "@/components/Navbar.jsx";
// import { SessionProvider } from 'next-auth/react';
import Providers from './providers';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ContentWrapper from "@/components/ContentWrapper";
import LoadingOverride from "@/components/LoadingOverride";

// Font configurations
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'XATUN',
  description: 'Your trusted online shopping destination',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <LoadingProvider>
          <Providers>
            <LoadingSpinner />
            <ContentWrapper>
              <Navbar />
              {children}
              <ToastContainer />
              <Footer />
            </ContentWrapper>
          </Providers>
          {/* <LoadingOverride /> */}
        </LoadingProvider>
      </body>
    </html>
  );
}
