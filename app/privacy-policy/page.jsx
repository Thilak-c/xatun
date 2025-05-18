'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            title: 'Introduction',
            content: [
                'At XATUN STREETWEAR, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or make a purchase.',
                'By using our website, you agree to the terms outlined in this policy.',
            ],
        },
        {
            title: 'Information We Collect',
            content: [
                'We collect personal information such as your name, email address, shipping address, and payment details when you place an order.',
                'We also collect non-personal information, such as browser type, IP address, and browsing behavior, to improve our website and services.',
            ],
        },
        {
            title: 'How We Use Your Information',
            content: [
                'To process and fulfill your orders.',
                'To communicate with you about your orders, promotions, and updates.',
                'To improve our website, products, and services.',
                'To comply with legal obligations and prevent fraud.',
            ],
        },
        {
            title: 'Sharing Your Information',
            content: [
                'We do not sell or rent your personal information to third parties.',
                'We may share your information with trusted service providers (e.g., shipping carriers, payment processors) to fulfill your orders.',
                'We may disclose your information if required by law or to protect our rights and property.',
            ],
        },
        {
            title: 'Data Security',
            content: [
                'We implement industry-standard security measures to protect your personal information.',
                'However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
            ],
        },
        {
            title: 'Your Rights',
            content: [
                'You have the right to access, update, or delete your personal information. To do so, please contact us at support@xatun.in.',
                'You may also opt out of receiving promotional emails by following the unsubscribe link in the email.',
            ],
        },
        {
            title: 'Cookies',
            content: [
                'We use cookies to enhance your browsing experience and analyze website traffic.',
                'You can disable cookies in your browser settings, but this may affect the functionality of our website.',
            ],
        },
        {
            title: 'Changes to This Policy',
            content: [
                'We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the revised policy will take effect immediately upon posting.',
            ],
        },
        {
            title: 'Contact Us',
            content: [
                'If you have any questions or concerns about this Privacy Policy, please contact us at support@xatun.in.',
            ],
        },
    ];

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleSection = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="bg-gradient-to-b pt-[100px] lg:pt-[100px] from-gray-900 to-black min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">Privacy Policy</h1>
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md">
                            <button
                                onClick={() => toggleSection(index)}
                                className="w-full flex justify-between items-center text-left focus:outline-none"
                            >
                                <span className="text-lg font-medium text-gray-100">{section.title}</span>
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
                                            {section.content.map((text, i) => (
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