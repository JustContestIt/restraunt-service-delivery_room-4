import { useState, useRef, useEffect } from 'react';
import { Restaurant, MenuItem } from '../types';
import { restaurants } from '../data/restaurants';
import { openAIService } from '../services/openai';

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

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ConversationMemory {
  preferences: {
    cuisines: string[];
    budget?: { min: number; max: number };
    dietary: string[];
    favoriteRestaurants: string[];
  };
  history: ChatMessage[];
  lastInteraction: Date;
}

export function AIChatbotWithMemory() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI restaurant assistant powered by OpenAI. I can remember your preferences and help you find the perfect restaurant and meals. What are you craving today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [memory, setMemory] = useState<ConversationMemory>(() => {
    // Load memory from localStorage
    const stored = localStorage.getItem('chatbot_memory');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastInteraction: new Date(parsed.lastInteraction),
      };
    }
    return {
      preferences: {
        cuisines: [],
        dietary: [],
        favoriteRestaurants: [],
      },
      history: [],
      lastInteraction: new Date(),
    };
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save memory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatbot_memory', JSON.stringify(memory));
  }, [memory]);

  const updateMemory = (userMessage: string, botResponse: string) => {
    setMemory(prev => {
      const newHistory: ChatMessage[] = [
        ...prev.history,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botResponse },
      ];

      // Keep only last 10 exchanges (20 messages) to manage memory size
      const trimmedHistory = newHistory.slice(-20);

      // Extract preferences from conversation
      const lowerMessage = userMessage.toLowerCase();
      const newPreferences = { ...prev.preferences };

      // Extract cuisines
      const cuisineTypes = ['Italian', 'Chinese', 'Japanese', 'Mexican', 'American', 'Indian', 'Thai', 'French'];
      cuisineTypes.forEach(cuisine => {
        if (lowerMessage.includes(cuisine.toLowerCase()) && !newPreferences.cuisines.includes(cuisine)) {
          newPreferences.cuisines.push(cuisine);
        }
      });

      return {
        preferences: newPreferences,
        history: trimmedHistory,
        lastInteraction: new Date(),
      };
    });
  };

  const handleSendMessageWithAI = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await openAIService.getRecommendations(
        currentInput,
        memory.history,
        restaurants
      );

      const suggestions: Suggestion[] = [
        ...result.suggestedRestaurants.map(r => ({
          type: 'restaurant' as const,
          data: r,
        })),
        ...result.suggestedMeals.map(({ meal, restaurant }) => ({
          type: 'meal' as const,
          data: meal,
          restaurantName: restaurant.name,
        })),
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.response,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      };

      setMessages(prev => [...prev, botMessage]);
      updateMemory(currentInput, result.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error
          ? `Sorry, I encountered an error: ${error.message}. Try disabling AI mode for basic recommendations.`
          : 'Sorry, I encountered an error. Try disabling AI mode for basic recommendations.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessageBasic = () => {
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
      const lowerMessage = inputMessage.toLowerCase();
      let filteredRestaurants = [...restaurants];

      // Basic filtering
      const cuisineMatch = restaurants[0].cuisine; // simplified for demo
      filteredRestaurants = filteredRestaurants.slice(0, 3);

      const suggestions: Suggestion[] = filteredRestaurants.map(r => ({
        type: 'restaurant',
        data: r,
      }));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Here are some recommendations based on your query. Enable AI mode for smarter, personalized suggestions!`,
        sender: 'bot',
        timestamp: new Date(),
        suggestions,
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleSendMessage = () => {
    if (useAI) {
      handleSendMessageWithAI();
    } else {
      handleSendMessageBasic();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearMemory = () => {
    setMemory({
      preferences: {
        cuisines: [],
        dietary: [],
        favoriteRestaurants: [],
      },
      history: [],
      lastInteraction: new Date(),
    });
    setMessages([
      {
        id: '1',
        text: "Memory cleared! Let's start fresh. What would you like to eat today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  const showMemory = () => {
    const memoryText = `
**Your Preferences:**
- Favorite Cuisines: ${memory.preferences.cuisines.join(', ') || 'None yet'}
- Budget: ${memory.preferences.budget ? `$${memory.preferences.budget.min}-$${memory.preferences.budget.max}` : 'Not set'}
- Dietary: ${memory.preferences.dietary.join(', ') || 'None'}
- Conversation Length: ${memory.history.length} messages

I remember our previous conversations and use them to give you better recommendations!
    `.trim();

    const memoryMessage: Message = {
      id: Date.now().toString(),
      text: memoryText,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, memoryMessage]);
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
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">AI Restaurant Assistant</h3>
                <p className="text-sm text-primary-100">
                  {useAI ? 'OpenAI Powered • Memory Enabled' : 'Basic Mode'}
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs">AI</span>
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="w-4 h-4"
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={showMemory}
                className="text-xs px-2 py-1 bg-primary-700 hover:bg-primary-800 rounded"
                title="Show my preferences"
              >
                View Memory
              </button>
              <button
                onClick={clearMemory}
                className="text-xs px-2 py-1 bg-primary-700 hover:bg-primary-800 rounded"
                title="Clear conversation history"
              >
                Clear Memory
              </button>
            </div>
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
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
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
                placeholder={useAI ? "Ask me anything..." : "Type your query..."}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                disabled={isLoading}
              >
                Italian under $15
              </button>
              <button
                onClick={() => setInputMessage('What do you remember about me?')}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                disabled={isLoading}
              >
                My preferences
              </button>
              <button
                onClick={() => setInputMessage('Surprise me with something new!')}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full"
                disabled={isLoading}
              >
                Surprise me!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
