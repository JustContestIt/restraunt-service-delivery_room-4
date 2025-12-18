# AI Restaurant Chatbot Documentation

## Overview
The AI Restaurant Chatbot is an intelligent assistant that helps users discover restaurants and meals based on their preferences, dietary requirements, and budget constraints. It provides personalized recommendations through natural language conversations.

## Features

### 1. Natural Language Understanding
The chatbot analyzes user messages to detect:
- **Cuisine Preferences**: Italian, Chinese, Japanese, Mexican, American, Indian, Thai, French
- **Budget Constraints**: Specific ranges (e.g., "$10-$20") or keywords (cheap, expensive, premium)
- **Dietary Requirements**: Vegetarian, vegan, and other dietary preferences
- **Meal Types**: Breakfast, lunch, dinner, dessert, appetizers

### 2. Smart Recommendations
- Recommends restaurants based on rating, cuisine, and budget
- Suggests specific meals from top-rated restaurants
- Filters recommendations based on user's combined preferences
- Displays visual cards with images, prices, and ratings

### 3. Interactive UI
- Fixed chat button in the bottom-right corner
- Expandable chat window with smooth animations
- Real-time message display with sender differentiation
- Quick action buttons for common queries
- Auto-scrolling to latest messages

## How It Works

### Message Analysis
The chatbot uses keyword matching and pattern recognition to understand user intent:

```
User: "I want Italian food under $15"
Detected:
- Cuisine: Italian
- Budget: $0-$15
- Meal Type: Any
```

### Recommendation Algorithm
1. **Filter Restaurants**: By cuisine, budget (average menu price)
2. **Sort**: By rating (highest first)
3. **Select**: Top 3 restaurants
4. **Find Meals**: From top 2 restaurants matching preferences
5. **Display**: As interactive suggestion cards

## Integration Guide

### Step 1: Import the Component
```tsx
import { AIChatbot } from './components/AIChatbot';
```

### Step 2: Add to Your App
```tsx
function App() {
  return (
    <div>
      {/* Your existing components */}
      <AIChatbot />
    </div>
  );
}
```

### Step 3: Ensure Required Styles
The component uses Tailwind CSS classes. Make sure your project has:
- Tailwind CSS configured
- Primary color classes (primary-600, primary-700, etc.)

## Usage Examples

### Example 1: Cuisine-Based Search
```
User: "Show me Chinese restaurants"
Bot: "Great! Based on your preferences (Chinese cuisine),
     here are my recommendations:"
     [Displays Chinese restaurant cards]
```

### Example 2: Budget-Conscious Search
```
User: "I'm looking for something cheap"
Bot: "Great! Based on your preferences ($0-$15 budget),
     here are my recommendations:"
     [Displays affordable options]
```

### Example 3: Specific Meal Search
```
User: "What desserts do you recommend?"
Bot: "Great! Based on your preferences (dessert),
     here are my recommendations:"
     [Displays dessert options from various restaurants]
```

### Example 4: Combined Preferences
```
User: "I want Japanese sushi under $20 for lunch"
Bot: "Great! Based on your preferences (Japanese cuisine,
     $0-$20 budget, lunch), here are my recommendations:"
     [Displays filtered Japanese lunch options]
```

## Component Structure

### Main Components
- **AIChatbot**: Main component wrapper
- **Message Interface**: Defines message structure
- **Suggestion Interface**: Defines recommendation cards
- **UserPreferences Interface**: Stores user preferences

### Key Functions
- `analyzeUserMessage()`: Parses user input for preferences
- `generateRecommendations()`: Creates filtered suggestions
- `generateBotResponse()`: Builds bot reply with recommendations
- `handleSendMessage()`: Processes user input

## Customization

### Styling
Modify Tailwind classes in the component to match your brand:
```tsx
className="bg-primary-600 hover:bg-primary-700"
// Change to your brand colors
```

### Keywords
Add more cuisine or preference keywords in `analyzeUserMessage()`:
```tsx
const cuisineKeywords = {
  italian: ['italian', 'pasta', 'pizza', 'italy'],
  // Add more keywords
};
```

### Recommendation Logic
Adjust filtering in `generateRecommendations()`:
```tsx
// Change number of recommendations
filteredRestaurants.slice(0, 3) // Show top 3
```

## Technical Details

### State Management
- `messages`: Chat history array
- `userPreferences`: Accumulated user preferences
- `inputMessage`: Current input text
- `isOpen`: Chat window visibility

### Performance
- Uses React hooks for optimal re-rendering
- Auto-scrolling with refs
- Debounced bot responses (500ms delay)

### Data Source
Currently uses static restaurant data from:
```
frontend/src/data/restaurants.ts
```

For production, connect to your restaurant API or database.

## Future Enhancements

### Potential Features
1. **AI Integration**: Connect to OpenAI or Claude API for advanced NLP
2. **User Accounts**: Remember preferences across sessions
3. **Order Integration**: Direct ordering from chat
4. **Multi-language**: Support for multiple languages
5. **Voice Input**: Speech-to-text capability
6. **Image Recognition**: Upload food photos for recommendations
7. **Nutrition Info**: Calorie and nutritional data
8. **Allergy Warnings**: Alert users about allergens
9. **Review Integration**: Show recent customer reviews
10. **Real-time Availability**: Check restaurant hours and availability

## Troubleshooting

### Chatbot Not Appearing
- Ensure component is imported and rendered
- Check z-index conflicts with other fixed elements
- Verify Tailwind CSS is properly configured

### Recommendations Not Showing
- Verify restaurant data structure matches interfaces
- Check console for filtering errors
- Ensure budget ranges are reasonable

### Styling Issues
- Update Tailwind config with custom colors
- Rebuild CSS if using production builds
- Check for CSS class name conflicts

## API Integration (Future)

To connect with a real AI service:

```tsx
const generateBotResponse = async (userMessage: string) => {
  const response = await fetch('/api/chatbot', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage, preferences }),
  });
  const data = await response.json();
  return data;
};
```

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies
- React 18+
- TypeScript
- Tailwind CSS

## License
This component is part of the Restaurant Delivery Service application.

## Support
For issues or questions, please contact the development team or open an issue in the project repository.
