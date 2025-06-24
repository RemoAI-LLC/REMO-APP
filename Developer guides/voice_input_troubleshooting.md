# Voice Input Troubleshooting Guide

This guide helps you resolve common voice input (speech recognition) issues in Remo AI Assistant.

## 🚨 Common Issues & Solutions

### **1. "Network error. Please check your internet connection."**

**What it means:** The speech recognition service is unavailable, not necessarily a network issue.

**Possible causes:**

- Browser compatibility issues
- Microphone not working
- Speech recognition service temporarily down
- Browser settings blocking speech recognition

**Solutions:**

1. **Try a different browser** (Chrome or Edge work best)
2. **Check microphone permissions** in browser settings
3. **Refresh the page** and try again
4. **Check if microphone is working** in other apps
5. **Try using localhost** instead of IP address

### **2. "Microphone permission denied"**

**What it means:** Browser is blocking microphone access.

**Solutions:**

1. **Click the microphone icon** in the browser address bar
2. **Select "Allow"** for microphone access
3. **Check browser settings:**
   - Chrome: Settings → Privacy and security → Site Settings → Microphone
   - Edge: Settings → Cookies and site permissions → Microphone
   - Safari: Safari → Preferences → Websites → Microphone

### **3. "Speech recognition not supported"**

**What it means:** Your browser doesn't support the Web Speech API.

**Solutions:**

1. **Use Chrome or Edge** (best support)
2. **Update your browser** to the latest version
3. **Try a different browser** if available
4. **Use text input** as fallback

### **4. "No speech detected"**

**What it means:** The microphone didn't pick up any speech.

**Solutions:**

1. **Speak clearly and loudly**
2. **Check microphone volume** in system settings
3. **Use a quiet environment**
4. **Wait for the "Listening..." indicator** before speaking
5. **Try speaking for longer** (at least 2-3 seconds)

### **5. "Microphone not found or not working"**

**What it means:** No microphone detected or microphone is broken.

**Solutions:**

1. **Check microphone connection** (if external)
2. **Test microphone** in other applications
3. **Check system microphone settings**
4. **Try a different microphone** if available
5. **Restart browser** and try again

## 🔧 Browser-Specific Issues

### **Chrome**

- **Best support** for speech recognition
- **Check permissions:** chrome://settings/content/microphone
- **Clear site data** if having issues
- **Disable extensions** that might interfere

### **Edge**

- **Good support** for speech recognition
- **Check permissions:** edge://settings/content/microphone
- **Update to latest version**

### **Safari**

- **Limited support** for speech recognition
- **May not work** on all versions
- **Try Chrome or Edge** instead

### **Firefox**

- **No support** for Web Speech API
- **Use Chrome or Edge** for voice input

## 🌐 HTTPS Requirements

### **Why HTTPS is Required:**

- Speech recognition requires a **secure context**
- Works on `localhost` for development
- Requires HTTPS in production

### **Development:**

```bash
# Use localhost instead of IP address
http://localhost:3000  # ✅ Works
http://127.0.0.1:3000  # ❌ May not work
```

### **Production:**

```bash
# Must use HTTPS
https://yourdomain.com  # ✅ Works
http://yourdomain.com   # ❌ Won't work
```

## 🎤 Microphone Setup

### **System Microphone Check:**

1. **Windows:** Settings → System → Sound → Input
2. **Mac:** System Preferences → Sound → Input
3. **Linux:** Sound Settings → Input

### **Browser Microphone Test:**

1. Go to [https://www.google.com](https://www.google.com)
2. Click the microphone icon in search
3. Try speaking - if it works, your microphone is fine

### **Microphone Troubleshooting:**

1. **Check if microphone is muted**
2. **Test with other applications**
3. **Check microphone permissions** in system settings
4. **Try a different microphone** if available

## 🐛 Debug Information

### **Enable Console Logging:**

Open browser developer tools (F12) and check the console for:

- Speech recognition errors
- Browser compatibility info
- HTTPS status
- Microphone permission status

### **Debug Commands:**

```javascript
// Check browser support
console.log("SpeechRecognition:", "SpeechRecognition" in window);
console.log("webkitSpeechRecognition:", "webkitSpeechRecognition" in window);

// Check HTTPS
console.log("HTTPS:", window.location.protocol === "https:");
console.log("Secure Context:", window.isSecureContext);

// Check microphone permissions
if (navigator.permissions) {
  navigator.permissions.query({ name: "microphone" }).then((result) => {
    console.log("Microphone permission:", result.state);
  });
}
```

## 🔄 Alternative Solutions

### **If Voice Input Doesn't Work:**

1. **Use text input** - Type your messages instead
2. **Try different browser** - Chrome or Edge
3. **Check microphone** in system settings
4. **Restart browser** and try again
5. **Clear browser cache** and cookies
6. **Disable browser extensions** temporarily

### **Fallback Options:**

- **Text input** is always available
- **Copy-paste** from other applications
- **Use mobile device** with better microphone

## 📱 Mobile Considerations

### **Mobile Browser Support:**

- **Chrome Mobile:** Good support
- **Safari Mobile:** Limited support
- **Firefox Mobile:** No support

### **Mobile Tips:**

1. **Use Chrome** on mobile devices
2. **Hold device close** to mouth
3. **Use quiet environment**
4. **Check mobile permissions** in settings

## 🚀 Production Deployment

### **HTTPS Setup:**

```bash
# For Vercel
# HTTPS is automatically enabled

# For Netlify
# HTTPS is automatically enabled

# For custom server
# Install SSL certificate
```

### **Domain Considerations:**

- **Use HTTPS** in production
- **Check browser compatibility** with target users
- **Provide fallback** for unsupported browsers

## 🎯 Best Practices

### **For Users:**

1. **Use Chrome or Edge** for best experience
2. **Allow microphone permissions** when prompted
3. **Speak clearly** in quiet environment
4. **Wait for "Listening..."** before speaking
5. **Use text input** as fallback

### **For Developers:**

1. **Test on multiple browsers**
2. **Provide clear error messages**
3. **Implement graceful fallbacks**
4. **Check HTTPS requirements**
5. **Monitor console for errors**

## 📞 Getting Help

### **If Issues Persist:**

1. **Check browser console** for error messages
2. **Try different browser** (Chrome/Edge)
3. **Test microphone** in other applications
4. **Check system microphone settings**
5. **Use text input** as temporary solution

### **Debug Information to Collect:**

- Browser name and version
- Operating system
- Error messages from console
- Microphone type and settings
- Steps to reproduce the issue

---

**Most voice input issues can be resolved by using Chrome/Edge and ensuring microphone permissions are granted! 🎤✨**
