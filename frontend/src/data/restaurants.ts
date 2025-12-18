import { Restaurant } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Bella Italia',
    cuisine: 'Italian',
    rating: 4.8,
    deliveryTime: '30-45 min',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    description: 'Authentic Italian cuisine with fresh pasta and wood-fired pizzas',
    menu: [
      {
        id: '1-1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
        category: 'Pizza'
      },
      {
        id: '1-2',
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon, egg, and Parmesan cheese',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
        category: 'Pasta'
      },
      {
        id: '1-3',
        name: 'Lasagna Bolognese',
        description: 'Layered pasta with meat sauce, bechamel, and cheese',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop',
        category: 'Pasta'
      },
      {
        id: '1-4',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
        category: 'Dessert'
      }
    ]
  },
  {
    id: '2',
    name: 'Dragon Palace',
    cuisine: 'Chinese',
    rating: 4.6,
    deliveryTime: '25-35 min',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop',
    description: 'Traditional Chinese dishes with bold flavors and fresh ingredients',
    menu: [
      {
        id: '2-1',
        name: 'Kung Pao Chicken',
        description: 'Spicy stir-fried chicken with peanuts and vegetables',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop',
        category: 'Main Course'
      },
      {
        id: '2-2',
        name: 'Sweet and Sour Pork',
        description: 'Crispy pork in tangy sweet and sour sauce',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1576777647209-e8733194e679?w=400&h=300&fit=crop',
        category: 'Main Course'
      },
      {
        id: '2-3',
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls with sweet chili sauce',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop',
        category: 'Appetizer'
      },
      {
        id: '2-4',
        name: 'Fried Rice',
        description: 'Wok-fried rice with egg, vegetables, and choice of protein',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
        category: 'Rice & Noodles'
      }
    ]
  },
  {
    id: '3',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    rating: 4.9,
    deliveryTime: '35-50 min',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    description: 'Fresh sushi and traditional Japanese cuisine',
    menu: [
      {
        id: '3-1',
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber rolled in rice and nori',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        category: 'Sushi Rolls'
      },
      {
        id: '3-2',
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over pressed sushi rice (2 pieces)',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400&h=300&fit=crop',
        category: 'Nigiri'
      },
      {
        id: '3-3',
        name: 'Ramen Bowl',
        description: 'Rich broth with noodles, pork, egg, and vegetables',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400&h=300&fit=crop',
        category: 'Ramen'
      },
      {
        id: '3-4',
        name: 'Tempura Platter',
        description: 'Lightly battered and fried shrimp and vegetables',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1626365186954-1a355eb70b3d?w=400&h=300&fit=crop',
        category: 'Appetizer'
      }
    ]
  },
  {
    id: '4',
    name: 'El Mariachi',
    cuisine: 'Mexican',
    rating: 4.7,
    deliveryTime: '20-30 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
    description: 'Vibrant Mexican flavors with authentic recipes',
    menu: [
      {
        id: '4-1',
        name: 'Beef Tacos',
        description: 'Three soft tacos with seasoned beef, lettuce, and cheese',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        category: 'Tacos'
      },
      {
        id: '4-2',
        name: 'Chicken Burrito',
        description: 'Large flour tortilla filled with chicken, rice, beans, and cheese',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop',
        category: 'Burritos'
      },
      {
        id: '4-3',
        name: 'Guacamole & Chips',
        description: 'Fresh guacamole with crispy tortilla chips',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=300&fit=crop',
        category: 'Appetizer'
      },
      {
        id: '4-4',
        name: 'Enchiladas',
        description: 'Corn tortillas filled with chicken and topped with sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1599974715142-a8f6e2f2a7c6?w=400&h=300&fit=crop',
        category: 'Main Course'
      }
    ]
  },
  {
    id: '5',
    name: 'The American Diner',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '25-40 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
    description: 'Classic American comfort food and burgers',
    menu: [
      {
        id: '5-1',
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        category: 'Burgers'
      },
      {
        id: '5-2',
        name: 'BBQ Ribs',
        description: 'Tender pork ribs with smoky BBQ sauce and coleslaw',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        category: 'Main Course'
      },
      {
        id: '5-3',
        name: 'Crispy Chicken Wings',
        description: 'Buffalo-style wings with ranch dressing',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
        category: 'Appetizer'
      },
      {
        id: '5-4',
        name: 'Mac & Cheese',
        description: 'Creamy macaroni and cheese with breadcrumb topping',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400&h=300&fit=crop',
        category: 'Sides'
      }
    ]
  },
  {
    id: '6',
    name: 'Spice of India',
    cuisine: 'Indian',
    rating: 4.8,
    deliveryTime: '30-45 min',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop',
    description: 'Aromatic Indian curries and tandoori specialties',
    menu: [
      {
        id: '6-1',
        name: 'Butter Chicken',
        description: 'Tender chicken in creamy tomato sauce with butter',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
        category: 'Curry'
      },
      {
        id: '6-2',
        name: 'Chicken Tikka Masala',
        description: 'Grilled chicken in spiced tomato cream sauce',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        category: 'Curry'
      },
      {
        id: '6-3',
        name: 'Naan Bread',
        description: 'Soft, fluffy flatbread baked in tandoor',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        category: 'Bread'
      },
      {
        id: '6-4',
        name: 'Samosas',
        description: 'Crispy pastries filled with spiced potatoes and peas (2 pieces)',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
        category: 'Appetizer'
      }
    ]
  },
  {
    id: '7',
    name: 'Bangkok Street',
    cuisine: 'Thai',
    rating: 4.7,
    deliveryTime: '30-40 min',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop',
    description: 'Authentic Thai street food with bold flavors',
    menu: [
      {
        id: '7-1',
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with shrimp, egg, and peanuts',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
        category: 'Noodles'
      },
      {
        id: '7-2',
        name: 'Green Curry',
        description: 'Spicy coconut curry with vegetables and choice of protein',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
        category: 'Curry'
      },
      {
        id: '7-3',
        name: 'Tom Yum Soup',
        description: 'Hot and sour soup with shrimp and mushrooms',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop',
        category: 'Soup'
      },
      {
        id: '7-4',
        name: 'Spring Rolls',
        description: 'Fresh vegetable spring rolls with peanut sauce',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
        category: 'Appetizer'
      }
    ]
  },
  {
    id: '8',
    name: 'Le Bistro',
    cuisine: 'French',
    rating: 4.9,
    deliveryTime: '40-55 min',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    description: 'Elegant French cuisine with refined flavors',
    menu: [
      {
        id: '8-1',
        name: 'Coq au Vin',
        description: 'Chicken braised in red wine with mushrooms and onions',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        category: 'Main Course'
      },
      {
        id: '8-2',
        name: 'French Onion Soup',
        description: 'Rich beef broth with caramelized onions and melted cheese',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
        category: 'Soup'
      },
      {
        id: '8-3',
        name: 'Beef Bourguignon',
        description: 'Slow-cooked beef in red wine with vegetables',
        price: 21.99,
        image: 'https://images.unsplash.com/photo-1600326465237-4d66adf9daa0?w=400&h=300&fit=crop',
        category: 'Main Course'
      },
      {
        id: '8-4',
        name: 'Crème Brûlée',
        description: 'Classic vanilla custard with caramelized sugar top',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
        category: 'Dessert'
      }
    ]
  }
];
