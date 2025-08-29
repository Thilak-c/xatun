"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  User,
  Building,
  Globe,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Contact information
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["hello@xatun.com", "support@xatun.com"],
      description: "We'll get back to you within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 98765 43211"],
      description: "Available Monday to Friday, 9 AM - 6 PM"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["123 Fashion Street", "Mumbai, Maharashtra 400001"],
      description: "Come explore our collection in person"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      description: "Closed on Sundays and public holidays"
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'My Orders' section, or by using the tracking number sent to your email."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused items in their original packaging. Return shipping is free for orders above ₹999."
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently, we only ship within India. We're working on expanding our international shipping options."
    },
    {
      question: "How can I change or cancel my order?",
      answer: "Orders can be modified or cancelled within 2 hours of placement. Contact our customer service team immediately for assistance."
    }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setSubmitStatus('success');
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-900/10"
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Have questions about our products or need assistance? We're here to help you 
              find the perfect streetwear style that matches your personality.
            </p>
            
            {/* Quick Contact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-8 text-center"
            >
              <div>
                <div className="text-3xl font-bold text-primary">24h</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">7/7</div>
                <div className="text-muted-foreground">Days Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-muted-foreground">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the most convenient way to get in touch with our team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {info.title}
                </h3>
                <div className="space-y-2 mb-3">
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-foreground font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you as soon as possible. 
                We typically respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Company and Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                      Company (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter company name"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What's this about?"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg rounded-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Message...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Send Message
                    </div>
                  )}
                </Button>

                {/* Submit Status */}
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-center gap-2 p-4 rounded-lg",
                      submitStatus === 'success' 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    )}
                  >
                    {submitStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>
                      {submitStatus === 'success' 
                        ? "Message sent successfully! We'll get back to you soon." 
                        : "Failed to send message. Please try again."
                      }
                    </span>
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* Map and Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map Placeholder */}
              <div className="bg-muted rounded-xl p-8 text-center border border-border">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Our Location</h3>
                <p className="text-muted-foreground mb-4">
                  123 Fashion Street<br />
                  Mumbai, Maharashtra 400001<br />
                  India
                </p>
                <Button variant="outline" className="w-full">
                  <Globe className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>

              {/* Business Hours */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Business Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium text-red-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
                <p className="text-white/80 mb-4">
                  For urgent matters, call our support line directly
                </p>
                <div className="text-2xl font-bold">+91 98765 43210</div>
                <p className="text-sm text-white/70 mt-2">Available 24/7 for urgent support</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Explore our latest collection of premium streetwear and discover your unique style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = "/"}
                className="px-8 py-4 text-lg rounded-full"
              >
                Browse Collection
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/search"}
                className="px-8 py-4 text-lg rounded-full border-white text-white hover:bg-white hover:text-primary"
              >
                Search Products
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}