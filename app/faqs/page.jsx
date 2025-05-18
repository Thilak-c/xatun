"use client"


import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What is XATUN STREETWEAR?',
      answer: 'XATUN STREETWEAR is a contemporary streetwear brand that blends urban culture with high-quality fashion. Our designs are inspired by [your inspiration, e.g., music, art, street culture].',
    },
    {
      question: 'Where is XATUN STREETWEAR based?',
      answer: 'We are proudly based in [your city/country], but we ship worldwide to bring our streetwear to everyone.',
    },
    {
      question: 'What makes XATUN STREETWEAR unique?',
      answer: 'Our brand stands out for its [unique selling points, e.g., bold designs, sustainable materials, limited-edition drops]. We aim to redefine streetwear with every collection.',
    },
    {
      question: 'How can I purchase XATUN STREETWEAR products?',
      answer: 'You can shop our latest collections directly on our website. Simply browse, add items to your cart, and proceed to checkout.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship worldwide! Shipping costs and delivery times vary depending on your location.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused and unworn items. Please check our Returns & Exchanges page for more details.',
    },
    {
      question: 'How do I know what size to order?',
      answer: 'We provide a detailed size guide for each product on our website. If you need further assistance, feel free to contact our customer support team.',
    },
    {
      question: 'Do you restock sold-out items?',
      answer: 'Some items may be restocked, but many of our designs are limited edition. Follow us on social media to stay updated on new drops and restocks.',
    },
    {
      question: 'How can I contact XATUN STREETWEAR?',
      answer: 'You can reach us via email at support@xatun.in or through our contact form on the website. We typically respond within 24-48 hours.',
    },
    {
      question: 'Do you collaborate with artists or influencers?',
      answer: 'Yes, we love collaborating with creatives! If you’re interested in working with us, please email collaborations@xatunstreetwear.com with your portfolio or ideas.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-100">{faq.question}</span>
                <span className="ml-4">
                  {activeIndex === index ? (
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </span>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 text-gray-400">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}