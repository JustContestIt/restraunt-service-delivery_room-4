# OpenAI Integration & Memory Guide

## Overview
This guide explains how to set up and use the AI-powered chatbot with OpenAI integration and conversation memory features.

## Features

### 1. OpenAI Integration
- Real-time AI-powered responses using GPT-4 or GPT-3.5
- Context-aware recommendations based on conversation
- Natural language understanding
- Smart restaurant and meal suggestions

### 2. Conversation Memory
- Persistent memory stored in browser's localStorage
- Remembers user preferences (cuisines, budget, dietary restrictions)
- Maintains conversation history (last 20 messages)
- Cross-session memory retention

### 3. Dual Mode Operation
- **AI Mode**: Uses OpenAI API for intelligent responses
- **Basic Mode**: Falls back to keyword-based matching (no API key needed)

## Setup Instructions

### Step 1: Get OpenAI API Key

1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)
5. Store it securely - you won't be able to see it again!

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   VITE_OPENAI_MODEL=gpt-3.5-turbo
   ```

3. Choose your model:
   - `gpt-3.5-turbo` - Faster, cheaper ($0.0015/1K tokens)
   - `gpt-4-turbo-preview` - More intelligent, slower ($0.01/1K tokens)

### Step 3: Install the Component

Replace the basic chatbot with the AI-powered version in your [App.tsx](frontend/src/App.tsx):

```tsx
// Replace this:
import { AIChatbot } from './components/AIChatbot';

// With this:
import { AIChatbotWithMemory } from './components/AIChatbotWithMemory';

// Then in your component:
<AIChatbotWithMemory />
```

### Step 4: Restart Development Server

```bash
npm run dev
```

The chatbot will now use OpenAI when AI mode is enabled!

## How It Works

### Memory System

The chatbot stores conversation data in browser localStorage:

```typescript
interface ConversationMemory {
  preferences: {
    cuisines: string[];        // Detected favorite cuisines
    budget?: { min: number; max: number };
    dietary: string[];         // Dietary restrictions
    favoriteRestaurants: string[];
  };
  history: ChatMessage[];      // Last 20 messages
  lastInteraction: Date;
}
```

**Key Features:**
- Automatically extracts preferences from conversation
- Persists across browser sessions
- Can be cleared manually by user
- Keeps last 20 messages to manage size

### OpenAI Service

The service ([openai.ts](frontend/src/services/openai.ts)) handles:

1. **System Prompt Creation**: Includes all restaurant data
2. **Context Management**: Sends conversation history
3. **Recommendation Parsing**: Extracts mentioned restaurants/meals
4. **Error Handling**: Falls back gracefully on API errors

### Request Flow

```
User Input → Component → OpenAI Service → API Request
                ↓
         Update Memory
                ↓
    AI Response ← Parse Recommendations ← API Response
```

## Usage Examples

### Example 1: Using Memory
```
User: "I love Italian food"
Bot: "Great! I'll remember you love Italian cuisine..."

[Later in conversation or next session]
User: "What should I eat today?"
Bot: "Based on your preference for Italian cuisine, I recommend..."
```

### Example 2: Budget Tracking
```
User: "I have $20 to spend"
Bot: "Perfect! I'll keep your $20 budget in mind..."

[Next question]
User: "Show me some options"
Bot: "Here are great restaurants within your $20 budget..."
```

### Example 3: Complex Query
```
User: "I want something spicy but not too expensive, maybe under $15. I liked that Japanese place you suggested before"
Bot: [Uses memory of previous Japanese recommendation + new budget constraint + spicy preference]
```

## UI Features

### Header Controls
- **AI Toggle**: Switch between AI and Basic mode
- **View Memory**: See stored preferences
- **Clear Memory**: Reset conversation history

### Quick Actions
Pre-filled suggestion buttons for common queries:
- "Italian under $15"
- "My preferences"
- "Surprise me!"

### Loading States
Animated dots show when AI is processing

### Suggestions
Visual cards display recommended restaurants and meals with images

## Configuration Options

### Adjust Memory Size

In [AIChatbotWithMemory.tsx](frontend/src/components/AIChatbotWithMemory.tsx):

```tsx
// Keep last 20 messages (10 exchanges)
const trimmedHistory = newHistory.slice(-20);

// Change to keep more/less:
const trimmedHistory = newHistory.slice(-40); // 20 exchanges
```

### Customize System Prompt

Edit the `createSystemPrompt()` method in [openai.ts](frontend/src/services/openai.ts):

```tsx
return `You are a friendly restaurant assistant...
[Add your custom instructions here]
`;
```

### Temperature Control

Adjust response creativity in [openai.ts](frontend/src/services/openai.ts):

```tsx
temperature: 0.7,  // 0 = focused, 1 = creative
max_tokens: 500,   // Response length
```

## Cost Management

### Estimated Costs (GPT-3.5-turbo)
- Average request: ~1500 tokens
- Cost per request: ~$0.002
- 1000 conversations: ~$2

### Tips to Reduce Costs
1. Use GPT-3.5 instead of GPT-4
2. Limit conversation history length
3. Add basic filtering before AI calls
4. Cache common responses
5. Set usage limits in OpenAI dashboard

### Monitor Usage
Check your usage at: [https://platform.openai.com/usage](https://platform.openai.com/usage)

## Troubleshooting

### "API key is not configured"
- Check `.env` file exists in frontend folder
- Verify key starts with `sk-`
- Restart dev server after adding key
- Make sure you're using `VITE_` prefix

### "Rate limit exceeded"
- OpenAI free tier has limits
- Wait a few minutes and try again
- Add payment method for higher limits

### "Invalid API key"
- Generate a new key from OpenAI dashboard
- Don't share your key publicly
- Check for extra spaces in `.env`

### Memory not persisting
- Check browser allows localStorage
- Clear browser cache and test again
- Check browser console for errors

### Suggestions not showing
- Verify restaurant names match data exactly
- Check console for parsing errors
- Try more specific dish names in responses

## Security Best Practices

### API Key Protection
- **NEVER** commit `.env` to git
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys regularly

### Production Deployment
For production, use backend proxy:

```typescript
// Instead of direct API calls:
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

// Use your backend:
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message })
});
```

This keeps your API key secure on the server.

## Advanced Features

### Adding Embeddings for Semantic Search

```typescript
// Store restaurant embeddings
const embedding = await openAIService.createEmbedding(restaurant.description);

// Find similar restaurants
const similar = findSimilar(userQuery, restaurantEmbeddings);
```

### Function Calling

Enable structured outputs:

```typescript
functions: [{
  name: 'recommend_restaurants',
  parameters: {
    type: 'object',
    properties: {
      restaurants: { type: 'array' },
      reasoning: { type: 'string' }
    }
  }
}]
```

### Streaming Responses

For real-time word-by-word display:

```typescript
stream: true,
// Then handle response chunks
```

## Alternative: Using Claude API

To use Anthropic's Claude instead:

1. Get API key from [https://console.anthropic.com/](https://console.anthropic.com/)
2. Update service to use Claude endpoints
3. Adjust prompt format for Claude

## Testing Without API Key

The chatbot works in Basic Mode without an API key:
- Toggle AI mode off in the header
- Uses keyword matching instead
- Good for testing UI/UX

## Browser Compatibility

### LocalStorage Support
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge All

### Memory Limits
- Most browsers: 5-10MB localStorage
- Current implementation: ~50KB per conversation
- Supports ~100 conversations before cleanup needed

## Performance Optimization

### Reduce Request Time
1. Use GPT-3.5 (faster than GPT-4)
2. Lower max_tokens (shorter responses)
3. Cache system prompts
4. Debounce user input

### Memory Optimization
1. Trim old messages
2. Compress stored data
3. Clear old conversations
4. Use IndexedDB for large data

## Next Steps

### Recommended Enhancements
1. **User Accounts**: Sync memory across devices
2. **Analytics**: Track popular queries
3. **A/B Testing**: Compare AI vs Basic mode
4. **Feedback Loop**: Let users rate responses
5. **Multi-language**: Support other languages
6. **Voice Input**: Add speech-to-text
7. **Order Integration**: Place orders from chat
8. **Image Upload**: "Find meals that look like this"

## Support & Resources

- OpenAI Documentation: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- API Reference: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)
- Community: [https://community.openai.com/](https://community.openai.com/)
- Status: [https://status.openai.com/](https://status.openai.com/)

## FAQ

**Q: Can I use this without OpenAI?**
A: Yes! Toggle off AI mode for basic keyword matching.

**Q: Does memory work offline?**
A: Yes, memory persists in localStorage. Only AI responses need internet.

**Q: How do I delete my conversation data?**
A: Click "Clear Memory" button or clear browser localStorage.

**Q: Can I use GPT-4?**
A: Yes, change `VITE_OPENAI_MODEL=gpt-4-turbo-preview` in `.env`

**Q: Is my data sent to OpenAI?**
A: Yes, messages and restaurant data are sent for processing. See OpenAI's privacy policy.

## License

This integration is part of the Restaurant Delivery Service application.
