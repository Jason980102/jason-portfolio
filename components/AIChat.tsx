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
            const response = await fetch("/api/chat", {
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
                className="
                    fixed
                    bottom-4
                    right-4
                    z-50
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-black
                    px-4
                    py-3
                    text-sm
                    text-white
                    shadow-lg
                    transition
                    hover:scale-105
                    sm:bottom-6
                    sm:right-6
                    sm:px-5
                "
            >
                <Sparkles size={18} />
                <span className="whitespace-nowrap">Ask Jason AI</span>
            </button>

            {/* Chat window */}
            {isOpen && (
                <div
                    className="
                        fixed
                        inset-x-3
                        bottom-20
                        z-50
                        flex
                        h-[min(520px,calc(100dvh-6rem))]
                        min-w-0
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        shadow-2xl

                        sm:inset-x-auto
                        sm:bottom-24
                        sm:right-6
                        sm:h-[520px]
                        sm:w-[380px]
                    "
                >
                    {/* Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <Sparkles
                                size={18}
                                className="shrink-0"
                            />

                            <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-900">
                                    Ask Jason AI
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                    Portfolio Assistant
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="ml-2 shrink-0 rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                            aria-label="Close AI chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="min-h-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto p-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex min-w-0 ${message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`
                                        min-w-0
                                        max-w-[85%]
                                        break-words
                                        rounded-2xl
                                        px-4
                                        py-3
                                        text-sm

                                        ${message.role === "user"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-800"
                                        }
                                    `}
                                >
                                    <p className="whitespace-pre-wrap break-words">
                                        {message.content}
                                    </p>

                                    {message.role === "assistant" &&
                                        message.source && (
                                            <button
                                                onClick={() =>
                                                    handleViewSource(
                                                        message.source!
                                                    )
                                                }
                                                className="
                                                    mt-3
                                                    flex
                                                    min-w-0
                                                    max-w-full
                                                    items-start
                                                    gap-1.5
                                                    text-left
                                                    text-xs
                                                    font-medium
                                                    text-gray-600
                                                    transition
                                                    hover:text-black
                                                "
                                            >
                                                <ExternalLink
                                                    size={13}
                                                    className="mt-0.5 shrink-0"
                                                />

                                                <span className="shrink-0">
                                                    View source
                                                </span>

                                                <span className="min-w-0 break-words text-gray-400">
                                                    · {message.source.label}
                                                </span>
                                            </button>
                                        )}
                                </div>
                            </div>
                        ))}

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="min-w-0 space-y-2">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Suggested questions
                                </p>

                                <div className="flex min-w-0 flex-col gap-2">
                                    {suggestedQuestions.map((question) => (
                                        <button
                                            key={question}
                                            onClick={() =>
                                                sendMessage(question)
                                            }
                                            className="
                                                min-w-0
                                                break-words
                                                rounded-xl
                                                border
                                                border-gray-200
                                                px-3
                                                py-2
                                                text-left
                                                text-sm
                                                text-gray-700
                                                transition
                                                hover:bg-gray-50
                                            "
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex min-w-0 justify-start">
                                <div className="flex min-w-0 max-w-full items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                                    <span className="min-w-0 break-words">
                                        Jason AI is thinking
                                    </span>

                                    <div className="flex shrink-0 gap-1">
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
                    <div className="shrink-0 border-t border-gray-200 p-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <input
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                                placeholder="Ask about Jason..."
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-xl
                                    border
                                    border-gray-300
                                    px-3
                                    py-2
                                    text-sm
                                    text-gray-900
                                    outline-none
                                    focus:border-black
                                "
                            />

                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                className="
                                    shrink-0
                                    rounded-xl
                                    bg-black
                                    p-2
                                    text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                                aria-label="Send message"
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