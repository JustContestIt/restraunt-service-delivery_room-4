# Restaurant Food Delivery Frontend

A modern, responsive frontend application for a restaurant food selection and delivery service built with React, TypeScript, and TailwindCSS.

## Features

- **Restaurant Browsing**: View a list of restaurants with beautiful card layouts
- **Cuisine Filtering**: Filter restaurants by cuisine type (Italian, Chinese, Japanese, Mexican, American, Indian, Thai, French)
- **Menu Display**: Browse detailed menus for each restaurant with item categories
- **Shopping Cart**: Add/remove items, adjust quantities, and view cart totals
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations and transitions

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe code with full TypeScript support
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Context API**: State management for shopping cart

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── CuisineFilter.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── MenuItemCard.tsx
│   │   ├── RestaurantMenu.tsx
│   │   └── Cart.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useCart.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── data/           # Mock data
│   │   └── restaurants.ts
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173` (or the next available port).

### Building for Production

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Detail

### Restaurant List
- Grid layout with restaurant cards
- Each card shows: name, image, rating, cuisine type, delivery time, and description
- Hover effects and smooth transitions
- Click on any card to view the restaurant's menu

### Cuisine Filter
- Filter restaurants by cuisine type
- "All Cuisines" option to view everything
- Active filter highlighting
- Smooth filtering transitions

### Restaurant Menu
- Detailed restaurant header with image and info
- Menu items grouped by category
- Each item displays: name, description, price, image, and category
- "Add to Cart" button on each item
- Back button to return to restaurant list

### Shopping Cart
- Slide-in cart panel from the right
- View all added items with images
- Adjust quantities with +/- buttons
- Remove individual items
- View subtotal, delivery fee, and total
- Clear cart option
- Cart badge showing total items

## Component Overview

### Header
- Sticky header with app logo
- Shopping cart button with item count badge

### CuisineFilter
- Filter buttons for all cuisine types
- Responsive grid layout
- Active state styling

### RestaurantCard
- Restaurant preview with image, info, and rating
- Hover effects
- Click to view menu

### RestaurantMenu
- Full restaurant details
- Menu items organized by category
- Add to cart functionality

### MenuItemCard
- Item image, name, description, and price
- Category badge
- Add to cart button

### Cart
- Side panel overlay
- Item management (quantity, remove)
- Price calculations
- Checkout button (placeholder)

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: {
    // Your custom colors
  },
}
```

### Mock Data
Edit `src/data/restaurants.ts` to modify or add restaurants and menu items.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User authentication
- Real backend integration
- Order history
- Payment processing
- Restaurant reviews and ratings
- Search functionality
- Favorites/saved restaurants
- Order tracking
- Delivery address management

## License

This project is for educational purposes.
