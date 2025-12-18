export type CuisineType = 'Italian' | 'Chinese' | 'Japanese' | 'Mexican' | 'American' | 'Indian' | 'Thai' | 'French';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: CuisineType;
  rating: number;
  deliveryTime: string;
  image: string;
  description: string;
  menu: MenuItem[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, restaurant: Restaurant) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
