# Remo API Usage Examples

This guide provides practical examples of how to integrate with the Remo AI Assistant API from your frontend application.

## Quick Start

### Basic Chat Request

```javascript
const API_BASE_URL = "https://remo-server.onrender.com";

async function sendMessage(message, conversationHistory = []) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      conversation_history: conversationHistory,
    }),
  });

  return response.json();
}

// Usage
sendMessage("Hello Remo!")
  .then((data) => console.log("Response:", data.response))
  .catch((error) => console.error("Error:", error));
```

## React Examples

### Simple Chat Component

```jsx
import React, { useState } from "react";

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("https://remo-server.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          conversation_history: messages,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "assistant", content: data.response },
      ]);

      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
```

### Custom Hook for Chat

```jsx
import { useState, useCallback } from "react";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (message) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://remo-server.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            conversation_history: messages,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          { role: "user", content: message, timestamp: new Date() },
          { role: "assistant", content: data.response, timestamp: new Date() },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}
```

## TypeScript Examples

### Type Definitions

```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

interface ChatRequest {
  message: string;
  conversation_history: Message[];
}

interface ChatResponse {
  response: string;
  success: boolean;
  error: string | null;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
```

### Typed Chat Service

```typescript
class RemoAPI {
  private baseUrl: string;

  constructor(baseUrl: string = "https://remo-server.onrender.com") {
    this.baseUrl = baseUrl;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Usage
const remoAPI = new RemoAPI();

// Send a message
const response = await remoAPI.chat({
  message: "Set a reminder for tomorrow 9am",
  conversation_history: [],
});

console.log("Remo says:", response.response);
```

## Common Use Cases

### Setting Reminders

```javascript
// Set a reminder
const reminderResponse = await sendMessage(
  "Set a reminder for my dentist appointment tomorrow at 2pm"
);

// Follow up with time
const followUpResponse = await sendMessage("Make it 3pm instead", [
  {
    role: "user",
    content: "Set a reminder for my dentist appointment tomorrow at 2pm",
  },
  { role: "assistant", content: reminderResponse.response },
]);
```

### Managing Todos

```javascript
// Add a todo
await sendMessage('Add "buy groceries" to my todo list');

// Add with priority
await sendMessage('Add "finish project report" as high priority todo');

// List todos
await sendMessage("Show me all my todos");
```

### Multi-turn Conversations

```javascript
let conversationHistory = [];

// First message
const response1 = await sendMessage(
  "Set a reminder for painting",
  conversationHistory
);
conversationHistory.push(
  { role: "user", content: "Set a reminder for painting" },
  { role: "assistant", content: response1.response }
);

// Follow up with time
const response2 = await sendMessage("tomorrow at 9am", conversationHistory);
conversationHistory.push(
  { role: "user", content: "tomorrow at 9am" },
  { role: "assistant", content: response2.response }
);

// Add description
const response3 = await sendMessage(
  "yes, add description: paint the living room",
  conversationHistory
);
```

## Error Handling

### Comprehensive Error Handling

```javascript
async function sendMessageWithErrorHandling(message, conversationHistory = []) {
  try {
    const response = await fetch("https://remo-server.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        conversation_history: conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }

    if (error.message.includes("429")) {
      throw new Error("Too many requests. Please wait before trying again.");
    }

    throw error;
  }
}
```

### Retry Logic

```javascript
async function sendMessageWithRetry(
  message,
  conversationHistory = [],
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendMessage(message, conversationHistory);
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
```

## Real-world Examples

### React Chat App

```jsx
import React, { useState, useEffect, useRef } from "react";

function RemoChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("https://remo-server.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Remo AI Assistant
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-900 border"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border px-4 py-2 rounded-lg">
              Remo is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoChatApp;
```

### Vue.js Example

```vue
<template>
  <div class="chat-container">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        {{ message.content }}
      </div>
    </div>

    <div class="input-area">
      <input
        v-model="input"
        @keyup.enter="sendMessage"
        placeholder="Type your message..."
        :disabled="isLoading"
      />
      <button @click="sendMessage" :disabled="isLoading">
        {{ isLoading ? "Sending..." : "Send" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [],
      input: "",
      isLoading: false,
    };
  },

  methods: {
    async sendMessage() {
      if (!this.input.trim() || this.isLoading) return;

      this.isLoading = true;
      const userMessage = this.input;
      this.input = "";

      this.messages.push({ role: "user", content: userMessage });

      try {
        const response = await fetch("https://remo-server.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            conversation_history: this.messages.slice(0, -1),
          }),
        });

        const data = await response.json();
        this.messages.push({ role: "assistant", content: data.response });
      } catch (error) {
        this.messages.push({
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>
```

## Testing Your Integration

### Health Check

```javascript
// Test API connectivity
async function testConnection() {
  try {
    const response = await fetch("https://remo-server.onrender.com/health");
    const data = await response.json();
    console.log("API Status:", data.status);
    return data.status === "healthy";
  } catch (error) {
    console.error("API Connection Failed:", error);
    return false;
  }
}

// Usage
testConnection().then((isHealthy) => {
  if (isHealthy) {
    console.log("✅ API is ready");
  } else {
    console.log("❌ API is not available");
  }
});
```

### Simple Test Script

```javascript
// test-api.js
async function testRemoAPI() {
  const testCases = [
    "Hello, who are you?",
    "Set a reminder for tomorrow 9am",
    'Add "buy groceries" to my todo list',
    "What can you help me with?",
  ];

  for (const testMessage of testCases) {
    console.log(`\n🧪 Testing: "${testMessage}"`);

    try {
      const response = await fetch("https://remo-server.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testMessage,
          conversation_history: [],
        }),
      });

      const data = await response.json();
      console.log(`✅ Response: ${data.response.substring(0, 100)}...`);
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    // Wait between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

testRemoAPI();
```

## Best Practices

1. **Always handle errors gracefully**
2. **Implement loading states**
3. **Store conversation history for context**
4. **Use TypeScript for type safety**
5. **Implement retry logic for network issues**
6. **Add rate limiting on the client side**
7. **Validate input before sending**
8. **Provide user feedback for all actions**

---

**Happy integrating with Remo! 🤖✨**
