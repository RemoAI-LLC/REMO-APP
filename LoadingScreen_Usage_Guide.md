# LoadingScreen Component Usage Guide

The `LoadingScreen` component has been updated to be more flexible and reusable across your application. Here's how to use it in different contexts:

## Component Props

```typescript
interface LoadingScreenProps {
  onLoadingComplete?: () => void;  // Optional callback when loading completes
  duration?: number;                // Duration in milliseconds (default: 2000)
  isVisible?: boolean;              // Control visibility externally
  message?: string;                 // Custom loading message
  size?: 'small' | 'medium' | 'large';  // Size variants
  variant?: 'fullscreen' | 'inline' | 'overlay';  // Display variants
  showLogo?: boolean;               // Whether to show the logo
}
```

## Usage Examples

### 1. Fullscreen Loading (App initialization)
```tsx
import LoadingScreen from './components/LoadingScreen';

// In your App.tsx or main component
if (isLoading) {
  return <LoadingScreen 
    isVisible={isLoading}
    message="Loading application..."
    variant="fullscreen"
    size="large"
  />;
}
```

### 2. Overlay Loading (Data analysis, file uploads)
```tsx
// For components that need to show loading over existing content
{loading && (
  <LoadingScreen 
    isVisible={loading}
    message="Analyzing your data..."
    variant="overlay"
    size="medium"
  />
)}
```

### 3. Inline Loading (Buttons, small areas)
```tsx
// For buttons or small areas
<button className="relative">
  {isLoading ? (
    <LoadingScreen 
      isVisible={isLoading}
      message="Processing..."
      variant="inline"
      size="small"
      showLogo={false}
    />
  ) : (
    "Submit"
  )}
</button>
```

### 4. External Control
```tsx
// When you want to control the loading state externally
const [isLoading, setIsLoading] = useState(false);

<LoadingScreen 
  isVisible={isLoading}
  message="Connecting to service..."
  variant="inline"
  size="small"
  showLogo={false}
/>
```

## Variants Explained

- **`fullscreen`**: Covers the entire screen with a dark background
- **`overlay`**: Covers the entire screen with a semi-transparent background
- **`inline`**: Fits within the current container without covering other content

## Size Variants

- **`small`**: 16x16 (64px) - Good for buttons and small areas
- **`medium`**: 32x32 (128px) - Default size, good for most use cases
- **`large`**: 48x48 (192px) - Good for fullscreen loading

## Best Practices

1. **Use `showLogo={false}`** for inline loading in buttons to avoid visual clutter
2. **Use appropriate variants** based on context:
   - `fullscreen` for app initialization
   - `overlay` for data processing that shouldn't block the UI
   - `inline` for button states and small areas
3. **Provide meaningful messages** to improve user experience
4. **Use external control** (`isVisible`) when you need precise control over the loading state

## Updated Components

The following components have been updated to use the new LoadingScreen:

- ✅ `DataAnalystUpload.tsx` - Uses overlay loading for data analysis
- ✅ `EmailSetupModal.tsx` - Uses inline loading for connection states
- ✅ `ScheduleMeetingForm.tsx` - Uses inline loading for button states
- ✅ `ScheduleMeetingModal.tsx` - Uses inline loading for button states
- ✅ `SettingsModal.tsx` - Uses inline loading for account actions
- ✅ `Billing.tsx` - Uses inline loading for form submission
- ✅ `Integrations.tsx` - Uses inline loading for connection states
- ✅ `EmailStatusIndicator.tsx` - Uses inline loading for status checks
- ✅ `Dashboard.tsx` - Uses fullscreen loading for initial load and inline for refresh

## Migration from Old Loading Patterns

If you have existing loading patterns using `FaSpinner` or simple text, replace them with the appropriate LoadingScreen variant:

```tsx
// Old pattern
{isLoading && <FaSpinner className="animate-spin" />}

// New pattern
{isLoading && (
  <LoadingScreen 
    isVisible={isLoading}
    message="Loading..."
    variant="inline"
    size="small"
    showLogo={false}
  />
)}
```

This provides a consistent, branded loading experience across your entire application. 