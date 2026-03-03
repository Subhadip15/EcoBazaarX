src/
├── assets/              # Static files (logo, icons, default product images)
├── components/          # Reusable UI components
│   ├── Common/          # Shared UI (Navbar, Footer, Button, Loader)
│   ├── Product/         # Product-specific (ProductCard, CarbonBadge)
│   └── Cart/            # Cart-specific (CartItem, GreenAlternative)
├── context/             # Global State Management
│   ├── AuthContext.jsx  # Manages JWT tokens and User Roles (ADMIN/USER)
│   └── CartContext.jsx  # Manages Shopping Cart items and Carbon Totals
├── hooks/               # Custom React hooks (useAuth, useCart)
├── pages/               # Main application views/routes
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Auth page
│   ├── ProductCatalog.jsx # Admin management and User browsing
│   ├── ProductDetails.jsx # Individual product impact breakdown
│   ├── CartPage.jsx     # Flipkart-style cart with Smart Suggestions
│   └── Checkout.jsx     # Final order summary and CO2e savings
├── services/            # API and External integration logic
│   ├── productService.js # Axios calls for GET/POST/PUT/DELETE /api/product
│   ├── authService.js    # Axios calls for /api/login and /api/signup
│   └── cloudinaryService.js # Image upload logic for Cloudinary
├── styles/              # Global and Component-specific CSS
│   ├── Global.css       # Resets and theme variables (Green/Orange)
│   ├── ProductCatalog.css
│   └── CartPage.css     # Sticky sidebar and card styling
├── utils/               # Helper functions
│   └── carbonHelpers.js # Logic for getCarbonBucket() and rounding
├── App.js               # Route definitions and Context Providers
└── main.jsx             # Entry point