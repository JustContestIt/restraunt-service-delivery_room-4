# Restaurant Service Delivery Platform

A modern, full-featured restaurant delivery service with AI-powered recommendation chatbot built with React, TypeScript, and OpenAI integration.

## Features

### Core Functionality
- Browse restaurants by cuisine type (Italian, Chinese, Japanese, Mexican, American, Indian, Thai, French)
- View detailed restaurant menus with images and descriptions
- Shopping cart management with real-time updates
- Responsive design for mobile and desktop
- Beautiful UI with Tailwind CSS

### AI Chatbot Assistant
- **Natural Language Understanding**: Detects user preferences for cuisines, budget, and meal types
- **OpenAI Integration**: Powered by GPT-3.5/GPT-4 for intelligent responses
- **Conversation Memory**: Remembers user preferences across sessions
- **Smart Recommendations**: Personalized restaurant and meal suggestions
- **Dual Mode**: AI-powered or Basic mode (no API key needed)
- **Budget-Aware Filtering**: Finds options within user's price range

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hooks** for state management

### AI Integration
- **OpenAI API** (GPT-3.5-turbo / GPT-4)
- **LocalStorage** for conversation memory
- Custom service layer for API communication

## Project Structure

```
restaurant-delivery-service/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChatbot.tsx              # Basic chatbot
│   │   │   ├── AIChatbotWithMemory.tsx    # AI-powered chatbot
│   │   │   ├── Cart.tsx                   # Shopping cart
│   │   │   ├── CuisineFilter.tsx          # Cuisine selection
│   │   │   ├── Header.tsx                 # App header
│   │   │   ├── MenuItemCard.tsx           # Menu item display
│   │   │   ├── RestaurantCard.tsx         # Restaurant card
│   │   │   └── RestaurantMenu.tsx         # Restaurant menu view
│   │   ├── services/
│   │   │   └── openai.ts                  # OpenAI API service
│   │   ├── data/
│   │   │   └── restaurants.ts             # Restaurant data
│   │   ├── hooks/
│   │   │   └── useCart.tsx                # Cart management hook
│   │   ├── types/
│   │   │   └── index.ts                   # TypeScript types
│   │   ├── App.tsx                        # Main app component
│   │   ├── main.tsx                       # App entry point
│   │   └── index.css                      # Global styles
│   ├── .env.example                       # Environment variables template
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── AI_Chatbot_Documentation.md            # Basic chatbot guide
├── OpenAI_Integration_Guide.md            # OpenAI setup guide
└── README.md                              # This file
```

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd restaurant-delivery-service
```

2. Install dependencies:
```bash
cd frontend
npm install
```

3. Configure environment (optional for AI features):
```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

4. Start development server:
```bash
npm run dev
```

5. Open browser at `http://localhost:5173`

## Configuration

### OpenAI API Setup (Optional)

To enable AI-powered chatbot features:

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Create `.env` file in `frontend/` directory:
```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

3. Choose your model:
   - `gpt-3.5-turbo` - Faster, cheaper (~$0.002 per conversation)
   - `gpt-4-turbo-preview` - Smarter, slower (~$0.02 per conversation)

4. Update `App.tsx` to use AI chatbot:
```tsx
// Replace:
import { AIChatbot } from './components/AIChatbot';

// With:
import { AIChatbotWithMemory } from './components/AIChatbotWithMemory';
```

See [OpenAI_Integration_Guide.md](OpenAI_Integration_Guide.md) for detailed setup instructions.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Features Overview

### Restaurant Browsing
- Filter by 8 different cuisines
- View restaurant ratings and delivery times
- Click to see detailed menus

### Shopping Cart
- Add items to cart
- Update quantities
- Remove items
- See total price
- Order summary

### AI Chatbot
- Click chat button in bottom-right corner
- Ask for recommendations
- Specify budget constraints
- Get personalized suggestions
- View memory/preferences
- Clear conversation history

### Example Chatbot Queries
- "I want Italian food under $15"
- "Show me sushi restaurants"
- "What desserts do you recommend?"
- "I'm looking for something spicy but cheap"
- "Surprise me with something new!"

## Documentation

- [AI_Chatbot_Documentation.md](AI_Chatbot_Documentation.md) - Basic chatbot features and usage
- [OpenAI_Integration_Guide.md](OpenAI_Integration_Guide.md) - Complete OpenAI setup guide
- [Aziza_frontend.md](Aziza_frontend.md) - Frontend development notes

## Data Structure

### Restaurants
Each restaurant includes:
- Name, cuisine type, rating
- Delivery time estimate
- Description and image
- Full menu with items

### Menu Items
Each menu item has:
- Name, description, price
- Category (Pizza, Pasta, Main Course, etc.)
- Image

### Cart Items
Extended menu items with:
- Quantity
- Restaurant information
- Unique identifiers

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance
- Lazy loading for images
- Optimized re-renders with React hooks
- LocalStorage for memory persistence
- Debounced API calls

## Security

### API Key Protection
- Never commit `.env` files
- Use environment variables
- For production, use backend proxy
- Rotate keys regularly

See security section in [OpenAI_Integration_Guide.md](OpenAI_Integration_Guide.md) for details.

## Cost Estimation

### OpenAI API Costs (GPT-3.5)
- Per conversation: ~$0.002
- 1000 conversations: ~$2
- Monthly active users (100): ~$6-10

### Optimization Tips
- Use GPT-3.5 instead of GPT-4
- Limit conversation history
- Implement caching
- Set usage limits

## Troubleshooting

### Chatbot not responding
- Check API key in `.env`
- Verify internet connection
- Check browser console for errors
- Try Basic mode (toggle AI off)

### Build errors
- Clear `node_modules` and reinstall
- Check Node.js version (16+)
- Update dependencies

### Memory not persisting
- Check browser allows localStorage
- Clear browser cache
- Disable private/incognito mode

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Roadmap

### Upcoming Features
- [ ] User authentication
- [ ] Real-time order tracking
- [ ] Payment integration
- [ ] Restaurant admin panel
- [ ] Multi-language support
- [ ] Voice input for chatbot
- [ ] Image recognition for meals
- [ ] Nutrition information
- [ ] Review system
- [ ] Delivery driver app

## License

This project is for educational purposes.

## Acknowledgments

- Restaurant images from [Unsplash](https://unsplash.com)
- Icons from [Heroicons](https://heroicons.com)
- AI powered by [OpenAI](https://openai.com)
- Built with [React](https://react.dev) and [Vite](https://vitejs.dev)

## Contact

For questions or support, please open an issue in the repository.

---

Built with Claude Code - An AI-powered development assistant