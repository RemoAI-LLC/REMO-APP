import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { FaUser, FaRobot } from "react-icons/fa";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { usePrivy } from "@privy-io/react-auth";
import EmailSetupModal from "../components/EmailSetupModal";
import {
  detectEmailIntent,
  getEmailSuggestions,
} from "../utils/emailIntentDetection";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";
import { getUserImage, getUserInitial } from "../utils/userProfileUtils";
import logo from "../assets/MainLogo.png";
import { Link } from "react-router-dom";
import { RotateWords } from "../components/RotateWords";

const placeholderText = "Hi I'm Remo! Your Personal AI Assistant";

// Backend API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  // "https://remo-server.onrender.com" ||
  "http://localhost:8000";

// Type declarations for Web Speech API
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

// Utility to linkify URLs in text
function linkify(text: string) {
  const urlRegex =
    /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)|(www\.[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/gi;
  return text.replace(urlRegex, (url) => {
    const href = url.startsWith("http") ? url : `http://${url}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-all">${url}</a>`;
  });
}

// Add this helper to detect if the assistant is asking for meeting details
function isMeetingDetailsPrompt(message: string) {
  return (
    message.toLowerCase().includes("schedule a meeting") &&
    message.toLowerCase().includes("i need:")
  );
}

const Home: React.FC = () => {
  const { user } = usePrivy();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranscriptRef = useRef<string>("");
  const [meetingForm, setMeetingForm] = useState({
    attendees: "",
    subject: "",
    date: "",
    time: "",
    duration: "60",
    location: "",
    description: "",
  });

  // Get user ID from Privy
  const userId = user?.id;

  // Function to check email auth status
  const checkEmailAuthStatus = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status/${userId}`);
      const data = await response.json();
      setEmailConnected(!!data.authenticated);
    } catch (err) {
      setEmailConnected(false);
    }
  };

  // Check email status on mount and when userId changes
  useEffect(() => {
    checkEmailAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Initialize speech recognition
  useEffect(() => {
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecureContext =
      window.isSecureContext ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isSecureContext) {
      console.warn("Speech recognition requires HTTPS or localhost");
      alert(
        "Speech recognition requires a secure connection (HTTPS). Please use HTTPS or localhost."
      );
      return;
    }

    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      // Basic configuration
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false; // Only get final results
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log("Speech recognition result received:", event);
        const transcript = event.results[0][0].transcript;
        console.log("Captured transcript:", transcript);

        // Store in ref for immediate access
        currentTranscriptRef.current = transcript;

        // Update state for UI
        setTranscript(transcript);

        // Also set the input text so user can manually send if needed
        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        console.error("Error details:", event);
        setIsRecording(false);
        setIsListening(false);

        // Handle specific errors with better messages
        switch (event.error) {
          case "not-allowed":
            alert(
              "Microphone permission denied. Please allow microphone access and try again."
            );
            break;
          case "no-speech":
            console.log(
              "No speech detected - this is normal if you didn't speak"
            );
            // Don't show alert for no-speech, just log it
            break;
          case "network":
            alert(
              "Speech recognition service unavailable. This might be due to:\n• Browser compatibility issues\n• Microphone not working\n• Try refreshing the page"
            );
            break;
          case "audio-capture":
            alert(
              "Microphone not found or not working. Please check your microphone and try again."
            );
            break;
          case "service-not-allowed":
            alert(
              "Speech recognition service not allowed. Please check your browser settings."
            );
            break;
          case "bad-grammar":
            alert("Speech recognition grammar error. Please try again.");
            break;
          case "language-not-supported":
            alert("Language not supported. Please try with English.");
            break;
          default:
            console.warn("Unknown speech recognition error:", event.error);
          // Don't show alert for unknown errors, just log them
        }

        // Clear transcript on error
        setTranscript("");
      };

      recognitionRef.current.onend = () => {
        console.log("=== SPEECH RECOGNITION ENDED ===");
        console.log("Current transcript state:", transcript);
        console.log("Current transcript ref:", currentTranscriptRef.current);

        setIsListening(false);
        setIsRecording(false);

        // Use the ref value which is immediately available
        const finalTranscript = currentTranscriptRef.current.trim();
        console.log("Final transcript (from ref):", finalTranscript);
        console.log("Final transcript length:", finalTranscript.length);

        if (finalTranscript) {
          console.log(
            "✅ Transcript found, sending message immediately:",
            finalTranscript
          );

          // Clear any existing timeout
          if (voiceTimeoutRef.current) {
            clearTimeout(voiceTimeoutRef.current);
            voiceTimeoutRef.current = null;
          }

          // Send the message immediately
          sendVoiceMessage(finalTranscript);

          // Clear the ref, transcript, and input text immediately
          currentTranscriptRef.current = "";
          setTranscript("");
          setInputText("");
        } else {
          console.log("❌ No transcript found, not sending message");
        }

        // Clear transcript after a short delay
        setTimeout(() => {
          console.log("Clearing transcript state");
          setTranscript("");
        }, 100);
      };
    } else {
      console.warn("Speech recognition not supported in this browser");
    }
  }, []); // Remove transcript dependency

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Show the meeting form if the last assistant message is a meeting prompt
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role === "assistant" &&
      isMeetingDetailsPrompt(messages[messages.length - 1].content)
    ) {
      setShowMeetingForm(true);
    } else {
      setShowMeetingForm(false);
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // Check for email intent
    const emailIntent = detectEmailIntent(inputText);

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // If email intent detected and Gmail not connected, show setup prompt
    if (
      emailIntent.type !== "none" &&
      emailIntent.confidence > 0.7 &&
      !emailConnected
    ) {
      const setupMessage: Message = {
        role: "assistant",
        content: `📧 I detected you want to work with emails! To use email features, you'll need to connect your Gmail account first.\n\nClick the "Connect Gmail" button in the top right, or I can help you with other tasks like reminders and todos.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, setupMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          conversation_history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          user_id: userId, // Include user ID for user-specific functionality
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Remo");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVoiceMessage = async (voiceText: string) => {
    console.log("sendVoiceMessage called with:", voiceText);
    if (!voiceText.trim()) {
      console.log("sendVoiceMessage early return - empty voiceText");
      return;
    }

    // Check for email intent
    const emailIntent = detectEmailIntent(voiceText);

    console.log("Creating user message for voice input");
    const userMessage: Message = {
      role: "user",
      content: voiceText,
      timestamp: new Date(),
    };

    // Add user message to chat immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    // If email intent detected and Gmail not connected, show setup prompt
    if (
      emailIntent.type !== "none" &&
      emailIntent.confidence > 0.7 &&
      !emailConnected
    ) {
      const setupMessage: Message = {
        role: "assistant",
        content: `📧 I detected you want to work with emails! To use email features, you'll need to connect your Gmail account first.\n\nClick the "Connect Gmail" button in the top right, or I can help you with other tasks like reminders and todos.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, setupMessage]);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending voice message to API:", voiceText);
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: voiceText,
          conversation_history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          user_id: userId, // Include user ID for user-specific functionality
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Remo");
      }

      const data = await response.json();
      console.log("Received response from Remo:", data.response);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending voice message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech recognition is not supported in your browser. Please use Chrome or Edge."
      );
      return;
    }

    try {
      if (isRecording) {
        // Stop recording
        console.log("Stopping recording manually...");

        // Clear any existing timeout
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
          voiceTimeoutRef.current = null;
        }

        recognitionRef.current.stop();
        setIsRecording(false);
        setIsListening(false);
        console.log("Recording stopped manually");
      } else {
        // Start recording
        console.log("Starting recording...");
        console.log("Browser info:", navigator.userAgent);
        console.log("HTTPS:", window.location.protocol === "https:");
        console.log(
          "Microphone permission:",
          navigator.permissions ? "Available" : "Not available"
        );

        // Clear any previous transcript
        setTranscript("");
        setInputText("");
        currentTranscriptRef.current = "";

        recognitionRef.current.start();
        setIsRecording(true);
        console.log("Recording started");
      }
    } catch (error) {
      console.error("Error toggling recording:", error);
      alert("Error starting voice recording. Please try again.");
      setIsRecording(false);
      setIsListening(false);
      setTranscript("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Email setup handlers
  const handleEmailSetupClick = () => {
    setShowEmailSetup(true);
  };

  const handleEmailSetupSuccess = () => {
    setEmailConnected(true);
    // Add a success message to chat
    const successMessage: Message = {
      role: "assistant",
      content:
        "✅ Gmail connected successfully! You can now use email features in chat. Try saying:\n• 'Schedule a meeting for tomorrow'\n• 'Send an email to john@example.com'\n• 'Search my emails for project updates'",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  const handleEmailSetupClose = () => {
    setShowEmailSetup(false);
    checkEmailAuthStatus(); // Re-check status after modal closes
  };

  const handleMeetingFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMeetingForm({ ...meetingForm, [e.target.name]: e.target.value });
  };

  const handleMeetingFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowMeetingForm(false);

    // Format meeting details as a structured message
    const detailsMsg = `Schedule a meeting with ${meetingForm.attendees} on ${meetingForm.date} at ${meetingForm.time} about ${meetingForm.subject}. Duration: ${meetingForm.duration} minutes. Location: ${meetingForm.location}. Description: ${meetingForm.description}`;

    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content: detailsMsg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: detailsMsg,
          conversation_history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Remo");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error scheduling meeting:", error);

      // Check if the error is due to missing Google authentication
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const isAuthError =
        errorMessage.includes("not authenticated") ||
        errorMessage.includes("OAuth");

      let errorContent =
        "Sorry, I encountered an error while scheduling your meeting. Please try again.";

      if (isAuthError) {
        errorContent = `❌ **Google Calendar not connected!**\n\nTo schedule meetings with Google Calendar, you need to connect your Gmail account first.\n\nGo to the **Integrations** page to connect your Gmail account.`;
      }

      const errorMessageObj: Message = {
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
      // Reset form
      setMeetingForm({
        attendees: "",
        subject: "",
        date: "",
        time: "",
        duration: "60",
        location: "",
        description: "",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Messages Area */}
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
          messages.map((message, index) => (
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
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
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

                {/* Message Bubble */}
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <p
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: linkify(message.content),
                      }}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <FaRobot className="text-gray-600 dark:text-gray-300 text-sm" />
              </div>
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Remo is thinking...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Voice recording indicator */}
        {isListening && (
          <div className="flex justify-end">
            <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900 px-3 py-2 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-700 dark:text-red-300">
                Listening... {transcript && `"${transcript}"`}
              </span>
              <span className="text-xs text-red-600 dark:text-red-400">
                (Click mic to stop)
              </span>
            </div>
          </div>
        )}

        {/* Voice input preview */}
        {transcript && !isListening && (
          <div className="flex justify-end">
            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded-lg">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Sending: "{transcript}"
              </span>
            </div>
          </div>
        )}

        {showMeetingForm && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-lg max-w-md w-full shadow-lg">
              <form onSubmit={handleMeetingFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Attendees (emails, comma separated)
                  </label>
                  <input
                    type="text"
                    name="attendees"
                    value={meetingForm.attendees}
                    onChange={handleMeetingFormChange}
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={meetingForm.subject}
                    onChange={handleMeetingFormChange}
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={meetingForm.date}
                      onChange={handleMeetingFormChange}
                      className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={meetingForm.time}
                      onChange={handleMeetingFormChange}
                      className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={meetingForm.duration}
                    onChange={handleMeetingFormChange}
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={meetingForm.location}
                    onChange={handleMeetingFormChange}
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={meetingForm.description}
                    onChange={handleMeetingFormChange}
                    className="mt-1 block w-full rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? "Scheduling..." : "Schedule Meeting"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Email Setup Modal */}
      {userId && (
        <EmailSetupModal
          isOpen={showEmailSetup}
          onClose={handleEmailSetupClose}
          onSuccess={handleEmailSetupSuccess}
          userId={userId || ""}
        />
      )}

      <ScheduleMeetingModal
        isOpen={showScheduleMeeting}
        onClose={() => setShowScheduleMeeting(false)}
        userId={userId || ""}
      />

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-end gap-4">
          <div className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm px-6 py-4 bg-gray-50 dark:bg-gray-700 min-h-[60px]">
            <textarea
              className="w-full resize-none border-none outline-none bg-transparent text-lg p-0 min-h-[32px] max-h-40 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder={isListening ? "Listening..." : placeholderText}
              value={isListening ? transcript : inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={1}
              disabled={isLoading || isRecording}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>

          {/* Voice Recording Button */}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={isLoading}
            className={`p-3 rounded-full transition flex items-center justify-center ${
              isRecording
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-500 text-white hover:bg-gray-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <FaMicrophoneSlash size={20} />
            ) : (
              <FaMicrophone size={20} />
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <IoIosSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
