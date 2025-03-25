'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TermsPage() {
    const sections = [
        {
            title: 'Acceptance of Terms',
            content: [
                'By accessing or using the XATUN STREETWEAR website, you agree to comply with and be bound by these Terms of Service.',
                'If you do not agree to these terms, please do not use our website.',
            ],
        },
        {
            title: 'Eligibility',
            content: [
                'You must be at least 18 years old or have the consent of a legal guardian to use our website.',
                'By using our website, you represent and warrant that you meet these eligibility requirements.',
            ],
        },
        {
            title: 'User Accounts',
            content: [
                'You may need to create an account to access certain features of our website.',
                'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
                'You agree to notify us immediately of any unauthorized use of your account.',
            ],
        },
        {
            title: 'Intellectual Property',
            content: [
                'All content on the XATUN STREETWEAR website, including text, graphics, logos, and images, is the property of XATUN STREETWEAR and is protected by intellectual property laws.',
                'You may not use, reproduce, or distribute any content from our website without prior written permission.',
            ],
        },
        {
            title: 'Prohibited Activities',
            content: [
                'You agree not to use our website for any unlawful or prohibited purposes, including but not limited to:',
                '- Harassing, defaming, or harming others.',
                '- Uploading or distributing malicious software.',
                '- Attempting to gain unauthorized access to our systems.',
            ],
        },
        {
            title: 'Limitation of Liability',
            content: [
                'XATUN STREETWEAR is not liable for any indirect, incidental, or consequential damages arising from your use of our website.',
                'Our total liability to you for any claims related to our website is limited to the amount you paid for the services.',
            ],
        },
        {
            title: 'Termination',
            content: [
                'We reserve the right to terminate or suspend your access to our website at any time, without notice, for any reason, including violation of these Terms of Service.',
            ],
        },
        {
            title: 'Governing Law',
            content: [
                'These Terms of Service are governed by the laws of [Your Country/State].',
                'Any disputes arising from these terms will be resolved in the courts of [Your Country/State].',
            ],
        },
        {
            title: 'Changes to Terms',
            content: [
                'We may update these Terms of Service from time to time. Any changes will be posted on this page, and the revised terms will take effect immediately upon posting.',
                'Your continued use of our website constitutes acceptance of the updated terms.',
            ],
        },
        {
            title: 'Contact Us',
            content: [
                'If you have any questions or concerns about these Terms of Service, please contact us at support@xatun.in.',
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
                <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">Terms of Service</h1>
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