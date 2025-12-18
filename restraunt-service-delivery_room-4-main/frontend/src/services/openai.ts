import { Restaurant, MenuItem } from '../types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenAIService {
  private apiKey: string;
  private model: string;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';
  }

  private createSystemPrompt(restaurants: Restaurant[]): string {
    const restaurantList = restaurants.map(r => {
      const avgPrice = (r.menu.reduce((sum, item) => sum + item.price, 0) / r.menu.length).toFixed(2);
      return `
Restaurant: ${r.name}
- Cuisine: ${r.cuisine}
- Rating: ${r.rating}/5
- Delivery Time: ${r.deliveryTime}
- Average Price: $${avgPrice}
- Description: ${r.description}
- Menu Items: ${r.menu.map(m => `${m.name} ($${m.price}) - ${m.category}`).join(', ')}
`;
    }).join('\n---\n');

    return `You are a friendly restaurant recommendation assistant. Your job is to help users find the perfect restaurant and meals based on their preferences, budget, and dietary requirements.

Available Restaurants:
${restaurantList}

Your capabilities:
1. Recommend restaurants based on cuisine, budget, rating, and delivery time
2. Suggest specific meals from restaurants
3. Consider dietary restrictions and preferences
4. Provide personalized recommendations based on conversation history
5. Ask clarifying questions when needed

Guidelines:
- Be conversational and friendly
- Remember user preferences throughout the conversation
- When recommending, explain why you chose specific options
- If budget is mentioned, filter options accordingly
- Always consider the user's previous messages in the conversation
- Provide 2-3 recommendations at a time
- Include specific details like prices and ratings

Response Format:
- Start with a friendly acknowledgment
- Provide recommendations with reasoning
- End with a follow-up question or offer to help further

Example: "Based on your interest in Italian food under $15, I'd recommend Bella Italia! They have a 4.8 rating and their Margherita Pizza ($12.99) and Spaghetti Carbonara ($14.99) are excellent choices. Would you like to know more about their menu or see other options?"`;
  }

  async getChatCompletion(
    messages: ChatMessage[],
    restaurants: Restaurant[]
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
    }

    try {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: this.createSystemPrompt(restaurants),
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get response from OpenAI');
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  async getRecommendations(
    userMessage: string,
    conversationHistory: ChatMessage[],
    restaurants: Restaurant[]
  ): Promise<{
    response: string;
    suggestedRestaurants: Restaurant[];
    suggestedMeals: Array<{ meal: MenuItem; restaurant: Restaurant }>;
  }> {
    const messages: ChatMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await this.getChatCompletion(messages, restaurants);

    // Parse recommendations from response
    const suggestedRestaurants: Restaurant[] = [];
    const suggestedMeals: Array<{ meal: MenuItem; restaurant: Restaurant }> = [];

    // Simple keyword matching to find mentioned restaurants and dishes
    restaurants.forEach(restaurant => {
      if (response.toLowerCase().includes(restaurant.name.toLowerCase())) {
        if (!suggestedRestaurants.find(r => r.id === restaurant.id)) {
          suggestedRestaurants.push(restaurant);
        }

        restaurant.menu.forEach(meal => {
          if (response.toLowerCase().includes(meal.name.toLowerCase())) {
            suggestedMeals.push({ meal, restaurant });
          }
        });
      }
    });

    return {
      response,
      suggestedRestaurants,
      suggestedMeals,
    };
  }
}

export const openAIService = new OpenAIService();
