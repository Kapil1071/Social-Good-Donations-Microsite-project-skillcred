
import React, { Fragment } from 'react';

interface ThankYouModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    donorName: string;
    isError?: boolean;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, message, donorName, isError = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 animate-fade-in-up">
                <div className={`p-6 ${isError ? 'bg-red-500' : 'bg-brand-primary'} text-white rounded-t-lg`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">
                            {isError ? "An Error Occurred" : `Thank You, ${donorName}!`}
                        </h2>
                        <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                       {message.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                       ))}
                    </div>
                    {!isError && (
                      <p className="text-sm text-gray-500 mt-6 border-t pt-4">
                        A confirmation of your donation has been sent to your email. We are incredibly grateful for your support.
                      </p>
                    )}
                </div>
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg text-right">
                    <button
                        onClick={onClose}
                        className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-teal-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
