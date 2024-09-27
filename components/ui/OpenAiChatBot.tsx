"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaVolumeUp, FaPaperPlane, FaRobot } from "react-icons/fa";
import { useSession } from "next-auth/react";

const OpenAiChatBot: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const updateVoices = () => {
      setVoices(synth.getVoices());
    };

    synth.onvoiceschanged = updateVoices;
    updateVoices();
  }, []);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;

    if (messages[messages.length - 1]?.user === userMessage) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { user: userMessage, bot: "🤖 Thinking..." },
    ]);
    setInput("");

    if (waitingForResponse) return;

    setWaitingForResponse(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      const botMessage =
        data.response || "Sorry, something went wrong. Please ask about books.";

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { user: userMessage, bot: botMessage },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { user: userMessage, bot: "Sorry, something went wrong." },
      ]);
    } finally {
      setWaitingForResponse(false);
    }
  };

  const handlePredefinedQuestion = async (question: string) => {
    setInput(question);
    await sendMessage(question);
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const maleVoice = voices.find((voice) =>
      voice.name.toLowerCase().includes("male")
    );

    if (maleVoice) {
      utterance.voice = maleVoice;
    } else {
      const defaultVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.default);
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="fixed sm:bottom-4 sm:right-4 bottom-16 right-2 z-50 transition-transform">
      {!isChatOpen ? (
        <button
          className="w-14 h-14 bg-gray-900 text-gray-100 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-700 transition-all duration-300 animate-float"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <FaRobot className="text-2xl" />
        </button>
      ) : (
        <div className="w-full sm:w-96 h-[calc(100vh-5rem)] sm:h-[32rem] bg-gray-900 text-gray-100 shadow-xl rounded-lg flex flex-col border border-gray-700 overflow-hidden transform perspective-1000 rotate-y-0 transition-transform duration-500 ease-in-out hover:rotate-y-5">
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center">
              <FaRobot className="mr-2" /> Chat Assistant
            </h2>
            <button
              onClick={toggleChat}
              className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
              aria-label="Close chat"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.user ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg transform perspective-1000 transition-all duration-300 hover:scale-105 ${
                    msg.user
                      ? "bg-blue-600 text-white rounded-br-none rotate-y-5"
                      : "bg-gray-700 text-gray-100 rounded-bl-none -rotate-y-5"
                  }`}
                >
                  <p className="text-sm">{msg.user || msg.bot}</p>
                  {!msg.user && (
                    <button
                      onClick={() => speakText(msg.bot)}
                      className="text-gray-400 hover:text-gray-200 transition-colors duration-300 mt-2"
                      aria-label="Read aloud"
                    >
                      <FaVolumeUp />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 text-sm text-gray-100 transition-all duration-300 focus:scale-105"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask me about books..."
              />
              <button
                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                onClick={() => sendMessage(input)}
                disabled={waitingForResponse}
                aria-label="Send message"
              >
                <FaPaperPlane className="text-gray-100" />
              </button>
            </div>
            <button
              className="w-full mt-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm font-medium text-gray-100 transform hover:scale-105"
              onClick={() =>
                handlePredefinedQuestion("Suggest me a book to start with")
              }
            >
              Suggest a Book
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAiChatBot;
