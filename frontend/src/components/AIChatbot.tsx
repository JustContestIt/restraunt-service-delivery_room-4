import { useState, useRef, useEffect } from 'react';
import { Restaurant, MenuItem } from '../types';
import { restaurants } from '../data/restaurants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: Suggestion[];
}

interface Suggestion {
  type: 'restaurant' | 'meal';
  data: Restaurant | MenuItem;
  restaurantName?: string;
}

interface UserPreferences {
  cuisines: string[];
  budget: { min: number; max: number } | null;
  dietary: string[];
  mealType: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your restaurant assistant. I can help you find the perfect restaurant and meals based on your preferences and budget. What are you in the mood for today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    cuisines: [],
    budget: null,
    dietary: [],
    mealType: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeUserMessage = (message: string): Partial<UserPreferences> => {
    const lowerMessage = message.toLowerCase();
    const preferences: Partial<UserPreferences> = {};

    // Detect cuisines
    const cuisineKeywords = {
      italian: ['italian', 'pasta', 'pizza', 'italy'],
      chinese: ['chinese', 'china', 'wok', 'stir fry'],
      japanese: ['japanese', 'sushi', 'ramen', 'japan'],
      mexican: ['mexican', 'tacos', 'burrito', 'mexico'],
      american: ['american', 'burger', 'bbq', 'diner'],
      indian: ['indian', 'curry', 'tandoori', 'india'],
      thai: ['thai', 'pad thai', 'thailand'],
      french: ['french', 'bistro', 'france'],
    };

    preferences.cuisines = [];
    Object.entries(cuisineKeywords).forEach(([cuisine, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        preferences.cuisines!.push(cuisine.charAt(0).toUpperCase() + cuisine.slice(1));
      }
    });

    // Detect budget
    const budgetMatch = lowerMessage.match(/\$?(\d+)(?:\s*-\s*\$?(\d+))?/);
    if (budgetMatch) {
      const min = parseInt(budgetMatch[1]);
      const max = budgetMatch[2] ? parseInt(budgetMatch[2]) : min + 20;
      preferences.budget = { min, max };
    } else if (lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
      preferences.budget = { min: 0, max: 15 };
    } else if (lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
      preferences.budget = { min: 15, max: 100 };
    }

    // Detect dietary preferences
    if (lowerMessage.includes('vegetarian') || lowerMessage.includes('veggie')) {
      preferences.dietary = ['vegetarian'];
    }
    if (lowerMessage.includes('vegan')) {
      preferences.dietary = ['vegan'];
    }

    // Detect meal type
    if (lowerMessage.includes('breakfast')) {
      preferences.mealType = 'breakfast';
    } else if (lowerMessage.includes('lunch')) {
      preferences.mealType = 'lunch';
    } else if (lowerMessage.includes('dinner')) {
      preferences.mealType = 'dinner';
    } else if (lowerMessage.includes('dessert')) {
      preferences.mealType = 'dessert';
    } else if (lowerMessage.includes('appetizer') || lowerMessage.includes('starter')) {
      preferences.mealType = 'appetizer';
    }

    return preferences;
  };

  const generateRecommendations = (prefs: UserPreferences): Suggestion[] => {
    let filteredRestaurants = [...restaurants];

    // Filter by cuisine
    if (prefs.cuisines.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(r =>
        prefs.cuisines.some(c => c.toLowerCase() === r.cuisine.toLowerCase())
      );
    }

    // Filter by budget (average menu price)
    if (prefs.budget) {
      filteredRestaurants = filteredRestaurants.filter(r => {
        const avgPrice = r.menu.reduce((sum, item) => sum + item.price, 0) / r.menu.length;
        return avgPrice >= prefs.budget!.min && avgPrice <= prefs.budget!.max;
      });
    }

    // Sort by rating
    filteredRestaurants.sort((a, b) => b.rating - a.rating);

    const suggestions: Suggestion[] = [];

    // Add top restaurants
    filteredRestaurants.slice(0, 3).forEach(restaurant => {
      suggestions.push({ type: 'restaurant', data: restaurant });
    });

    // Add meal suggestions from top restaurants
    filteredRestaurants.slice(0, 2).forEach(restaurant => {
      let meals = [...restaurant.menu];

      // Filter by meal type
      if (prefs.mealType) {
        meals = meals.filter(m =>
          m.category.toLowerCase().includes(prefs.mealType.toLowerCase())
        );
      }

      // Filter by budget
      if (prefs.budget) {
        meals = meals.filter(m => m.price >= prefs.budget!.min && m.price <= prefs.budget!.max);
      }

      meals.slice(0, 2).forEach(meal => {
        suggestions.push({
          type: 'meal',
          data: meal,
          restaurantName: restaurant.name,
        });
      });
    });

    return suggestions;
  };

  const generateBotResponse = (userMessage: string): Message => {
    const detectedPrefs = analyzeUserMessage(userMessage);
    const updatedPrefs = {
      ...userPreferences,
      cuisines: detectedPrefs.cuisines || userPreferences.cuisines,
      budget: detectedPrefs.budget || userPreferences.budget,
      dietary: detectedPrefs.dietary || userPreferences.dietary,
      mealType: detectedPrefs.mealType || userPreferences.mealType,
    };
    setUserPreferences(updatedPrefs);

    const suggestions = generateRecommendations(updatedPrefs);

    let responseText = '';

    if (suggestions.length === 0) {
      responseText = "I couldn't find restaurants matching your criteria. Try adjusting your budget or preferences!";
    } else {
      const parts: string[] = [];

      if (updatedPrefs.cuisines.length > 0) {
        parts.push(`${updatedPrefs.cuisines.join(', ')} cuisine`);
      }
      if (updatedPrefs.budget) {
        parts.push(`$${updatedPrefs.budget.min}-$${updatedPrefs.budget.max} budget`);
      }
      if (updatedPrefs.mealType) {
        parts.push(`${updatedPrefs.mealType}`);
      }

      responseText = parts.length > 0
        ? `Great! Based on your preferences (${parts.join(', ')}), here are my recommendations:`
        : "Here are some great options for you:";
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg z-50 transition-transform hover:scale-110"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Restaurant Assistant</h3>
            <p className="text-sm text-primary-100">Your personal food recommendation helper</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-primary-400 transition-colors"
                      >
                        {suggestion.type === 'restaurant' ? (
                          <div className="flex gap-3">
                            <img
                              src={(suggestion.data as Restaurant).image}
                              alt={(suggestion.data as Restaurant).name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">
                                {(suggestion.data as Restaurant).name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {(suggestion.data as Restaurant).cuisine} • Rating: {(suggestion.data as Restaurant).rating}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(suggestion.data as Restaurant).deliveryTime}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <img
                              src={(suggestion.data as MenuItem).image}
                              alt={(suggestion.data as MenuItem).name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">
                                {(suggestion.data as MenuItem).name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {suggestion.restaurantName} • ${(suggestion.data as MenuItem).price}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {(suggestion.data as MenuItem).description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setInputMessage('I want Italian food under $15')}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                Italian under $15
              </button>
              <button
                onClick={() => setInputMessage('Show me sushi restaurants')}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                Sushi places
              </button>
              <button
                onClick={() => setInputMessage('What desserts do you recommend?')}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                Desserts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
