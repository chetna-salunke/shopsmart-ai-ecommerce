# ShopSmart 🛍️🤖

<img width="2160" height="5120" alt="01-home-full" src="https://github.com/user-attachments/assets/5bdd1d13-d63f-4e3c-ac91-eedd6c90ad90" />

### Mobile UI

<img width="2482" height="1293" alt="10-mobile" src="https://github.com/user-attachments/assets/97ac1480-ee46-4b8d-8b93-6dddd39581a2" />

ShopSmart is a small online shopping website I built with React. You can browse products, search and filter them, add things to a cart and go through a checkout. The extra feature is an **AI assistant** on every product page that answers questions about that product.

---

## Why I built this

I wanted to practise **frontend development with React**, and an online store is a good project for that because it needs almost everything: routing, shared state, API calls, forms and a layout that works on phones.

The AI part is an add-on. When I shop online I often have a small question ("is this worth the price?") and don't want to read every spec. So I added a chat panel that reads the product details and answers in simple words.

---

## The AI assistant

On any product page I click **"Ask AI About This Product"** and ask things like:

- "What are the main advantages?"
- "Who is this suitable for?"
- "Is this good value for money?"

The app sends the product's details (price, rating, warranty, specs) together with my question to the AI, and it answers using only that information. If the details don't cover the question, it says so.

I kept the AI key on a small Express server instead of the React code, so it is never exposed in the browser.

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
