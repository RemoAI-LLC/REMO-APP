/**
 * Email Intent Detection Utility
 * 
 * Detects email-related intents in user messages to provide better UX
 * and suggestions for email features.
 */

export interface EmailIntent {
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

export const detectEmailIntent = (message: string): EmailIntent => {
  const lowerMessage = message.toLowerCase();
  
  // Compose email intent
  if (
    lowerMessage.includes('compose') ||
    lowerMessage.includes('write') ||
    lowerMessage.includes('draft') ||
    lowerMessage.includes('create email') ||
    lowerMessage.includes('new email')
  ) {
    return {
      type: 'compose',
      confidence: 0.9,
      details: extractEmailDetails(message)
    };
  }
  
  // Send email intent
  if (
    lowerMessage.includes('send email') ||
    lowerMessage.includes('send mail') ||
    lowerMessage.includes('email to') ||
    lowerMessage.includes('mail to')
  ) {
    return {
      type: 'send',
      confidence: 0.8,
      details: extractEmailDetails(message)
    };
  }
  
  // Schedule email intent
  if (
    lowerMessage.includes('schedule') ||
    lowerMessage.includes('later') ||
    lowerMessage.includes('tomorrow') ||
    lowerMessage.includes('next week') ||
    lowerMessage.includes('at ') && (lowerMessage.includes('am') || lowerMessage.includes('pm'))
  ) {
    return {
      type: 'schedule',
      confidence: 0.7,
      details: extractEmailDetails(message)
    };
  }
  
  // Search emails intent
  if (
    lowerMessage.includes('search') ||
    lowerMessage.includes('find') ||
    lowerMessage.includes('look for') ||
    lowerMessage.includes('show emails') ||
    lowerMessage.includes('my emails')
  ) {
    return {
      type: 'search',
      confidence: 0.8,
      details: {
        searchQuery: extractSearchQuery(message)
      }
    };
  }
  
  // Email summary intent
  if (
    lowerMessage.includes('summary') ||
    lowerMessage.includes('overview') ||
    lowerMessage.includes('how many emails') ||
    lowerMessage.includes('email count')
  ) {
    return {
      type: 'summary',
      confidence: 0.9
    };
  }
  
  // Email management intent
  if (
    lowerMessage.includes('mark read') ||
    lowerMessage.includes('archive') ||
    lowerMessage.includes('forward') ||
    lowerMessage.includes('reply') ||
    lowerMessage.includes('delete email')
  ) {
    return {
      type: 'manage',
      confidence: 0.8
    };
  }
  
  // Meeting scheduling (common email use case)
  if (
    lowerMessage.includes('schedule meeting') ||
    lowerMessage.includes('set up meeting') ||
    lowerMessage.includes('book meeting') ||
    lowerMessage.includes('meeting with')
  ) {
    return {
      type: 'schedule',
      confidence: 0.9,
      details: {
        subject: 'Meeting',
        body: `Meeting scheduled as requested: ${message}`,
        ...extractEmailDetails(message)
      }
    };
  }
  
  return {
    type: 'none',
    confidence: 0
  };
};

const extractEmailDetails = (message: string) => {
  const details: any = {};
  
  // Extract email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = message.match(emailRegex);
  if (emails) {
    details.recipients = emails;
  }
  
  // Extract potential subject (text after "subject" or "about")
  const subjectMatch = message.match(/(?:subject|about)[:\s]+([^,]+)/i);
  if (subjectMatch) {
    details.subject = subjectMatch[1].trim();
  }
  
  // Extract potential body content
  const bodyMatch = message.match(/(?:body|content|message)[:\s]+(.+)/i);
  if (bodyMatch) {
    details.body = bodyMatch[1].trim();
  }
  
  return details;
};

const extractSearchQuery = (message: string) => {
  // Remove common search words and return the rest
  const searchWords = ['search', 'find', 'look for', 'show', 'emails', 'email'];
  let query = message.toLowerCase();
  
  searchWords.forEach(word => {
    query = query.replace(new RegExp(word, 'gi'), '');
  });
  
  return query.trim();
};

export const getEmailSuggestions = (intent: EmailIntent): string[] => {
  switch (intent.type) {
    case 'compose':
      return [
        "What's the subject of your email?",
        "Who would you like to send it to?",
        "What would you like to write about?"
      ];
    
    case 'send':
      return [
        "I can help you send that email. Do you have the recipient's email address?",
        "What's the subject line?",
        "What message would you like to include?"
      ];
    
    case 'schedule':
      return [
        "When would you like to schedule this for?",
        "What time works best for you?",
        "Should I send it tomorrow or on a specific date?"
      ];
    
    case 'search':
      return [
        "What are you looking for in your emails?",
        "Would you like to search by sender, subject, or content?",
        "How far back should I search?"
      ];
    
    case 'summary':
      return [
        "I can show you a summary of your recent emails.",
        "How many days back would you like to see?",
        "Would you like to see unread emails only?"
      ];
    
    default:
      return [
        "I can help you with emails! Try saying:",
        "• 'Send an email to john@example.com'",
        "• 'Schedule a meeting for tomorrow'",
        "• 'Search my emails for project updates'"
      ];
  }
}; 