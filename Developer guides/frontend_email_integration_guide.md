# Frontend Email Integration Guide

This guide covers the frontend implementation of email functionality in the Remo chat interface, providing a seamless user experience for email management through natural language.

## Overview

The frontend email integration allows users to:
- Connect their Gmail account securely via OAuth
- Use natural language to compose, send, and manage emails
- Get real-time email status and suggestions
- Maintain privacy by never exposing credentials in chat

## Architecture

### Components

1. **EmailSetupModal**: Secure OAuth flow for Gmail connection
2. **EmailStatusIndicator**: Shows connection status in chat header
3. **Email Intent Detection**: Detects email-related requests in user messages
4. **Enhanced Chat Interface**: Integrates email functionality seamlessly

### Security Features

- **OAuth 2.0 Authentication**: No credentials stored in frontend
- **Secure Token Storage**: Tokens stored securely in backend
- **Privacy-First Design**: No sensitive data in chat messages
- **User Consent**: Clear permissions and disconnect options

## Implementation Details

### 1. Email Setup Modal (`EmailSetupModal.tsx`)

The modal provides a secure way to connect Gmail accounts:

```typescript
interface EmailSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}
```

**Features:**
- OAuth flow initiation
- Real-time connection status
- Automatic polling for completion
- Error handling and timeout management
- Disconnect functionality

**OAuth Flow:**
1. User clicks "Connect with Google"
2. Opens Google OAuth consent screen in popup
3. User authorizes Remo to access Gmail
4. Backend receives callback and stores tokens
5. Frontend polls for completion
6. Modal closes and shows success message

### 2. Email Status Indicator (`EmailStatusIndicator.tsx`)

Shows Gmail connection status in the chat header:

```typescript
interface EmailStatusIndicatorProps {
  userId: string;
  onSetupClick: () => void;
}
```

**States:**
- **Loading**: Checking connection status
- **Connected**: Green indicator with settings access
- **Not Connected**: Blue "Connect Gmail" button

### 3. Email Intent Detection (`emailIntentDetection.ts`)

Detects email-related intents in user messages:

```typescript
interface EmailIntent {
  type: 'compose' | 'send' | 'schedule' | 'search' | 'summary' | 'manage' | 'none';
  confidence: number;
  details?: {
    recipients?: string[];
    subject?: string;
    body?: string;
    scheduleTime?: string;
    searchQuery?: string;
  };
}
```

**Supported Intents:**
- **Compose**: "write email", "compose message"
- **Send**: "send email to john@example.com"
- **Schedule**: "schedule meeting for tomorrow"
- **Search**: "search my emails for project"
- **Summary**: "email summary", "how many emails"
- **Manage**: "mark read", "archive", "forward"

### 4. Enhanced Chat Interface

The Home component integrates email functionality:

```typescript
// Email intent detection in message handling
const emailIntent = detectEmailIntent(inputText);

// Show setup prompt if email intent detected but not connected
if (emailIntent.type !== 'none' && emailIntent.confidence > 0.7 && !emailConnected) {
  // Show Gmail setup prompt
}
```

## User Experience Flow

### 1. First-Time Email User

1. **User types**: "Schedule a meeting for tomorrow"
2. **System detects**: Email intent (schedule, confidence: 0.9)
3. **Frontend checks**: Gmail connection status
4. **If not connected**: Shows setup prompt
5. **User clicks**: "Connect Gmail" button
6. **OAuth flow**: Opens Google consent screen
7. **After authorization**: Success message in chat
8. **User can now**: Use email features naturally

### 2. Connected User Experience

1. **User types**: "Send email to john@example.com about project update"
2. **System detects**: Email intent (send, confidence: 0.8)
3. **Frontend checks**: Gmail connected ✓
4. **Message sent**: To backend email agent
5. **Backend processes**: Composes and sends email
6. **Response**: Confirmation message in chat

### 3. Voice Input Support

The same flow works with voice input:
- Voice transcription → Intent detection → Email processing
- Seamless integration with existing voice features

## API Integration

### Backend Endpoints Used

```typescript
// Check authentication status
GET /auth/status/{user_id}

// Initiate OAuth flow
GET /auth/google/login

// OAuth callback (handled by backend)
GET /auth/google/callback

// Disconnect Gmail
DELETE /auth/logout/{user_id}

// Chat with email agent
POST /chat
```

### Request Format

```typescript
// Chat request with email intent
{
  message: "Schedule a meeting for tomorrow",
  conversation_history: [...],
  user_id: "user_123"
}
```

## Security Considerations

### OAuth Implementation

- **Popup Window**: Isolated OAuth flow
- **Polling**: Secure status checking
- **Timeout**: 5-minute authentication timeout
- **Error Handling**: Graceful failure handling

### Data Privacy

- **No Credentials**: Never stored in frontend
- **Token Security**: Stored securely in backend
- **User Control**: Easy disconnect option
- **Clear Permissions**: Transparent scope access

## Error Handling

### Common Scenarios

1. **OAuth Timeout**
   - User gets timeout message
   - Can retry connection
   - Clear error messaging

2. **Network Issues**
   - Graceful degradation
   - Retry mechanisms
   - User-friendly error messages

3. **Permission Denied**
   - Clear explanation
   - Alternative suggestions
   - Easy retry option

## Testing

### Manual Testing

1. **OAuth Flow**
   ```bash
   # Start frontend
   npm run dev
   
   # Start backend
   python app.py
   
   # Test OAuth flow
   # 1. Open chat
   # 2. Type email request
   # 3. Click "Connect Gmail"
   # 4. Complete OAuth
   # 5. Verify success
   ```

2. **Email Functionality**
   ```bash
   # Test email intents
   - "Schedule a meeting for tomorrow"
   - "Send email to test@example.com"
   - "Search my emails for project"
   ```

### Automated Testing

```typescript
// Test email intent detection
describe('Email Intent Detection', () => {
  test('detects compose intent', () => {
    const intent = detectEmailIntent('compose an email');
    expect(intent.type).toBe('compose');
    expect(intent.confidence).toBeGreaterThan(0.7);
  });
  
  test('detects schedule intent', () => {
    const intent = detectEmailIntent('schedule meeting for tomorrow');
    expect(intent.type).toBe('schedule');
    expect(intent.confidence).toBeGreaterThan(0.7);
  });
});
```

## Configuration

### Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000

# Backend (.env)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### Google Cloud Console Setup

1. Create OAuth 2.0 credentials
2. Add authorized redirect URIs
3. Enable Gmail API
4. Configure consent screen

## Best Practices

### User Experience

1. **Progressive Enhancement**: Email features enhance existing chat
2. **Clear Feedback**: Always show connection status
3. **Helpful Suggestions**: Provide examples and guidance
4. **Graceful Degradation**: Work without email connection

### Security

1. **OAuth Only**: Never ask for passwords
2. **Minimal Scopes**: Request only necessary permissions
3. **User Control**: Easy disconnect and revoke access
4. **Clear Permissions**: Transparent about data access

### Performance

1. **Lazy Loading**: Load email components on demand
2. **Caching**: Cache connection status
3. **Optimistic UI**: Show immediate feedback
4. **Error Recovery**: Graceful error handling

## Troubleshooting

### Common Issues

1. **OAuth Popup Blocked**
   - Solution: Allow popups for the domain
   - Fallback: Manual redirect

2. **Connection Timeout**
   - Solution: Check network and retry
   - Fallback: Manual setup instructions

3. **Permission Denied**
   - Solution: Clear browser data and retry
   - Fallback: Alternative authentication methods

### Debug Mode

```typescript
// Enable debug logging
const DEBUG_EMAIL = true;

if (DEBUG_EMAIL) {
  console.log('Email intent detected:', emailIntent);
  console.log('Auth status:', authStatus);
}
```

## Future Enhancements

### Planned Features

1. **Outlook Integration**: Microsoft Graph API support
2. **Email Templates**: Pre-defined email templates
3. **Smart Suggestions**: AI-powered email composition
4. **Calendar Integration**: Meeting scheduling with calendar
5. **Email Analytics**: Usage insights and optimization

### Technical Improvements

1. **Real-time Updates**: WebSocket for live email status
2. **Offline Support**: Queue emails when offline
3. **Multi-account**: Support multiple email accounts
4. **Advanced Search**: Semantic email search
5. **Email Automation**: Rules and filters

## Resources

- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [React OAuth Best Practices](https://react-oauth.github.io/)
- [TypeScript OAuth Patterns](https://www.typescriptlang.org/docs/) 