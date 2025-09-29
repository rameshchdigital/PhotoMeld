/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { EnvelopeIcon } from './icons';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // IMPORTANT: Replace 'your_form_id_here' with your own Formspree form ID.
        // Create a new form at https://formspree.io/ and link it to rameshch6309@gmail.com.
        const formspreeEndpoint = 'https://formspree.io/f/xovkjrgg';

        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                setSubmitted(true);
                setName('');
                setEmail('');
                setMessage('');
            } else {
                const data = await response.json();
                if (data.errors) {
                    setError(data.errors.map((err: any) => err.message).join(', '));
                } else {
                    setError('An unknown error occurred. Please try again.');
                }
            }
        } catch (err) {
            setError('Could not send message. Please check your network connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <EnvelopeIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Get in Touch</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        Contact Us
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
                    </p>
                </div>

                <div className="w-full max-w-2xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    {submitted ? (
                        <div className="text-center p-8">
                            <h3 className="text-2xl font-bold text-green-400 mb-4">Thank You!</h3>
                            <p className="text-gray-300">Your message has been sent successfully. We'll be in touch soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg p-3 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="_replyto"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg p-3 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    rows={6}
                                    className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg p-3 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:opacity-50"
                                />
                            </div>
                             {error && (
                                <p className="text-sm text-red-400 text-center bg-red-500/10 p-3 rounded-lg">{error}</p>
                            )}
                            <button type="submit" className="w-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg hover:-translate-y-px active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed" disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ContactPage;