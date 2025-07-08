# Account Deletion and Subscription Cancellation Integration

This document explains how the account deletion process works with subscription cancellation in the REMO AI application.

## Overview

When a user requests to delete their account, the system performs the following steps in order:

1. **Subscription Cancellation**: Cancels the user's Stripe subscription immediately
2. **Account Deletion**: Deletes all user data from the REMO server
3. **User Logout**: Logs out the user and redirects them

## Architecture

### Components Involved

1. **Stripe-BackEnd** (`/Stripe-BackEnd/index.js`)
   - Handles subscription cancellation via Stripe API
   - Sends confirmation emails to users

2. **REMO-SERVER** (`/REMO-SERVER/app.py`)
   - Handles account deletion and data cleanup
   - Manages user data in DynamoDB

3. **REMO-APP** (`/REMO-APP/src/components/SettingsModal.tsx` & `/REMO-APP/src/pages/Settings.tsx`)
   - Provides user interface for account deletion
   - Orchestrates the deletion process

## API Endpoints

### Stripe Backend Endpoints

#### POST `/api/cancel-subscription`
Cancels a user's subscription immediately.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "subscription_id": "sub_1234567890",
  "status": "canceled",
  "email_sent": true,
  "cancelled_at": "2024-01-01T12:00:00.000Z"
}
```

### REMO Server Endpoints

#### DELETE `/account/delete`
Deletes user account and all associated data.

**Request Body:**
```json
{
  "user_id": "user_123",
  "confirmation": "DELETE_ACCOUNT",
  "reason": "User requested account deletion"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account and all associated data deleted successfully",
  "user_id": "user_123",
  "deleted_data_types": ["conversations", "reminders", "todos", "preferences"],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Environment Variables

### REMO-APP Environment Variables

Add these to your `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_STRIPE_API_URL=http://localhost:3001

# Production URLs
# VITE_API_URL=https://your-backend-domain.com
# VITE_STRIPE_API_URL=https://your-stripe-backend-domain.com
```

## User Flow

### 1. User Initiates Account Deletion

The user clicks "Delete Account" in the Settings modal or Settings page.

### 2. Warning Modal (Settings Modal Only)

A detailed warning modal appears explaining:
- What data will be deleted
- That the subscription will be cancelled
- That the action cannot be undone

### 3. Subscription Cancellation

The system calls the Stripe backend to cancel the subscription:
- Finds the customer by email
- Cancels the active subscription immediately
- Sends a confirmation email to the user

### 4. Account Deletion

The system calls the REMO server to delete the account:
- Deletes all user data from DynamoDB
- Clears conversation memory and context
- Removes user from managers cache
- Logs the deletion for audit purposes

### 5. User Logout

The user is logged out and redirected to the appropriate page.

## Error Handling

### Graceful Degradation

If subscription cancellation fails:
- The system logs the error
- Continues with account deletion
- User is still logged out and account is deleted

### User Feedback

- Loading states are shown during the process
- Success/error messages are displayed
- Users are informed of the outcome

## Security Considerations

### Confirmation Requirements

- Users must type "DELETE_ACCOUNT" to confirm (Settings page)
- Users must click through a warning modal (Settings modal)
- Server validates the confirmation string

### Data Privacy

- All user data is permanently deleted
- No data is retained after account deletion
- Audit logs may be kept for compliance

## Testing

### Local Development

1. Start the Stripe backend:
   ```bash
   cd Stripe-BackEnd
   npm start
   ```

2. Start the REMO server:
   ```bash
   cd REMO-SERVER
   python app.py
   ```

3. Start the REMO app:
   ```bash
   cd REMO-APP
   npm run dev:web
   ```

### Test Scenarios

1. **User with active subscription**: Verify subscription is cancelled and account is deleted
2. **User without subscription**: Verify account deletion works without subscription cancellation
3. **Network errors**: Verify graceful handling of API failures
4. **Invalid confirmation**: Verify proper validation

## Monitoring

### Logs to Monitor

- Stripe subscription cancellation logs
- Account deletion logs in REMO server
- User feedback and error messages

### Metrics to Track

- Account deletion success rate
- Subscription cancellation success rate
- Time taken for complete deletion process
- Error rates for each step

## Troubleshooting

### Common Issues

1. **Subscription not found**: User may not have an active subscription
2. **Email not found**: User email may not match Stripe customer email
3. **Network timeouts**: API calls may timeout in slow networks
4. **Permission errors**: Stripe API keys may be invalid

### Debug Steps

1. Check browser console for API call errors
2. Verify environment variables are set correctly
3. Check Stripe backend logs for subscription cancellation errors
4. Check REMO server logs for account deletion errors

## Future Enhancements

### Potential Improvements

1. **Webhook integration**: Use Stripe webhooks for real-time subscription updates
2. **Data export**: Allow users to export their data before deletion
3. **Scheduled deletion**: Allow users to schedule account deletion
4. **Recovery period**: Add a grace period for account recovery
5. **Analytics**: Track deletion reasons for product improvement 