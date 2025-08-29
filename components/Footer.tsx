
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-brand-dark text-white">
            <div className="container mx-auto px-6 py-8 text-center">
                <p>&copy; {new Date().getFullYear()} Hope Foundation. All rights reserved.</p>
                <p className="text-sm text-gray-400 mt-2">A demonstration of a modern donations platform.</p>
            </div>
        </footer>
    );
};
