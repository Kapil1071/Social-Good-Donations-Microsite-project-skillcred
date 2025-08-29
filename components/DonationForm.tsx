import React, { useState } from 'react';
import type { DonationDetails } from '../types';

interface DonationFormProps {
    onDonate: (details: DonationDetails) => void;
}

const presetAmounts = [250, 500, 1000, 2500];

// Type for Razorpay's success response
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export const DonationForm: React.FC<DonationFormProps> = ({ onDonate }) => {
    const [amount, setAmount] = useState<number>(500);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleAmountClick = (value: number) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomAmount(value);
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setAmount(numValue);
        }
    };
    
    const isAmountSelected = (value: number) => {
        return amount === value && customAmount === '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // --- Form Validation ---
        if (!name || !email || amount <= 0) {
            setError('Please fill out all fields and select a valid amount.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');

        // --- Razorpay Integration ---
        // The Razorpay checkout script is now loaded in index.html, so we don't need to load it dynamically.
        
        // IMPORTANT: This is the new test key you provided.
        const razorpayKeyId = 'rzp_test_RBHfRduqm6tqDV';

        const options = {
            key: razorpayKeyId,
            amount: amount * 100, // Amount in the smallest currency unit (paise for INR)
            currency: 'INR',
            name: 'Hope Foundation',
            description: 'Donation Transaction',
            handler: (response: RazorpayResponse) => {
                // This function is called after a successful payment.
                console.log('Payment successful:', response);
                
                // IMPORTANT: In a production application, you should send the `razorpay_payment_id`
                // to your backend server to verify the payment signature and confirm the transaction.
                // Since this is a frontend-only demo, we'll proceed directly.
                
                onDonate({ name, email, amount });
            },
            prefill: {
                name: name,
                email: email,
            },
            theme: {
                color: '#0D9488', // Matches brand-primary
            },
            notes: {
                "Project": "Social Good Donations Microsite"
            }
        };

        // The 'any' type is used here because the Razorpay object is attached to the window
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.on('payment.failed', function (response: any) {
            console.error('Payment failed:', response);
            setError(`Payment failed: ${response.error.description}. Please try again.`);
        });
        paymentObject.open();
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-brand-dark">Make a Donation</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Choose an amount</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {presetAmounts.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => handleAmountClick(preset)}
                                className={`p-4 rounded-md text-center font-bold border-2 transition-all ${
                                    isAmountSelected(preset)
                                        ? 'bg-brand-primary text-white border-brand-primary'
                                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:border-brand-primary'
                                }`}
                            >
                                ₹{preset}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="custom-amount">Or enter a custom amount</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                        <input
                            type="number"
                            id="custom-amount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="e.g. 750"
                            className="w-full pl-7 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                            required
                        />
                    </div>
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <p className="text-sm text-gray-500 mb-4 text-center">
                    You will be redirected to Razorpay to complete your payment securely.
                </p>

                <button type="submit" className="w-full bg-brand-accent text-brand-dark font-bold text-lg py-4 px-8 rounded-lg hover:bg-amber-300 transition-colors duration-300">
                    Donate ₹{amount > 0 ? amount : '...'}
                </button>
            </form>
        </div>
    );
};