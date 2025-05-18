"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-black text-gray-300 pt-16 pb-10 overflow-hidden">
      {/* Floating Neon Line */}
       <motion.div
        className="absolute top-0 md:left-[47%] left-[40%]  transform -translate-x-1/2  w-[100px] h-1 bg-red-500 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      ></motion.div>   

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3">
              <motion.img 
                src="/favicon - Copy.PNG" 
                alt="XATUN Logo" 
                className="w-12 h-12"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <h2 className="text-white text-3xl font-extrabold tracking-wider">XATUN</h2>
            </div>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Elevating your style with premium apparel. Designed for the bold and fearless.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold pb-2 border-b border-gray-700 w-fit">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-gray-400 text-sm">
              {[
                { name: "Home", link: "/" },
                { name: "Cart", link: "/cart" },
                { name: "Men", link: "/men" },
                { name: "Contact", link: "/contact" }
              ].map((item) => (
                <motion.li key={item.name} whileHover={{ x: 5, color: "#fff" }} transition={{ duration: 0.3 }}>
                  <a href={item.link} className="hover:text-white transition-all duration-300">{item.name}</a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white text-lg font-semibold pb-2 border-b border-gray-700 w-fit">Customer Service</h3>
            <ul className="mt-4 space-y-3 text-gray-400 text-sm">
              {[
                { name: "FAQs", link: "/faqs" },
                { name: "Shipping & Returns", link: "/shipping-returns" },
                { name: "Privacy Policy", link: "/privacy-policy" },
                { name: "Terms & Conditions", link: "/terms" }
              ].map((item) => (
                <motion.li key={item.name} whileHover={{ x: 5, color: "#fff" }} transition={{ duration: 0.3 }}>
                  <a href={item.link} className="hover:text-white transition-all duration-300">{item.name}</a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Media */}   
          <div>
            <h3 className="text-white text-lg font-semibold pb-2 border-b border-gray-700 w-fit">Follow Us</h3>
            <div className="mt-4 flex space-x-5">
              {[
                // { icon: <FaFacebookF />, link: "https://facebook.com/XATUN" },
                // { icon: <FaTwitter />, link: "https://twitter.com/XATUN" },
                { icon: <FaInstagram />, link: "https://www.instagram.com/xatun.streetwear" },
                { icon: <FaYoutube />, link: "https://www.youtube.com/channel/UCUy8eG5a4TaWBauw6SjFmOA" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-2xl transition-transform transform hover:scale-125"
                  whileHover={{ 
                    color: "#fff", 
                    textShadow: "0px 0px 10px rgba(255,255,255,0.8)", 
                    rotate: 10 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div className="relative z-10 mt-16">
        <h3 className="text-center text-white text-2xl font-semibold">Find Us Here</h3>
        <div className="mt-6 w-full flex justify-center">
          <motion.div 
            className="w-full md:w-3/4 lg:w-2/3 h-72 overflow-hidden rounded-lg shadow-lg border-4 border-gray-700"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,255,255,0.3)" }}
            transition={{ duration: 0.4 }}
          >
            <iframe 
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d14390.551410307156!2d85.11930308424316!3d25.61694753425904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sxatun!5e0!3m2!1sen!2sin!4v1739905189375!5m2!1sen!2sin" 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-12 text-center text-sm border-t border-gray-700 pt-6">
        <p className="text-gray-500">© {new Date().getFullYear()} XATUN. All rights reserved.</p>
        <p className="text-gray-400 mt-2">
          Designed by{" "}
          <a
            href="https://api.whatsapp.com/send/?phone=918008439762&text=Wanna talk to You Form the website(xatun.in) &type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 font-semibold underline"
          >
            Thilak-c
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
