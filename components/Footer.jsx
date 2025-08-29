"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUp,
  Heart,
  Shield,
  Truck,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement newsletter subscription
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Returns", href: "/returns" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
    ],
    categories: [
      { name: "Men's Clothing", href: "/men" },
      { name: "Footwear", href: "/shoes" },
      { name: "Accessories", href: "/accessories" },
      { name: "New Arrivals", href: "/new-arrivals" },
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/xatun", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/xatun", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/xatun", color: "hover:text-pink-500" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/xatun", color: "hover:text-red-600" },
  ];

  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Secure Shopping",
      description: "100% secure payment processing"
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Fast Delivery",
      description: "Free shipping on orders above ₹999"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Easy Returns",
      description: "30-day return policy"
    }
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/favicon - Copy.PNG" 
                  alt="XATUN Logo" 
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  XATUN
                </span>
              </div>
              
              <p className="text-muted-foreground mb-6 max-w-md">
                Discover the essence of streetwear culture. Premium quality, bold designs, and authentic style that defines your individuality.
              </p>

              {/* Newsletter Subscription */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Stay Updated</h4>
                <form onSubmit={handleNewsletterSubscribe} className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button type="submit" size="sm">
                    Subscribe
                  </Button>
                </form>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600 mt-2"
                  >
                    Thank you for subscribing!
                  </motion.p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={cn(
                        "p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200",
                        social.color
                      )}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-border"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h5 className="font-semibold text-foreground">{feature.title}</h5>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span>© {currentYear} XATUN. All rights reserved.</span>
              <span>•</span>
              <span>Made with <Heart className="w-4 h-4 inline text-red-500" /> in India</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 mx-auto" />
      </motion.button>
    </footer>
  );
};

export default Footer;