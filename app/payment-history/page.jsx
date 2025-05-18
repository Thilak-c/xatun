"use client";
import React, { useEffect, useState } from "react";

export default function PaymentHistoryPage() {
    const [paymentHistory, setPaymentHistory] = useState([]);

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("paymentHistory")) || [];
        setPaymentHistory(history);
    }, []);

    return (
        <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Payment History</h1>
                {paymentHistory.length === 0 ? (
                    <p className="text-gray-300">No payment history found.</p>
                ) : (
                    <div className="space-y-6">
                        {paymentHistory.map((payment, index) => (
                            <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-lg">
                                <div className="flex items-center space-x-6">
                                    {/* Item Image */}
                                    <img
                                        src={`data:image/png;base64,${payment.itemImage}`} // Adjust the MIME type if needed
                                        alt={payment.productName}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold">{payment.productName}</h2>
                                        <p className="text-gray-300">Item ID: {payment.itemId}</p>
                                        <p className="text-gray-300">Amount: ₹{payment.amount}</p>
                                        <p className="text-gray-300">Payment ID: {payment.paymentId}</p>
                                        <p className="text-gray-300">Date: {new Date(payment.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}