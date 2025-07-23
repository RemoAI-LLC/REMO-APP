import React, { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import {
  IoCopy,
  IoCheckmark,
  IoAttach,
  IoImage,
  IoVideocam,
  IoPlayCircle,
  IoDocument,
} from "react-icons/io5";
import { BiDotsHorizontalRounded } from "react-icons/bi";

import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { usePrivy } from "@privy-io/react-auth";
import EmailSetupModal from "../components/EmailSetupModal";
import { detectEmailIntent } from "../utils/emailIntentDetection";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";
import { getUserImage, getUserInitial } from "../utils/userProfileUtils";
import logo from "../assets/MainLogo.png";
import { Link } from "react-router-dom";
import { RotateWords } from "../components/RotateWords";
import ScheduleMeetingForm from "../components/ScheduleMeetingForm";
import DataAnalysisDisplay from "../components/DataAnalysisDisplay";

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
  file?: {
    name: string;
    size: number;
    type: string;
    url?: string;
  };
  dataAnalysis?: {
    summary: string;
    description: Record<string, any>;
    plots?: Record<string, string>;
    forecast?: any;
    report_id?: string;
    created_at?: string;
  };
}

// Utility to convert markdown to formatted HTML
function formatMarkdown(text: string) {
  let formattedText = text;

  // Convert headers
  formattedText = formattedText.replace(
    /^### (.*$)/gim,
    '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">$1</h3>'
  );
  formattedText = formattedText.replace(
    /^## (.*$)/gim,
    '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">$1</h2>'
  );
  formattedText = formattedText.replace(
    /^# (.*$)/gim,
    '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">$1</h1>'
  );

  // Convert bold text
  formattedText = formattedText.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>'
  );

  // Convert italic text
  formattedText = formattedText.replace(
    /\*(.*?)\*/g,
    '<em class="italic text-gray-800 dark:text-gray-200">$1</em>'
  );

  // Convert bullet points
  formattedText = formattedText.replace(
    /^- (.*$)/gim,
    '<li class="ml-4 mb-1">$1</li>'
  );
  formattedText = formattedText.replace(
    /(<li.*<\/li>)/s,
    '<ul class="list-disc list-inside mb-3 space-y-1">$1</ul>'
  );

  // Convert numbered lists
  formattedText = formattedText.replace(
    /^\d+\. (.*$)/gim,
    '<li class="ml-4 mb-1">$1</li>'
  );
  formattedText = formattedText.replace(
    /(<li.*<\/li>)/s,
    '<ol class="list-decimal list-inside mb-3 space-y-1">$1</ol>'
  );

  // Convert line breaks to paragraphs
  formattedText = formattedText.replace(/\n\n/g, '</p><p class="mb-3">');
  formattedText = '<p class="mb-3">' + formattedText + "</p>";

  // Clean up empty paragraphs
  formattedText = formattedText.replace(/<p class="mb-3"><\/p>/g, "");
  formattedText = formattedText.replace(/<p class="mb-3">\s*<\/p>/g, "");

  return formattedText;
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

// Add a helper to detect meeting scheduling intent
function isScheduleMeetingIntent(text: string) {
  const lower = text.toLowerCase();
  return (
    lower.includes("schedule a meet") ||
    lower.includes("schedule a meeting") ||
    lower.includes("set up a meeting")
  );
}

function extractBedrockMedia(content: string): {
  imageBase64?: string;
  videoBase64?: string;
} {
  try {
    const data = JSON.parse(content);
    if (data?.result?.image_base64) {
      return { imageBase64: data.result.image_base64 };
    }
    if (data?.result?.video_base64) {
      return { videoBase64: data.result.video_base64 };
    }
    // Direct result (non-streaming)
    if (data?.image_base64) {
      return { imageBase64: data.image_base64 };
    }
    if (data?.video_base64) {
      return { videoBase64: data.video_base64 };
    }
  } catch (e) {}
  return {};
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
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [pendingMeetingForm, setPendingMeetingForm] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCreationType, setSelectedCreationType] = useState<
    string | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const voiceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranscriptRef = useRef<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Function to check email auth status and fetch google email
  const checkEmailAuthStatus = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/status/${userId}`);
      const data = await response.json();
      setEmailConnected(!!data.authenticated);
      setGoogleEmail(data.google_email || null);
    } catch (err) {
      setEmailConnected(false);
      setGoogleEmail(null);
    }
  };

  // Check email status on mount and when userId changes
  useEffect(() => {
    checkEmailAuthStatus();
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

  // Focus textarea after messages are sent and when recording stops
  useEffect(() => {
    if (!isLoading && !isRecording && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading, isRecording]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (voiceTimeoutRef.current) {
        clearTimeout(voiceTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSelectedCreationType(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    if (!inputText.trim() && !selectedFile) return;

    const userMessage: Message = {
      role: "user",
      content: inputText.trim(),
      timestamp: new Date(),
      ...(selectedFile && {
        file: {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        },
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsLoading(true);

    try {
      // Check for email intent
      const emailIntent = detectEmailIntent(inputText);
      if (emailIntent && !emailConnected) {
        setShowEmailSetup(true);
        setIsLoading(false);
        return;
      }

      // Check for meeting scheduling intent
      if (isScheduleMeetingIntent(inputText)) {
        setPendingMeetingForm(true);
        setIsLoading(false);
        return;
      }

      // Check for data analysis intent and file
      const isDataAnalysis =
        inputText.toLowerCase().includes("analyze data") ||
        inputText.toLowerCase().includes("excel analysis") ||
        inputText.toLowerCase().includes("data analyst") ||
        inputText.toLowerCase().includes("analyze excel");
      if (isDataAnalysis && selectedFile) {
        const formData = new FormData();
        formData.append("message", inputText);
        formData.append("file", selectedFile);
        if (userId) {
          formData.append("user_id", userId);
        }
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to get response from Remo");
        }
        const data = await response.json();
        // Handle /chat API response
        if (data.response) {
          let parsedResponse = null;
          try {
            let jsonString = data.response
              .replace(/'/g, '"')
              .replace(/\bNone\b/g, "null")
              .replace(/\bTrue\b/g, "true")
              .replace(/\bFalse\b/g, "false");
            parsedResponse = JSON.parse(jsonString);
          } catch (e) {
            console.error("Failed to parse response:", e);
            parsedResponse = data.response;
          }

          // Create assistant message with data analysis results
          const assistantMessage: Message = {
            role: "assistant",
            content: "Here's your data analysis results:",
            timestamp: new Date(),
            dataAnalysis: {
              summary: parsedResponse.summary || "Data analysis complete.",
              description: parsedResponse.description || {},
              plots: parsedResponse.plots || {},
              forecast: parsedResponse.forecast || null,
              report_id: parsedResponse.report_id,
              created_at: parsedResponse.created_at,
            },
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      }

      // Prepare JSON for normal chat
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

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
        "text/csv",
      ];

      const fileExtension = file.name.toLowerCase().split(".").pop();
      const isExcelFile = ["xls", "xlsx", "xlsm", "xlsb", "csv"].includes(
        fileExtension || ""
      );

      if (!allowedTypes.includes(file.type) && !isExcelFile) {
        alert(
          "Please select a valid file type: PDF, Word, Text, Image, or Excel files"
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Copy message to clipboard
  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Helper function to get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split(".").pop();
    switch (extension) {
      case "pdf":
        return <IoDocument size={16} />;
      case "doc":
      case "docx":
        return <IoDocument size={16} />;
      case "xls":
      case "xlsx":
      case "xlsm":
      case "xlsb":
      case "csv":
        return <IoDocument size={16} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <IoImage size={16} />;
      case "txt":
        return <IoDocument size={16} />;
      default:
        return <IoAttach size={16} />;
    }
  };

  const InputBox = (
    <form onSubmit={handleSendMessage} className="w-full p-6 max-w-3xl mx-auto">
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-4">
        {/* Selected File Display */}
        {selectedFile && (
          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-blue-600 dark:text-blue-400">
                  {getFileIcon(selectedFile.name)}
                </div>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={removeSelectedFile}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                title="Remove file"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="w-full resize-none bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none max-h-[14rem] min-h-[2.5rem] overflow-y-auto p-2 font-medium pb-16"
          placeholder={
            selectedCreationType === "image"
              ? "Describe the image you want to create..."
              : selectedCreationType === "video"
              ? "Describe the video you want to create..."
              : selectedCreationType === "reel"
              ? "Describe the reel you want to create..."
              : selectedCreationType === "dropdown"
              ? placeholderText
              : isListening
              ? "Listening..."
              : placeholderText
          }
          value={isListening ? transcript : inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={2}
          disabled={isLoading || isRecording}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.xlsm,.xlsb,.csv"
        />

        {/* Icons in bottom-left corner - Create options */}
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          {/* Create dropdown for mobile */}
          <div className="relative lg:hidden" ref={dropdownRef}>
            <div className="relative group">
              <button
                type="button"
                onClick={() =>
                  setSelectedCreationType(
                    selectedCreationType === "dropdown" ? null : "dropdown"
                  )
                }
                disabled={isLoading}
                className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                title="Create content"
              >
                <BiDotsHorizontalRounded size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Create content
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Dropdown menu */}
            {selectedCreationType === "dropdown" && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  type="button"
                  onClick={() => setSelectedCreationType("image")}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                >
                  <IoImage size={14} />
                  Create Image
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCreationType("video")}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <IoVideocam size={14} />
                  Create Video
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCreationType("reel")}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-b-lg"
                >
                  <IoPlayCircle size={14} />
                  Create Reel
                </button>
              </div>
            )}
          </div>

          {/* Individual Create buttons for desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Create Image button */}
            <div className="relative group">
              <button
                type="button"
                onClick={() =>
                  setSelectedCreationType(
                    selectedCreationType === "image" ? null : "image"
                  )
                }
                disabled={isLoading}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                  selectedCreationType === "image"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300"
                }`}
                title="Create image"
              >
                <IoImage size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Create image
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Create Video button */}
            <div className="relative group">
              <button
                type="button"
                onClick={() =>
                  setSelectedCreationType(
                    selectedCreationType === "video" ? null : "video"
                  )
                }
                disabled={isLoading}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                  selectedCreationType === "video"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300"
                }`}
                title="Create video"
              >
                <IoVideocam size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Create video
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Create Reel button */}
            <div className="relative group">
              <button
                type="button"
                onClick={() =>
                  setSelectedCreationType(
                    selectedCreationType === "reel" ? null : "reel"
                  )
                }
                disabled={isLoading}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                  selectedCreationType === "reel"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300"
                }`}
                title="Create reel"
              >
                <IoPlayCircle size={18} />
              </button>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                Create reel
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Icons in bottom-right corner - Action buttons */}
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          {/* File attachment button */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              title="Attach file (PDF, Word, Excel, Images)"
            >
              <IoAttach size={18} />
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Attach file (PDF, Word, Excel, Images)
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          {/* Mic button */}
          <div className="relative group">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                isRecording
                  ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse"
                  : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500"
              } text-gray-700 dark:text-gray-300`}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? (
                <FaMicrophoneSlash size={18} className="text-white" />
              ) : (
                <FaMicrophone size={18} />
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              {isRecording ? "Stop recording" : "Start voice recording"}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          {/* Send button */}
          <div className="relative group">
            <button
              type="submit"
              disabled={isLoading || (!inputText.trim() && !selectedFile)}
              className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-md"
            >
              <IoIosSend size={18} />
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              Send message
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="w-full p-6 h-full space-y-6 max-w-5xl mx-auto pb-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center h-full justify-center text-center text-gray-600 dark:text-gray-300">
              <div className="w-full max-w-2xl">
                <Link to="/" className="mb-8 inline-block">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-32 w-auto rounded-full mx-auto shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
                  </div>
                </Link>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Welcome to Remo AI!
                </h2>
                <p className="text-xl mb-4 text-gray-700 dark:text-gray-300 font-medium">
                  I'm your personal AI assistant.
                </p>
                <div className="mb-8">
                  <RotateWords
                    text="I can help you with:"
                    words={["reminders", "tasks", "shopping", "notes", "ideas"]}
                  />
                </div>
                <div className="mt-8 flex-shrink-0 pb-4 w-full flex justify-center items-center">
                  {InputBox}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex w-full ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-4 ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse w-4/5 max-w-4xl"
                        : "w-full max-w-4xl"
                    }`}
                  >
                    {/* Enhanced Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-200 dark:ring-blue-800"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 ring-2 ring-gray-200 dark:ring-gray-700"
                      }`}
                    >
                      {message.role === "user" ? (
                        getUserImage(user) ? (
                          <img
                            src={getUserImage(user)!}
                            alt="User"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm uppercase">
                            {getUserInitial(user)}
                          </div>
                        )
                      ) : (
                        <img
                          src={logo}
                          alt="Remo AI"
                          className="w-full h-full object-cover rounded-full"
                        />
                      )}
                    </div>

                    {/* Enhanced Message Bubble */}
                    <div
                      className={`px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-3xl mb-4 relative group ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/25"
                          : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        (() => {
                          // Data Analysis Display
                          if (message.dataAnalysis) {
                            return (
                              <div className="pr-8 space-y-4">
                                <div
                                  className="text-base leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: linkify(
                                      formatMarkdown(message.content)
                                    ),
                                  }}
                                />
                                <DataAnalysisDisplay
                                  data={message.dataAnalysis}
                                />
                              </div>
                            );
                          }

                          // Bedrock base64 image/video support
                          const { imageBase64, videoBase64 } =
                            extractBedrockMedia(message.content);
                          if (imageBase64) {
                            return (
                              <div className="pr-8">
                                <img
                                  src={`data:image/png;base64,${imageBase64}`}
                                  alt="Generated"
                                  style={{
                                    width: "100%",
                                    maxWidth: 480,
                                    borderRadius: "1rem",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  }}
                                />
                              </div>
                            );
                          }
                          if (videoBase64) {
                            return (
                              <div className="space-y-4 pr-8">
                                <video
                                  src={`data:video/mp4;base64,${videoBase64}`}
                                  controls
                                  style={{
                                    width: "100%",
                                    maxWidth: 480,
                                    borderRadius: "1rem",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  }}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            );
                          }
                          // Fallback: markdown/links
                          return (
                            <div
                              className="text-base leading-relaxed pr-8"
                              dangerouslySetInnerHTML={{
                                __html: linkify(
                                  formatMarkdown(message.content)
                                ),
                              }}
                            />
                          );
                        })()
                      ) : (
                        <div className="pr-8">
                          <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                            {message.content}
                          </p>
                          {/* File attachment display */}
                          {message.file && (
                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center space-x-2">
                                <IoAttach
                                  className="text-blue-600 dark:text-blue-400"
                                  size={16}
                                />
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                  {message.file.name}
                                </span>
                                <span className="text-xs text-blue-600 dark:text-blue-400">
                                  (
                                  {(message.file.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <p
                          className={`text-xs font-medium ${
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                        {/* Copy Button - Only for assistant messages */}
                        {message.role === "assistant" && (
                          <button
                            onClick={() =>
                              copyToClipboard(message.content, index)
                            }
                            className="p-1.5 rounded-md transition-all duration-300 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200/80 dark:hover:bg-gray-600/80 text-gray-600 dark:text-gray-300"
                            title="Copy message"
                          >
                            {copiedMessageId === index ? (
                              <IoCheckmark
                                size={14}
                                className="text-green-500"
                              />
                            ) : (
                              <IoCopy size={14} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {(showMeetingForm || pendingMeetingForm) && (
                <div className="flex justify-start">
                  <div className="w-full max-w-md">
                    <ScheduleMeetingForm
                      userId={userId || ""}
                      organizerEmail={googleEmail || ""}
                      onSuccess={(msg) => {
                        setShowMeetingForm(false);
                        setPendingMeetingForm(false);
                        setMessages((prev) => [
                          ...prev,
                          {
                            role: "assistant",
                            content: msg,
                            timestamp: new Date(),
                          },
                        ]);
                      }}
                      onError={(err) => {
                        setMessages((prev) => [
                          ...prev,
                          {
                            role: "assistant",
                            content: `❌ ${err}`,
                            timestamp: new Date(),
                          },
                        ]);
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-gray-200 dark:ring-gray-700">
                  <img
                    src={logo}
                    alt="Remo AI"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 px-6 py-4 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      Remo is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isListening && (
            <div className="flex justify-end">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-red-200/50 dark:border-red-700/50 shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Listening... {transcript && `"${transcript}"`}
                </span>
                <span className="text-xs text-red-600 dark:text-red-400">
                  (Click mic to stop)
                </span>
              </div>
            </div>
          )}

          {transcript && !isListening && (
            <div className="flex justify-end">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 backdrop-blur-sm px-4 py-3 rounded-2xl border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Sending: "{transcript}"
                </span>
              </div>
            </div>
          )}

          {showMeetingForm && (
            <div className="flex justify-start">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 px-6 py-4 rounded-2xl max-w-md w-full shadow-lg">
                {/* ...Meeting Form (unchanged)... */}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
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
        isOpen={showMeetingForm}
        onClose={() => setShowMeetingForm(false)}
        userId={userId || ""}
      />

      {/* Input Area */}
      {messages.length > 0 && (
        <div className="flex-shrink-0 pb-6 w-full flex justify-center items-center">
          {InputBox}
        </div>
      )}
    </div>
  );
};

export default Home;
