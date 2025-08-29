
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-brand-primary">
                    Hope Foundation
                </div>
                <nav className="hidden md:flex space-x-8">
                    <a href="#home" className="text-gray-600 hover:text-brand-primary transition-colors">Home</a>
                    <a href="#about" className="text-gray-600 hover:text-brand-primary transition-colors">About Us</a>
                    <a href="#donate" className="text-gray-600 hover:text-brand-primary transition-colors">Donate</a>
                </nav>
                <a href="#donate" className="bg-brand-primary text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-700 transition-colors md:block hidden">
                    Donate
                </a>
            </div>
        </header>
    );
};
