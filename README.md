# ShopSmart

ShopSmart is a small online shopping website I built with React. You can browse products, search and filter them, add things to a cart and go through a checkout. The extra feature is an **AI assistant** on every product page that answers questions about that product.

![ShopSmart overview](docs/screenshots/00-overview.png)

---

## Why I built this

I wanted to practise **frontend development with React**, and an online store is a good project for that because it needs almost everything: routing, shared state, API calls, forms and a layout that works on phones.

The AI part is an add-on. When I shop online I often have a small question ("is this worth the price?") and don't want to read every spec. So I added a chat panel that reads the product details and answers in simple words.

---

## What it can do

- **Home page** with a hero section, shop-by-category cards, a deal of the day with a countdown, trending products with category tabs, and a short section explaining the AI assistant
- **Products page** with search, filters (category, price, rating, in stock), sorting (price, rating, newest) and a count like "Showing 24 of 40 products"
- **Product details** with images, price, discount, specs, stock and a quantity selector
- **Shopping cart** where I can add, remove and change quantities, with a full order summary (subtotal, discount, delivery, total). The cart is saved, so it is still there after a refresh
- **Login and sign up (demo)** with a "Continue with Google" button and email/password forms with validation
- **Checkout (demo)** with delivery details and four payment options: UPI, card, net banking and cash on delivery. It validates the form and ends on an order confirmation page
- **AI Product Assistant** with suggestion chips, a loading state, an error message and a "Try Again" button
- Loading, error and "No products found" states on every page
- Works on desktop, tablet and mobile (with a hamburger menu on small screens)

> **Please note:** login and payment are **demo only**. No real account is created, nothing is sent to a server, and no payment is processed. The customer reviews and newsletter box on the home page are placeholders.

---

## The AI assistant

On any product page I click **"Ask AI About This Product"** and ask things like:

- "What are the main advantages?"
- "Who is this suitable for?"
- "Is this good value for money?"

The app sends the product's details (price, rating, warranty, specs) together with my question to the AI, and it answers using only that information. If the details don't cover the question, it says so.

I kept the AI key on a small Express server instead of the React code, so it is never exposed in the browser.

---

## Screenshots

### Home page
![Home page](docs/screenshots/01-home-full.png)

### Shop with filters
![Shop](docs/screenshots/03-shop.png)

### AI Product Assistant
![AI assistant](docs/screenshots/05-ai-assistant.png)

> The product pictures in these screenshots are placeholder illustrations and the AI answers are example text, because I captured them in a test setup. In the real app the products come from DummyJSON and the answers come from Gemini.

### Cart and checkout
| Cart | Checkout |
| --- | --- |
| ![Cart](docs/screenshots/06-cart.png) | ![Checkout](docs/screenshots/07-checkout.png) |

### Login and sign up (demo)
| Log in | Sign up |
| --- | --- |
| ![Login](docs/screenshots/08-login.png) | ![Sign up](docs/screenshots/08b-signup.png) |

### Mobile
![Mobile](docs/screenshots/10-mobile.png)

---

## Languages and tools used

| What | Used for |
|---|---|
| **React 18** | Building the user interface |
| **JavaScript (ES6+)** | All the logic |
| **HTML5 and CSS3** | Structure and styling (no CSS framework) |
| **React Router** | Moving between pages |
| **React Hooks** (`useState`, `useEffect`, `useMemo`, `useContext`) | State and data handling |
| **Vite** | Development server and build tool |
| **Node.js + Express** | A small backend that talks to the AI |
| **Fetch API** | Calling REST APIs |
| **DummyJSON** | Free public API for product data |
| **Google Gemini API** | The AI that answers questions (free tier) |

---

## How it works

```
Your browser (React app)
        |
        |--> DummyJSON API  ............ gets the products
        |
        |--> Express server (port 5001) --> Gemini AI ... gets the AI answers
```

Product prices come from DummyJSON in dollars, and I convert them to rupees in `productApi.js`.

---

## Folder structure

```
shopsmart/
├── server/
│   └── index.js              # Backend that talks to the AI
├── src/
│   ├── components/           # Navbar, Footer, ProductCard, FilterPanel, CartItem, AIProductAssistant...
│   ├── pages/                # Home, Products, ProductDetails, Cart, Checkout, Login, OrderSuccess
│   ├── services/             # productApi.js (products) and aiService.js (AI)
│   ├── context/              # CartContext.jsx and AuthContext.jsx (shared state)
│   ├── hooks/                # useProducts.js (loads products)
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css             # colours, layout, shared styles
│   ├── home.css              # home page styles
│   └── flow.css              # login, checkout and order pages
├── docs/screenshots/         # images used in this README
├── .env.example              # example settings file
├── index.html
├── package.json
└── vite.config.js
```

---

## How to run it on your computer

### 1. What you need first

- [Node.js](https://nodejs.org) (version 18 or newer)
- A free Gemini API key (see step 3)

### 2. Download and install

```bash
git clone https://github.com/chetna-salunke/shopsmart-ai-ecommerce.git
cd shopsmart-ai-ecommerce
npm install
```

### 3. Get a free AI key (no credit card)

1. Go to **https://aistudio.google.com/apikey**
2. Sign in with your Google account
3. Click **Create API key** and copy it

### 4. Create your `.env` file

In the main project folder (next to `package.json`), copy `.env.example` and rename the copy to `.env`:

```bash
copy .env.example .env      # Windows
cp .env.example .env        # Mac / Linux
```

Open `.env` and fill it like this (no quotes, no spaces around `=`):

```
GEMINI_API_KEY=paste_your_key_here
GEMINI_MODEL=gemini-3.8-flash
PORT=5001
```

Google renames and retires models often, so if the AI says the model is not available, check the current names at https://ai.google.dev and change `GEMINI_MODEL`.

### 5. Start the project

You need **two terminals**, both open in the project folder.

**Terminal 1: the AI server**
```bash
npm run server
```
You should see: `AI provider: gemini (key loaded ...)`

**Terminal 2: the website**
```bash
npm run dev
```

Now open **http://localhost:5173** in your browser.

> `http://localhost:5001` is only the AI server. It has no web page, so don't open it to see the site.

---

## Common problems and fixes

| Problem | Fix |
|---|---|
| **Port already in use** | Change `PORT` in `.env` and the same number in `src/services/aiService.js`, then restart |
| **"API key not found" or "key missing"** | Check the file is named exactly `.env` (not `.env.txt`) and sits next to `package.json`. Restart the server after editing |
| **AI says "high demand" or "Try Again"** | The free AI is sometimes busy. Wait a few seconds and click **Try Again** |
| **AI says model not available** | Change `GEMINI_MODEL` in `.env` to a current Flash model from https://ai.google.dev |
| **"Cannot reach the AI server"** | The server terminal is closed. Run `npm run server` again |
| **Products don't load** | Check your internet connection. The product data comes from dummyjson.com |

Browsing, filtering, the cart and checkout still work without the AI server. Only the AI chat needs it.

---

## Keeping the key safe

- My `.env` file is listed in `.gitignore`, so it is not uploaded to GitHub. Only `.env.example` is, and it has no real key.
- Never share your API key in screenshots, chats or public code.
- If a key leaks, delete it in Google AI Studio and make a new one.

---

## What I learned

- Building a multi-page React app with routing
- Sharing state across the whole app with Context (the cart and the demo login)
- Fetching data from a REST API and handling loading, error and empty states
- Building forms with validation (login, sign up and checkout)
- Making a layout that works on all screen sizes
- Calling an AI API safely through a backend instead of from the browser
- Checking that a secret key is really not committed before pushing to GitHub

---

## Ideas for the future

- A real backend with a database, real login and saved orders
- Real payments
- Wishlist and dark mode
- Pagination
- Product comparison and recently viewed products
- AI-generated product comparisons

---

## Credits

- Product data: [DummyJSON](https://dummyjson.com)
- AI: [Google Gemini](https://ai.google.dev)

Made by **Chetna Salunke**. Feel free to use this project for learning.
