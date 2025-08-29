import { GoogleGenAI } from "@google/genai";
import sgMail from '@sendgrid/mail';
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import type { DonationDetails } from '../../types';

// Helper function to generate the thank you message
const generateThankYouMessage = async (donorName: string, amount: number): Promise<string> => {
    // This function is now on the backend, protecting the API key.
    if (!process.env.API_KEY) {
        throw new Error("Google AI API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are a compassionate and grateful representative of the 'Hope Foundation', a charity focused on community empowerment.
        A donor named "${donorName}" has just generously donated ₹${amount}.

        Your task is to generate a response with two parts:
        1.  A short, heartfelt, and personalized thank you message (2-3 sentences). Address the donor directly.
        2.  A short, imaginative paragraph (3-4 sentences) describing the tangible impact this specific donation could have. Be creative and inspiring. For example, '₹${amount} can provide...'.

        Make the entire tone warm, sincere, and inspiring. Do not include a subject line, any email formatting like 'Dear...', or a closing like 'Sincerely,'. Just provide the raw text content for the body.
        
        Example structure:
        Thank you so much, [Donor Name], for your incredible generosity...
        
        Your donation of ₹[Amount] will make a real difference. It could provide...
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { temperature: 0.7, topP: 1, topK: 32 }
    });
        
    return response.text;
};


const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Securely get API keys from environment variables
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;

    if (!sendGridApiKey || !senderEmail) {
        console.error("Missing SendGrid or Sender Email configuration.");
        return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error." }) };
    }

    try {
        const { name, email, amount } = JSON.parse(event.body || '{}') as DonationDetails;
        if (!name || !email || !amount) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing required donation details." }) };
        }

        // 1. Generate the personalized message using Gemini AI
        const thankYouMessage = await generateThankYouMessage(name, amount);

        // 2. Send the email using SendGrid
        sgMail.setApiKey(sendGridApiKey);
        const msg = {
            to: email,
            from: senderEmail, // Use your verified sender email
            subject: `Thank You for Your Generous Donation to Hope Foundation!`,
            text: thankYouMessage, // For clients that don't render HTML
            html: `<div style="font-family: sans-serif; line-height: 1.6;">${thankYouMessage.replace(/\n\n/g, '<br><br>')}</div>`,
        };

        await sgMail.send(msg);

        // 3. Return the generated message to the frontend to display in the modal
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: thankYouMessage }),
        };

    } catch (error) {
        console.error("Error in sendThankYouEmail function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while processing your donation's thank you message." }),
        };
    }
};

export { handler };
