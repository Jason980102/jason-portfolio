"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, ExternalLink } from "lucide-react";

type Source = {
    label: string;
    section: string;
};

type Message = {
    role: "user" | "assistant";
    content: string;
    source?: Source | null;
};

export default function AIChat() {
    const suggestedQuestions = [
        "What are Jason's strongest skills?",
        "Does Jason have AWS experience?",
        "Tell me about Jason's AI projects",
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hi! I'm Jason's AI portfolio assistant. Ask me about his skills, projects, education, or experience.",
        },
    ]);
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    const sendMessage = async (questionOverride?: string) => {
        const question = (questionOverride ?? input).trim();

        if (!question || loading) return;

        const userMessage: Message = {
            role: "user",
            content: question,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: question,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: "assistant",
                content: data.answer,
                source: data.source ?? null,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't reach the AI service right now. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewSource = (source: Source) => {
        setIsOpen(false);

        setTimeout(() => {
            const target = document.getElementById(source.section);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }, 150);
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white shadow-lg transition hover:scale-105"
            >
                <Sparkles size={18} />
                Ask Jason AI
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Sparkles size={18} />

                            <div>
                                <p className="font-semibold text-gray-900">
                                    Ask Jason AI
                                </p>

                                <p className="text-xs text-gray-500">
                                    Portfolio Assistant
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === "user"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-800"
                                        }`}
                                >
                                    <p>{message.content}</p>

                                    {message.role === "assistant" && message.source && (
                                        <button
                                            onClick={() => handleViewSource(message.source!)}
                                            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-600 transition hover:text-black"
                                        >
                                            <ExternalLink size={13} />
                                            <span>View source</span>
                                            <span className="text-gray-400">
                                                · {message.source.label}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="space-y-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Suggested questions
                                </p>

                                <div className="flex flex-col gap-2">
                                    {suggestedQuestions.map((question) => (
                                        <button
                                            key={question}
                                            onClick={() => sendMessage(question)}
                                            className="rounded-xl border border-gray-200 px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                                    <span>Jason AI is thinking</span>

                                    <div className="flex gap-1">
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                            <input
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                                placeholder="Ask about Jason..."
                                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-black"
                            />

                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                className="rounded-xl bg-black p-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}