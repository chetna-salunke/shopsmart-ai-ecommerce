# ShopSmart 🛍️

A modern online shopping website built with React, with a built-in **AI assistant** that answers questions about any product.

> Add a screenshot here after you upload to GitHub:
> `![ShopSmart screenshot](screenshot.png)`

---

## What is this project?

ShopSmart is a small e-commerce website. You can browse products, search and filter them, look at product details, and add things to a shopping cart, just like on a real shopping site.

The extra feature is the **AI Product Assistant**. On any product page you can click **"Ask AI About This Product"** and ask things like:

- "Is this good value for money?"
- "Who is this suitable for?"
- "What are the main advantages?"

The AI reads the product details (price, rating, warranty, specs) and answers in simple words.

I built this project to practise **frontend development with React**. The AI is an add-on to make shopping easier. It is not the main part of the app.

---

## What can it do?

- Home page with a hero banner, category cards and featured products
- Products page with:
  - search (by name or category)
  - filters (category, price, rating, in stock)
  - sorting (price low to high, high to low, rating, newest)
  - a count like "Showing 24 of 100 products"
- Product details page with images, price, discount, specs, stock and quantity selector
- Shopping cart: add, remove, change quantity, clear cart, and a full order summary (subtotal, discount, delivery, total)
- Cart count in the navbar updates instantly, and the cart is saved even if you refresh the page
- AI chat panel with loading text, error message and a "Try Again" button
- Loading, error and empty ("No products found") states everywhere
- Works on desktop, tablet and mobile (with a hamburger menu on small screens)

---

## Languages and tools used

| What | Used for |
|---|---|
| **React 18** | Building the user interface |
| **JavaScript (ES6+)** | All the logic |
| **HTML5 and CSS3** | Structure and styling (no CSS framework) |
| **React Router** | Moving between pages |
| **React Hooks** (`useState`, `useEffect`, `useMemo`, `useContext`) | State and data handling |
| **Vite** | Fast development server and build tool |
| **Node.js + Express** | A small backend that talks to the AI |
| **Fetch API** | Calling REST APIs |
| **DummyJSON** | Free public REST API for product data |
| **Google Gemini API** | The AI that answers questions (free tier) |

---

## How it works (simple version)

```
Your browser (React app)
        |
        |--> DummyJSON API  ............ gets the products
        |
        |--> Express server (port 5001) --> Gemini AI ... gets AI answers
```

The AI key is kept on the Express server, so it is **never exposed** in the website code. That is the safe way to do it.

---

## Folder structure

```
shopsmart/
├── server/
│   └── index.js            # Backend that talks to the AI
├── src/
│   ├── components/         # Navbar, ProductCard, FilterPanel, CartItem, AIProductAssistant...
│   ├── pages/              # Home, Products, ProductDetails, Cart
│   ├── services/           # productApi.js (products) and aiService.js (AI)
│   ├── context/            # CartContext.jsx (shared cart state)
│   ├── hooks/              # useProducts.js (loads products)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example            # Example settings file
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
git clone https://github.com/YOUR-USERNAME/shopsmart.git
cd shopsmart
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

Now open **http://localhost:5173** in your browser. 🎉

> Note: `http://localhost:5001` is only the AI server. It has no web page, so don't open it to see the site.

---

## Common problems and fixes

| Problem | Fix |
|---|---|
| **Port already in use** | Change `PORT` in `.env` and the same number in `src/services/aiService.js`, then restart |
| **"API key not found" or "key missing"** | Check the file is named exactly `.env` (not `.env.txt`) and sits next to `package.json`. Restart the server after editing |
| **AI says "high demand" or "Try Again"** | The free AI is sometimes busy. Wait a few seconds and click **Try Again** |
| **AI says model not available** | Google changes model names often. Change `GEMINI_MODEL` in `.env` to a current Flash model from https://ai.google.dev |
| **"Cannot reach the AI server"** | The server terminal is closed. Run `npm run server` again |
| **Products don't load** | Check your internet connection. The product data comes from dummyjson.com |

The app still works for browsing, filtering and the cart even without the AI server. Only the AI chat needs it.

---

## Important: keep your key safe 🔒

- Never upload your `.env` file to GitHub. It is already listed in `.gitignore`.
- Never share your API key in screenshots, chats or public code.
- If a key leaks, delete it in Google AI Studio and make a new one.

---

## What I learned

- Building a multi-page React app with routing
- Sharing state across the app with Context (the cart)
- Fetching data from a REST API with loading, error and empty states
- Making a layout that works on all screen sizes
- Calling an AI API safely through a backend instead of the browser

---

## Ideas for the future

- Wishlist and dark mode
- Pagination
- Product comparison
- Recently viewed products
- AI-generated product comparisons
- Real checkout and user login

---

## Credits

- Product data: [DummyJSON](https://dummyjson.com)
- AI: [Google Gemini](https://ai.google.dev)

Made by **Chetna salunke** · Feel free to use this project for learning.
