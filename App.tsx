import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DonationForm } from './components/DonationForm';
import { ThankYouModal } from './components/ThankYouModal';
import { Spinner } from './components/Spinner';
import type { DonationDetails } from './types';

const loadingMessages = [
    "Processing your generous donation...",
    "Connecting to secure server...",
    "Generating your personalized thank you...",
    "Sending confirmation...",
    "Finalizing..."
];

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>(loadingMessages[0]);
    const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
    const [thankYouMessage, setThankYouMessage] = useState<string>('');
    const [donorName, setDonorName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            let i = 0;
            interval = window.setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingText(loadingMessages[i]);
            }, 3000); // Change message every 3 seconds
        }
        return () => window.clearInterval(interval);
    }, [isLoading]);


    const handleDonate = useCallback(async (details: DonationDetails) => {
        setIsLoading(true);
        setError(null);
        setDonorName(details.name);
        setLoadingText(loadingMessages[0]); // Reset loading text

        // --- Timeout Implementation ---
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25-second timeout

        try {
            const response = await fetch('/api/sendThankYouEmail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(details),
                signal: controller.signal, // Pass the signal to fetch
            });

            clearTimeout(timeoutId); // Clear timeout if fetch succeeds

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API call failed');
            }

            const data = await response.json();
            setThankYouMessage(data.message);
            setShowThankYouModal(true);
        } catch (err) {
            clearTimeout(timeoutId); // Also clear timeout on error
            console.error("Error processing donation:", err);

            if ((err as Error).name === 'AbortError') {
                 // This is a timeout error
                setError(`Your donation was successful, thank you! We're experiencing a slight delay generating your personalized message. It will be delivered to your email shortly.`);
            } else {
                const errorMessage = (err instanceof Error) ? err.message : "An unknown error occurred.";
                setError(`We couldn't process the thank you email due to an error: ${errorMessage}. We deeply appreciate your donation and will ensure you receive a confirmation.`);
            }
            setShowThankYouModal(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const closeModal = () => {
        setShowThankYouModal(false);
        setThankYouMessage('');
        setError(null);
        setDonorName('');
    };

    return (
        <div className="flex flex-col min-h-screen font-sans text-brand-dark">
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
                    <Spinner />
                    <p className="text-white mt-4 text-lg text-center px-4">{loadingText}</p>
                </div>
            )}

            <Header />

            <main className="flex-grow">
                <section id="home" className="relative bg-brand-primary text-white text-center py-20 md:py-32">
                    <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://picsum.photos/1600/900?grayscale&blur=2')"}}></div>
                    <div className="relative container mx-auto px-6">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Your Contribution Creates Change</h1>
                        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">Join us in making a tangible difference. Every donation, big or small, fuels our mission and brings hope to communities in need.</p>
                        <a href="#donate" className="bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-full hover:bg-amber-300 transition-colors duration-300 text-lg">
                            Donate Now
                        </a>
                    </div>
                </section>

                <section id="about" className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-brand-dark">Our Mission: Hope in Action</h2>
                        <p className="max-w-3xl mx-auto text-gray-600 mb-12">
                            We are dedicated to providing essential resources, education, and support to underserved communities. Your generosity empowers us to tackle critical challenges and build a brighter future for all.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
                                <p className="text-gray-500">Providing tools and training for sustainable growth.</p>
                            </div>
                            <div className="p-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m-1 6a3 3 0 100-6 3 3 0 000 6z" /></svg>
                                <h3 className="text-xl font-semibold mb-2">Community</h3>
                                <p className="text-gray-500">Building strong, supportive networks for lasting change.</p>
                            </div>
                            <div className="p-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                                <h3 className="text-xl font-semibold mb-2">Impact</h3>
                                <p className="text-gray-500">Delivering measurable results and transparent reporting.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="donate" className="py-16 md:py-24 bg-brand-secondary">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto">
                           <DonationForm onDonate={handleDonate} />
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />

            <ThankYouModal
                isOpen={showThankYouModal}
                onClose={closeModal}
                message={error || thankYouMessage}
                donorName={donorName}
                isError={!!error}
            />
        </div>
    );
};

export default App;