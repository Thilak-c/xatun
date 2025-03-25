'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShippingReturnsPage() {
  const policies = [
    {
      title: 'Shipping Information',
      content: [
        'We offer worldwide shipping to bring XATUN STREETWEAR to your doorstep.',
        'Shipping costs and delivery times vary depending on your location. You can view the estimated delivery time during checkout.',
        'Once your order is shipped, you will receive a confirmation email with tracking information.',
      ],
    },
    {
      title: 'Return Policy',
      content: [
        'We offer a 3-day return policy for unused and unworn items.',
        'To initiate a return, please contact our support team at support@xatun.in with your order number and reason for return.',
        'Return shipping costs are the responsibility of the customer unless the item is defective or incorrect.',
        'Refunds will be processed within 5-7 business days after we receive the returned item.',
      ],
    },
    {
      title: 'Exchanges',
      content: [
        'We currently do not offer direct exchanges. If you need a different size or color, please return the original item and place a new order.',
        'Ensure the item is in its original condition with all tags attached for the return to be processed.',
      ],
    },
    {
      title: 'Damaged or Defective Items',
      content: [
        'If you receive a damaged or defective item, please contact us immediately at support@xatun.in.com.',
        'We will provide a prepaid return label and either replace the item or issue a full refund.',
      ],
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">Shipping & Returns</h1>
        <div className="space-y-4">
          {policies.map((policy, index) => (
            <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md">
              <button
                onClick={() => toggleSection(index)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-100">{policy.title}</span>
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
                    <div className="mt-4 text-gray-400 space-y-2">
                      {policy.content.map((text, i) => (
                        <p key={i}>{text}</p>
                      ))}
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