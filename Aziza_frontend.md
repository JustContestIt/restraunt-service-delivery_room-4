# Restaurant Food Delivery Frontend - Project Documentation

## Original Request (Оригинальный запрос)

**English:**
Build a complete frontend application for a restaurant/food selection service with the following requirements:
- React with TypeScript
- TailwindCSS for styling
- Restaurant List with filtering by cuisine categories
- Menu display for each restaurant
- Shopping Cart functionality
- Responsive and visually appealing design

**Russian (По-русски):**
Создать полноценное фронтенд приложение для сервиса выбора ресторанов и еды со следующими требованиями:
- React с TypeScript
- TailwindCSS для стилизации
- Список ресторанов с фильтрацией по категориям кухни
- Отображение меню для каждого ресторана
- Функциональность корзины покупок
- Адаптивный и визуально привлекательный дизайн

---

## Project Overview (Обзор проекта)

A modern, fully-functional restaurant food delivery application built with React 18, TypeScript, and TailwindCSS. The application provides a seamless user experience for browsing restaurants, filtering by cuisine type, viewing menus, and managing a shopping cart.

Современное, полнофункциональное приложение для доставки еды из ресторанов, созданное с использованием React 18, TypeScript и TailwindCSS. Приложение обеспечивает удобный пользовательский опыт для просмотра ресторанов, фильтрации по типу кухни, просмотра меню и управления корзиной покупок.

---

## Project Structure (Структура проекта)

```
/Users/aziza/nfactorial/restoran/frontend/
├── public/                      # Static assets / Статические ресурсы
├── src/
│   ├── components/             # React components / React компоненты
│   │   ├── Header.tsx          # App header with cart button
│   │   ├── CuisineFilter.tsx   # Cuisine type filter buttons
│   │   ├── RestaurantCard.tsx  # Restaurant preview card
│   │   ├── MenuItemCard.tsx    # Menu item display card
│   │   ├── RestaurantMenu.tsx  # Full menu view for restaurant
│   │   └── Cart.tsx            # Shopping cart sidebar
│   ├── hooks/                  # Custom React hooks / Кастомные хуки
│   │   └── useCart.tsx         # Cart state management hook
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # All TypeScript interfaces
│   ├── data/                   # Mock data / Тестовые данные
│   │   └── restaurants.ts      # 8 restaurants with menus
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Node
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## Technologies Used (Используемые технологии)

### Core Technologies
- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript 5.2.2** - Type-safe JavaScript with full IDE support
- **Vite 5.0.8** - Fast build tool and development server
- **TailwindCSS 3.3.6** - Utility-first CSS framework

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing with Autoprefixer
- **@vitejs/plugin-react** - React Fast Refresh support

---

## Features Implemented (Реализованные функции)

### 1. Restaurant List (Список ресторанов)
- Grid layout displaying restaurant cards
- Each card shows:
  - Restaurant image
  - Name and description
  - Cuisine type badge
  - Rating (out of 5 stars)
  - Estimated delivery time
- Hover animations and transitions
- Click to view restaurant menu

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/RestaurantCard.tsx`

### 2. Cuisine Categories Filter (Фильтр категорий кухни)
- 8 cuisine types supported:
  - Italian
  - Chinese
  - Japanese
  - Mexican
  - American
  - Indian
  - Thai
  - French
- "All Cuisines" option to show everything
- Active filter highlighting with scale animation
- Responsive button layout

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/CuisineFilter.tsx`

### 3. Restaurant Menu (Меню ресторана)
- Beautiful header with restaurant image overlay
- Restaurant details (name, rating, delivery time, cuisine)
- Menu items organized by category
- Each menu item displays:
  - High-quality food image
  - Item name and description
  - Price
  - Category badge
  - Add to cart button
- Back button to return to restaurant list

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/RestaurantMenu.tsx`

### 4. Shopping Cart (Корзина покупок)
- Slide-in cart panel from the right side
- Features:
  - View all added items with thumbnails
  - Item details (name, restaurant, price)
  - Quantity controls (+/- buttons)
  - Remove individual items
  - Clear entire cart
  - Subtotal calculation
  - Delivery fee ($3.99)
  - Total price calculation
  - Cart badge on header showing item count
- Empty cart state with friendly message
- Checkout button (placeholder for future implementation)

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/Cart.tsx`

### 5. State Management (Управление состоянием)
- Context API for cart state management
- Custom `useCart` hook providing:
  - `addToCart()` - Add items to cart
  - `removeFromCart()` - Remove items from cart
  - `updateQuantity()` - Update item quantities
  - `clearCart()` - Clear all items
  - `totalItems` - Total item count
  - `totalPrice` - Total price calculation
- Automatic quantity increment for duplicate items

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/hooks/useCart.tsx`

### 6. TypeScript Types (Типы TypeScript)
All data structures are strongly typed:
- `CuisineType` - Cuisine category type
- `MenuItem` - Menu item interface
- `Restaurant` - Restaurant interface
- `CartItem` - Cart item with quantity
- `CartContextType` - Cart context interface

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/types/index.ts`

### 7. Mock Data (Тестовые данные)
8 fully populated restaurants with:
- Bella Italia (Italian) - 4 menu items
- Dragon Palace (Chinese) - 4 menu items
- Sakura Sushi (Japanese) - 4 menu items
- El Mariachi (Mexican) - 4 menu items
- The American Diner (American) - 4 menu items
- Spice of India (Indian) - 4 menu items
- Bangkok Street (Thai) - 4 menu items
- Le Bistro (French) - 4 menu items

Total: 32 menu items with real food images from Unsplash

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/data/restaurants.ts`

### 8. Responsive Design (Адаптивный дизайн)
- Mobile-first approach
- Breakpoints:
  - `sm:` - Small devices (640px+)
  - `md:` - Medium devices (768px+)
  - `lg:` - Large devices (1024px+)
- Grid layouts adjust automatically:
  - 1 column on mobile
  - 2 columns on tablets
  - 3 columns on desktop

### 9. UI/UX Enhancements
- Smooth transitions and animations
- Hover effects on cards and buttons
- Loading states with empty state messages
- Sticky header for easy navigation
- Custom primary color scheme (red theme)
- SVG icons for better scalability
- Image lazy loading optimization

---

## Configuration Files (Конфигурационные файлы)

### 1. package.json
**Location:** `/Users/aziza/nfactorial/restoran/frontend/package.json`

Dependencies:
- react: ^18.2.0
- react-dom: ^18.2.0

Dev Dependencies:
- TypeScript and related tools
- Vite and build tools
- TailwindCSS and PostCSS
- ESLint and linting plugins

Scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### 2. tsconfig.json
**Location:** `/Users/aziza/nfactorial/restoran/frontend/tsconfig.json`

TypeScript configuration with:
- Target: ES2020
- Strict mode enabled
- JSX: react-jsx
- Module resolution: bundler
- Unused variables/parameters detection

### 3. tailwind.config.js
**Location:** `/Users/aziza/nfactorial/restoran/frontend/tailwind.config.js`

TailwindCSS configuration with:
- Content paths for HTML and all JS/TS files
- Custom primary color palette (red theme)
- 9 shades for primary color (50-900)

### 4. vite.config.ts
**Location:** `/Users/aziza/nfactorial/restoran/frontend/vite.config.ts`

Vite configuration with:
- React plugin for Fast Refresh
- Default development server settings

### 5. .eslintrc.cjs
**Location:** `/Users/aziza/nfactorial/restoran/frontend/.eslintrc.cjs`

ESLint configuration with:
- TypeScript support
- React hooks rules
- React Refresh plugin

### 6. postcss.config.js
**Location:** `/Users/aziza/nfactorial/restoran/frontend/postcss.config.js`

PostCSS configuration with:
- TailwindCSS plugin
- Autoprefixer for browser compatibility

---

## How to Run the Application (Как запустить приложение)

### Prerequisites (Требования)
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation Steps (Шаги установки)

1. **Navigate to the frontend directory:**
   ```bash
   cd /Users/aziza/nfactorial/restoran/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   - The application will start at `http://localhost:5173`
   - Or the next available port (Vite will show the URL in the console)

### Production Build (Продакшн сборка)

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

The production build will be created in the `dist/` directory.

---

## Component Details (Детали компонентов)

### Header Component
**Purpose:** Application header with logo and cart button

**Props:**
- `onCartClick: () => void` - Callback when cart button is clicked

**Features:**
- Displays "FoodDelivery" logo
- Shopping cart button with item count badge
- Sticky positioning (stays at top when scrolling)
- Badge shows number of items in cart

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/Header.tsx`

---

### CuisineFilter Component
**Purpose:** Filter restaurants by cuisine type

**Props:**
- `selectedCuisine: CuisineType | 'All'` - Currently selected cuisine
- `onSelectCuisine: (cuisine: CuisineType | 'All') => void` - Selection callback

**Features:**
- Displays buttons for all 8 cuisine types plus "All"
- Active button has different styling (scale, color)
- Responsive flex layout
- Smooth transitions

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/CuisineFilter.tsx`

---

### RestaurantCard Component
**Purpose:** Display restaurant preview in grid

**Props:**
- `restaurant: Restaurant` - Restaurant data
- `onClick: () => void` - Click handler to view menu

**Features:**
- Image with hover zoom effect
- Rating badge overlay
- Restaurant name and description
- Cuisine type badge
- Delivery time with clock icon
- Shadow and transform on hover

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/RestaurantCard.tsx`

---

### RestaurantMenu Component
**Purpose:** Display full menu for selected restaurant

**Props:**
- `restaurant: Restaurant` - Restaurant data
- `onBack: () => void` - Callback to return to list

**Features:**
- Large header image with gradient overlay
- Restaurant details banner
- Menu items grouped by category
- Back button with arrow icon
- Grid layout for menu items

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/RestaurantMenu.tsx`

---

### MenuItemCard Component
**Purpose:** Display individual menu item

**Props:**
- `item: MenuItem` - Menu item data
- `onAddToCart: () => void` - Add to cart callback

**Features:**
- Food image with hover zoom
- Category badge
- Item name and description (truncated to 2 lines)
- Price display
- Add button with plus icon
- Hover shadow effect

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/MenuItemCard.tsx`

---

### Cart Component
**Purpose:** Shopping cart sidebar panel

**Props:**
- `isOpen: boolean` - Controls cart visibility
- `onClose: () => void` - Callback to close cart

**Features:**
- Slide-in animation from right
- Dark overlay background (closes on click)
- Header with title and close button
- Empty state message
- Item list with thumbnails
- Quantity controls (+/- buttons)
- Remove item button (trash icon)
- Price breakdown (subtotal, delivery fee, total)
- Checkout button (placeholder)
- Clear cart button

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/components/Cart.tsx`

---

## State Management Flow (Поток управления состоянием)

### Cart Context Provider
The application uses React Context API for cart state management.

**Provider Hierarchy:**
```
App
└── CartProvider
    └── AppContent
        ├── Header (reads totalItems)
        ├── RestaurantMenu (uses addToCart)
        └── Cart (uses all cart functions)
```

**Cart State:**
```typescript
{
  items: CartItem[];           // Array of items in cart
  addToCart: (item, restaurant) => void;
  removeFromCart: (itemId) => void;
  updateQuantity: (itemId, quantity) => void;
  clearCart: () => void;
  totalItems: number;          // Computed total count
  totalPrice: number;          // Computed total price
}
```

**Add to Cart Logic:**
1. Check if item already exists in cart
2. If exists: increment quantity
3. If new: add with quantity = 1
4. Store restaurant information with item

**File:** `/Users/aziza/nfactorial/restoran/frontend/src/hooks/useCart.tsx`

---

## Styling Approach (Подход к стилизации)

### TailwindCSS Utilities
The project uses TailwindCSS exclusively - no custom CSS files except for Tailwind directives.

**Common Patterns:**

1. **Layout:**
   - `container mx-auto px-4` - Centered container with padding
   - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` - Responsive grid
   - `flex items-center justify-between` - Flex layouts

2. **Colors:**
   - `bg-primary-600` - Primary brand color
   - `text-gray-800` - Dark text
   - `text-gray-600` - Secondary text
   - `bg-white` - White backgrounds

3. **Spacing:**
   - `p-4`, `p-6` - Padding
   - `mb-4`, `mb-8` - Margin bottom
   - `space-x-2`, `space-y-4` - Gap between elements

4. **Effects:**
   - `hover:shadow-xl` - Shadow on hover
   - `transition-all` - Smooth transitions
   - `rounded-lg` - Rounded corners
   - `hover:scale-105` - Slight scale on hover

### Custom Theme
**File:** `/Users/aziza/nfactorial/restoran/frontend/tailwind.config.js`

Custom primary color palette (red theme):
- primary-50: #fef2f2 (lightest)
- primary-600: #dc2626 (main brand color)
- primary-900: #7f1d1d (darkest)

---

## Data Structure (Структура данных)

### Restaurant Object
```typescript
{
  id: string;                 // Unique identifier
  name: string;               // Restaurant name
  cuisine: CuisineType;       // Cuisine category
  rating: number;             // Rating (0-5)
  deliveryTime: string;       // e.g., "30-45 min"
  image: string;              // Restaurant image URL
  description: string;        // Short description
  menu: MenuItem[];           // Array of menu items
}
```

### MenuItem Object
```typescript
{
  id: string;                 // Unique identifier
  name: string;               // Item name
  description: string;        // Item description
  price: number;              // Price in USD
  image: string;              // Food image URL
  category: string;           // e.g., "Pizza", "Appetizer"
}
```

### CartItem Object
```typescript
{
  ...MenuItem;                // All MenuItem properties
  quantity: number;           // Quantity in cart
  restaurantId: string;       // Source restaurant ID
  restaurantName: string;     // Source restaurant name
}
```

---

## User Flow (Пользовательский поток)

### Typical User Journey:

1. **Landing Page:**
   - User sees all restaurants in grid layout
   - Header shows "FoodDelivery" logo and cart button

2. **Filter by Cuisine:**
   - User clicks cuisine filter button (e.g., "Italian")
   - Restaurant list updates to show only Italian restaurants
   - Count updates to show number of filtered restaurants

3. **View Restaurant Menu:**
   - User clicks on a restaurant card
   - View changes to show full menu for that restaurant
   - Menu items are grouped by category

4. **Add Items to Cart:**
   - User clicks "Add" button on menu items
   - Item is added to cart (or quantity incremented if already there)
   - Cart badge updates to show new item count

5. **Review Cart:**
   - User clicks cart button in header
   - Cart panel slides in from right
   - Shows all items with quantities and prices
   - Displays subtotal, delivery fee, and total

6. **Manage Cart:**
   - User can adjust quantities with +/- buttons
   - User can remove individual items
   - User can clear entire cart
   - Prices update automatically

7. **Navigate Back:**
   - User clicks "Back to Restaurants" button
   - Returns to restaurant list view
   - Previously selected filter is remembered

---

## Image Assets (Изображения)

All images are sourced from Unsplash CDN:
- High-quality food photography
- Responsive image sizing with URL parameters
- Format: `https://images.unsplash.com/photo-XXXXX?w=800&h=600&fit=crop`

**Image Categories:**
- Restaurant exterior/interior photos
- Food item close-ups (pizzas, sushi, burgers, etc.)
- Consistent aspect ratios for uniform appearance

---

## Future Enhancements (Будущие улучшения)

### Recommended Features to Add:

1. **User Authentication:**
   - Login/signup functionality
   - User profiles
   - Order history

2. **Backend Integration:**
   - Connect to real API
   - Dynamic restaurant data
   - Real-time availability

3. **Search Functionality:**
   - Search by restaurant name
   - Search by food item
   - Advanced filters (price, rating, delivery time)

4. **Reviews and Ratings:**
   - User reviews for restaurants
   - Star rating system
   - Photo uploads

5. **Payment Processing:**
   - Credit card integration
   - Multiple payment methods
   - Order confirmation

6. **Order Tracking:**
   - Real-time order status
   - Delivery tracking map
   - Push notifications

7. **Favorites:**
   - Save favorite restaurants
   - Favorite menu items
   - Quick reorder

8. **Delivery Management:**
   - Multiple delivery addresses
   - Scheduled delivery times
   - Special instructions

9. **Promotions:**
   - Discount codes
   - Special offers
   - Loyalty program

10. **Accessibility:**
    - ARIA labels
    - Keyboard navigation
    - Screen reader support

---

## Performance Optimizations (Оптимизации производительности)

### Current Optimizations:

1. **Vite Build Tool:**
   - Fast hot module replacement (HMR)
   - Optimized production builds
   - Code splitting

2. **React Best Practices:**
   - Functional components with hooks
   - Context API for state management
   - useCallback for expensive functions

3. **Image Optimization:**
   - Lazy loading
   - Responsive sizing
   - CDN delivery (Unsplash)

4. **CSS Optimization:**
   - TailwindCSS purging unused styles
   - Minimal custom CSS
   - PostCSS processing

### Recommended Future Optimizations:

1. **Code Splitting:**
   - React.lazy() for route-based splitting
   - Dynamic imports for large components

2. **Memoization:**
   - React.memo for expensive components
   - useMemo for complex calculations

3. **Virtual Scrolling:**
   - For long restaurant lists
   - For menu items

4. **Progressive Web App:**
   - Service workers
   - Offline support
   - Install prompt

---

## Testing Recommendations (Рекомендации по тестированию)

### Testing Strategy:

1. **Unit Tests:**
   - Test custom hooks (useCart)
   - Test utility functions
   - Test TypeScript types

2. **Component Tests:**
   - Test each component in isolation
   - Test props and callbacks
   - Test user interactions

3. **Integration Tests:**
   - Test user flows
   - Test state management
   - Test data flow between components

4. **E2E Tests:**
   - Complete user journeys
   - Cart functionality
   - Filter and navigation

### Recommended Testing Tools:
- Jest - Unit testing
- React Testing Library - Component testing
- Cypress or Playwright - E2E testing

---

## Deployment Guide (Руководство по развертыванию)

### Build for Production:

```bash
cd /Users/aziza/nfactorial/restoran/frontend
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options:

1. **Vercel:**
   ```bash
   npm i -g vercel
   vercel deploy
   ```

2. **Netlify:**
   - Connect GitHub repository
   - Configure build command: `npm run build`
   - Configure publish directory: `dist`

3. **GitHub Pages:**
   - Add homepage to package.json
   - Install gh-pages: `npm i -D gh-pages`
   - Add deploy script: `"deploy": "npm run build && gh-pages -d dist"`

4. **AWS S3 + CloudFront:**
   - Upload dist/ contents to S3 bucket
   - Configure CloudFront distribution
   - Enable static website hosting

5. **Docker:**
   - Create Dockerfile with nginx
   - Build image: `docker build -t restaurant-app .`
   - Run container: `docker run -p 80:80 restaurant-app`

---

## Browser Support (Поддержка браузеров)

### Supported Browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Compatibility:
- ES2020 features
- Modern CSS (Grid, Flexbox)
- SVG support required
- JavaScript enabled required

---

## Troubleshooting (Устранение неполадок)

### Common Issues:

1. **Port already in use:**
   ```bash
   # Vite will automatically try the next available port
   # Or specify a different port:
   npm run dev -- --port 3000
   ```

2. **Module not found errors:**
   ```bash
   # Delete node_modules and reinstall:
   rm -rf node_modules
   npm install
   ```

3. **TypeScript errors:**
   ```bash
   # Check tsconfig.json is correct
   # Restart TypeScript server in your IDE
   ```

4. **TailwindCSS not working:**
   ```bash
   # Ensure index.css imports Tailwind directives
   # Check tailwind.config.js content paths
   ```

5. **Build errors:**
   ```bash
   # Clear cache and rebuild:
   rm -rf dist
   npm run build
   ```

---

## Development Tips (Советы по разработке)

### VS Code Extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Path Intellisense

### Useful Commands:

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Format code (if Prettier is added)
npm run format

# Type check without building
npx tsc --noEmit
```

### Git Workflow:

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Add feature description"

# Push to remote
git push origin main
```

---

## File Size Analysis (Анализ размера файлов)

### Component Files:
- Header.tsx: ~1.7 KB
- CuisineFilter.tsx: ~1.5 KB
- RestaurantCard.tsx: ~2.0 KB
- MenuItemCard.tsx: ~1.8 KB
- RestaurantMenu.tsx: ~3.6 KB
- Cart.tsx: ~7.0 KB

### Data Files:
- restaurants.ts: ~11.9 KB (32 menu items)

### Configuration:
- package.json: ~910 B
- tsconfig.json: ~605 B
- tailwind.config.js: ~501 B
- vite.config.ts: ~163 B

### Total Source Size: ~30 KB (excluding node_modules)

---

## Summary (Резюме)

This is a production-ready, fully-functional restaurant food delivery frontend application built with modern web technologies. It demonstrates best practices in React development, TypeScript usage, and responsive design with TailwindCSS.

Это готовое к продакшену, полнофункциональное фронтенд приложение для доставки еды из ресторанов, созданное с использованием современных веб-технологий. Оно демонстрирует лучшие практики разработки на React, использование TypeScript и адаптивный дизайн с TailwindCSS.

### Key Achievements:
- Complete TypeScript implementation with proper types
- 8 restaurants with 32 unique menu items
- Fully functional shopping cart with state management
- Beautiful, responsive UI with TailwindCSS
- Clean, organized code structure
- Comprehensive documentation

### Project Location:
**Frontend Application:** `/Users/aziza/nfactorial/restoran/frontend/`
**Documentation:** `/Users/aziza/nfactorial/restoran/Aziza_frontend.md`

---

## Contact & Support (Контакты и поддержка)

For questions or issues, refer to:
- Project README: `/Users/aziza/nfactorial/restoran/frontend/README.md`
- This documentation: `/Users/aziza/nfactorial/restoran/Aziza_frontend.md`

**Project Status:** ✅ Complete and Ready for Use
**Last Updated:** December 18, 2025

---

*This project was created for educational purposes as part of the nFactorial program.*
