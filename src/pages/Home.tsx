import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import {
  FaUser,
  FaRobot,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { usePrivy } from "@privy-io/react-auth";
import logo from "../assets/MainLogo.png";
import { Link } from "react-router-dom";
import { RotateWords } from "../components/RotateWords";

const placeholderText = "Hi I'm Remo! Your Personal AI Assistant";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Home: React.FC = () => {
  const { user } = usePrivy();
  const userId = user?.id;

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const currentTranscriptRef = useRef<string>("");

  // Initialize speech recognition
  useEffect(() => {
    const isSecureContext =
      window.isSecureContext ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";

    if (!isSecureContext) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      currentTranscriptRef.current = transcript;
      setTranscript(transcript);
      setInputText(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      setIsListening(false);
      setTranscript("");
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsListening(false);

      const finalTranscript = currentTranscriptRef.current.trim();
      if (finalTranscript) {
        sendVoiceMessage(finalTranscript);
        currentTranscriptRef.current = "";
        setTranscript("");
        setInputText("");
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          conversation_history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          user_id: userId,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVoiceMessage = async (voiceText: string) => {
    const userMessage: Message = {
      role: "user",
      content: voiceText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: voiceText,
          conversation_history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          user_id: userId,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      setInputText("");
      currentTranscriptRef.current = "";
      recognition.start();
    }

    setIsRecording(!isRecording);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const InputBox = (
    <form
      onSubmit={handleSendMessage}
      className="w-full max-w-4xl mx-auto px-4 py-8"
    >
      <div className="relative bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm px-4 pt-2 pb-12">
        {/* Textarea */}
        <textarea
          className="w-full resize-none bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none max-h-[14rem] min-h-[2.5rem] overflow-y-auto"
          placeholder={isListening ? "Listening..." : placeholderText}
          value={isListening ? transcript : inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={2}
          disabled={isLoading || isRecording}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />

        {/* Icons in bottom-right corner */}
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          {/* Mic button */}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isLoading}
            className={`p-2 rounded-full transition ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
            } text-white`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <FaMicrophoneSlash size={16} />
            ) : (
              <FaMicrophone size={16} />
            )}
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoIosSend size={16} />
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <Link to="/" className="mb-4">
              <img src={logo} alt="Logo" className="h-30 w-auto rounded-full" />
            </Link>
            <h2 className="text-2xl font-semibold mb-2">Welcome to Remo AI!</h2>
            <p className="text-lg mb-2">I'm your personal AI assistant.</p>
            <RotateWords
              text="I can help you with:"
              words={["reminders", "tasks", "shopping", "notes", "ideas"]}
            />

            {InputBox}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user"
                        ? "bg-blue-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {message.role === "user" ? (
                      <FaUser className="text-white text-sm" />
                    ) : (
                      <FaRobot className="text-gray-600 dark:text-gray-300 text-sm" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p className="text-xs mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {messages.length > 0 && <div className="py-4">{InputBox}</div>}
    </div>
  );
};

export default Home;
