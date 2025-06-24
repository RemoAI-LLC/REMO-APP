# Remo AI Assistant - API Usage Examples

This guide provides comprehensive examples of how to integrate with the Remo AI Assistant API, including voice input functionality.

## 🚀 Quick Start

### **Basic Chat Integration**

```javascript
const API_BASE_URL = "https://remo-server.onrender.com";

// Send a message
async function chatWithRemo(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        conversation_history: [],
      }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, I encountered an error.";
  }
}

// Usage
const response = await chatWithRemo("Hello, can you help me set a reminder?");
console.log("Remo:", response);
```

## 🎤 Voice Input Integration

### **Speech Recognition Setup**

```typescript
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

class VoiceInput {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.setupEventHandlers();
    }
  }

  private setupEventHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("Voice input started");
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Emit transcript event
      this.onTranscript(finalTranscript + interimTranscript);
    };

    this.recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Voice input ended");
    };
  }

  startListening(onTranscript: (text: string) => void) {
    if (!this.recognition) {
      console.error("Speech recognition not supported");
      return false;
    }

    this.onTranscript = onTranscript;
    this.recognition.start();
    return true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  isSupported(): boolean {
    return this.recognition !== null;
  }

  private onTranscript: (text: string) => void = () => {};
}

// Usage
const voiceInput = new VoiceInput();

if (voiceInput.isSupported()) {
  voiceInput.startListening((text) => {
    console.log("Transcribed:", text);
    // Send to Remo API
    chatWithRemo(text);
  });
}
```

### **React Hook for Voice Input**

```typescript
import { useState, useCallback } from "react";

interface UseRemoChatReturn {
  messages: Message[];
  isLoading: boolean;
  isRecording: boolean;
  transcript: string;
  sendMessage: (message: string) => Promise<void>;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  clearHistory: () => void;
}

export const useRemoChat = (
  apiUrl: string = "https://remo-server.onrender.com"
): UseRemoChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);

      try {
        const response = await fetch(`${apiUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message,
            conversation_history: messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from Remo");
        }

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: message,
            timestamp: new Date(),
          },
          {
            role: "assistant",
            content: data.response,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: message,
            timestamp: new Date(),
          },
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, messages]
  );

  const startVoiceInput = useCallback(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (transcript.trim()) {
          sendMessage(transcript);
          setTranscript("");
        }
      };

      recognition.start();
    } else {
      alert("Speech recognition not supported in your browser");
    }
  }, [transcript, sendMessage]);

  const stopVoiceInput = useCallback(() => {
    setIsRecording(false);
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isRecording,
    transcript,
    sendMessage,
    startVoiceInput,
    stopVoiceInput,
    clearHistory,
  };
};
```

### **Complete Voice Input Component**

```typescript
import React, { useState, useRef, useEffect } from "react";

interface VoiceChatProps {
  apiUrl?: string;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({
  apiUrl = "https://remo-server.onrender.com",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (transcript.trim()) {
          sendMessage(transcript);
          setTranscript("");
        }
      };
    }
  }, []);

  const sendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversation_history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text, timestamp: new Date() },
        { role: "assistant", content: data.response, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="voice-chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "You" : "Remo"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
        {isLoading && <div className="loading">Remo is thinking...</div>}
      </div>

      <div className="controls">
        <button
          onClick={toggleRecording}
          className={`mic-button ${isRecording ? "recording" : ""}`}
        >
          {isRecording ? "🛑 Stop" : "🎤 Start"} Voice Input
        </button>
        {transcript && (
          <div className="transcript">
            <strong>You said:</strong> {transcript}
          </div>
        )}
      </div>
    </div>
  );
};
```

## 🔧 Advanced Integration

### **Error Handling & Retry Logic**

```typescript
class RemoClient {
  private apiUrl: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(
    apiUrl: string = "https://remo-server.onrender.com",
    maxRetries: number = 3,
    retryDelay: number = 1000
  ) {
    this.apiUrl = apiUrl;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  async sendMessage(message: string, conversationHistory: any[] = []) {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.apiUrl}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            conversation_history: conversationHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);

        if (attempt < this.maxRetries) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay * attempt)
          );
        }
      }
    }

    throw new RemoError(
      `Failed after ${this.maxRetries} attempts: ${lastError!.message}`,
      0,
      "MAX_RETRIES_EXCEEDED"
    );
  }
}

class RemoError extends Error {
  constructor(message: string, public code: number, public type: string) {
    super(message);
    this.name = "RemoError";
  }
}
```

### **Rate Limiting & Caching**

```typescript
class RemoClientWithCache extends RemoClient {
  private cache = new Map<string, { response: string; timestamp: number }>();
  private cacheTimeout: number;
  private minInterval: number;
  private lastRequestTime: number = 0;

  constructor(
    apiUrl: string = "https://remo-server.onrender.com",
    cacheTimeout: number = 5 * 60 * 1000, // 5 minutes
    minInterval: number = 1000 // 1 second between requests
  ) {
    super(apiUrl);
    this.cacheTimeout = cacheTimeout;
    this.minInterval = minInterval;
  }

  async sendMessage(message: string, conversationHistory: any[] = []) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    // Check cache for exact message match
    const cacheKey = JSON.stringify({ message, conversationHistory });
    const cached = this.cache.get(cacheKey);
    if (cached && now - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }

    // Make API call
    const response = await super.sendMessage(message, conversationHistory);

    // Cache the response
    this.cache.set(cacheKey, {
      response,
      timestamp: now,
    });

    this.lastRequestTime = Date.now();
    return response;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

## 🌐 Multi-Language Examples

### **JavaScript (Node.js)**

```javascript
const axios = require("axios");

class RemoNodeClient {
  constructor(apiUrl = "https://remo-server.onrender.com") {
    this.apiUrl = apiUrl;
    this.conversationHistory = [];
  }

  async sendMessage(message) {
    try {
      const response = await axios.post(`${this.apiUrl}/chat`, {
        message: message,
        conversation_history: this.conversationHistory,
      });

      const data = response.data;
      if (data.success) {
        // Update conversation history
        this.conversationHistory.push({ role: "user", content: message });
        this.conversationHistory.push({
          role: "assistant",
          content: data.response,
        });

        return data.response;
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    }
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Usage
const remo = new RemoNodeClient();

async function main() {
  try {
    const response = await remo.sendMessage(
      "Hello, can you help me set a reminder?"
    );
    console.log("Remo:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
```

### **Python**

```python
import requests
import json
from typing import List, Dict, Any

class RemoPythonClient:
    def __init__(self, api_url: str = "https://remo-server.onrender.com"):
        self.api_url = api_url
        self.conversation_history: List[Dict[str, str]] = []

    def send_message(self, message: str) -> str:
        """Send a message to Remo AI Assistant"""
        try:
            response = requests.post(
                f"{self.api_url}/chat",
                headers={"Content-Type": "application/json"},
                json={
                    "message": message,
                    "conversation_history": self.conversation_history
                }
            )

            response.raise_for_status()
            data = response.json()

            if data["success"]:
                # Update conversation history
                self.conversation_history.append({"role": "user", "content": message})
                self.conversation_history.append({"role": "assistant", "content": data["response"]})

                return data["response"]
            else:
                raise Exception("API request failed")

        except requests.exceptions.RequestException as e:
            print(f"Network error: {e}")
            raise
        except Exception as e:
            print(f"Error: {e}")
            raise

    def get_conversation_history(self) -> List[Dict[str, str]]:
        """Get the current conversation history"""
        return self.conversation_history.copy()

    def clear_history(self) -> None:
        """Clear the conversation history"""
        self.conversation_history.clear()

# Usage
def main():
    remo = RemoPythonClient()

    try:
        response = remo.send_message("Hello, can you help me set a reminder?")
        print(f"Remo: {response}")

        # Continue conversation
        response = remo.send_message("Set it for tomorrow at 2pm")
        print(f"Remo: {response}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```

### **C#**

```csharp
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class RemoCSharpClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiUrl;
    private readonly List<Message> _conversationHistory;

    public RemoCSharpClient(string apiUrl = "https://remo-server.onrender.com")
    {
        _apiUrl = apiUrl;
        _httpClient = new HttpClient();
        _conversationHistory = new List<Message>();
    }

    public async Task<string> SendMessageAsync(string message)
    {
        try
        {
            var request = new ChatRequest
            {
                Message = message,
                ConversationHistory = _conversationHistory
            };

            var json = JsonConvert.SerializeObject(request);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_apiUrl}/chat", content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var chatResponse = JsonConvert.DeserializeObject<ChatResponse>(responseContent);

            if (chatResponse.Success)
            {
                // Update conversation history
                _conversationHistory.Add(new Message { Role = "user", Content = message });
                _conversationHistory.Add(new Message { Role = "assistant", Content = chatResponse.Response });

                return chatResponse.Response;
            }
            else
            {
                throw new Exception("API request failed");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            throw;
        }
    }

    public List<Message> GetConversationHistory()
    {
        return new List<Message>(_conversationHistory);
    }

    public void ClearHistory()
    {
        _conversationHistory.Clear();
    }

    public void Dispose()
    {
        _httpClient?.Dispose();
    }
}

public class ChatRequest
{
    [JsonProperty("message")]
    public string Message { get; set; }

    [JsonProperty("conversation_history")]
    public List<Message> ConversationHistory { get; set; }
}

public class ChatResponse
{
    [JsonProperty("response")]
    public string Response { get; set; }

    [JsonProperty("success")]
    public bool Success { get; set; }

    [JsonProperty("timestamp")]
    public string Timestamp { get; set; }
}

public class Message
{
    [JsonProperty("role")]
    public string Role { get; set; }

    [JsonProperty("content")]
    public string Content { get; set; }
}

// Usage
class Program
{
    static async Task Main(string[] args)
    {
        using var remo = new RemoCSharpClient();

        try
        {
            var response = await remo.SendMessageAsync("Hello, can you help me set a reminder?");
            Console.WriteLine($"Remo: {response}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}
```

## 🎯 Best Practices

### **1. Error Handling**

- Always handle network errors gracefully
- Implement retry logic for failed requests
- Provide user-friendly error messages
- Log errors for debugging

### **2. Rate Limiting**

- Respect API rate limits
- Implement client-side throttling
- Use exponential backoff for retries
- Cache responses when appropriate

### **3. Voice Input**

- Check browser compatibility before enabling
- Handle microphone permissions gracefully
- Provide visual feedback during recording
- Implement fallbacks for unsupported browsers

### **4. Conversation Management**

- Maintain conversation history for context
- Clear history when appropriate
- Handle long conversations efficiently
- Implement conversation export/import

### **5. Security**

- Use HTTPS for all API calls
- Validate user input
- Sanitize conversation history
- Implement proper authentication if needed

## 🚀 Deployment Considerations

### **Production Setup**

```typescript
// Environment-based configuration
const config = {
  apiUrl: process.env.REMO_API_URL || "https://remo-server.onrender.com",
  maxRetries: parseInt(process.env.REMO_MAX_RETRIES || "3"),
  retryDelay: parseInt(process.env.REMO_RETRY_DELAY || "1000"),
  enableVoiceInput: process.env.REMO_ENABLE_VOICE === "true",
  enableCaching: process.env.REMO_ENABLE_CACHE === "true",
};

// Initialize client with production settings
const remoClient = new RemoClientWithCache(
  config.apiUrl,
  config.enableCaching ? 5 * 60 * 1000 : 0, // 5 minutes cache
  config.maxRetries,
  config.retryDelay
);
```

### **Monitoring & Analytics**

```typescript
class RemoClientWithAnalytics extends RemoClient {
  async sendMessage(message: string, conversationHistory: any[] = []) {
    const startTime = Date.now();

    try {
      const response = await super.sendMessage(message, conversationHistory);

      // Track successful requests
      this.trackEvent("message_sent", {
        duration: Date.now() - startTime,
        messageLength: message.length,
        hasHistory: conversationHistory.length > 0,
      });

      return response;
    } catch (error) {
      // Track failed requests
      this.trackEvent("message_failed", {
        duration: Date.now() - startTime,
        error: error.message,
        messageLength: message.length,
      });

      throw error;
    }
  }

  private trackEvent(eventName: string, properties: any) {
    // Send to your analytics service
    console.log(`Analytics: ${eventName}`, properties);
  }
}
```

---

**The Remo AI Assistant API is now ready for production use with voice input capabilities! 🎤✨**
