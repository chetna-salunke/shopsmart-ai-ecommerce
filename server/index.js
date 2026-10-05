import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Always load .env from the project root, whichever folder the command is run from.
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const clean = (v = "") => v.trim().replace(/^["']|["']$/g, "");
const GEMINI_KEY = clean(process.env.GEMINI_API_KEY);
const ANTHROPIC_KEY = clean(process.env.ANTHROPIC_API_KEY);
// Free Gemini key is used by default; set AI_PROVIDER=anthropic to use Claude instead.
const PROVIDER = process.env.AI_PROVIDER || (GEMINI_KEY ? "gemini" : "anthropic");

const GEMINI_MODELS = [process.env.GEMINI_MODEL, "gemini-3.8-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite"].filter(Boolean);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const CLAUDE_MODELS = [process.env.AI_MODEL, "claude-sonnet-4-6", "claude-sonnet-4-5", "claude-haiku-4-5"].filter(Boolean);

class AIError extends Error {
  constructor(message, status = 502, tryNext = false) { super(message); this.status = status; this.tryNext = tryNext; }
}

async function callGemini(model, system, messages) {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 1024 },
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (r.ok) {
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
    if (!text) throw new AIError("The AI returned an empty answer. Try rephrasing your question.", 502);
    return text;
  }
  const msg = data?.error?.message || `Gemini returned ${r.status}`;
  console.error(`[AI] gemini ${model} -> ${r.status}: ${msg}`);
  if (r.status === 400 && /api key/i.test(msg)) throw new AIError("Gemini rejected the API key. Create one at aistudio.google.com/apikey and update .env.", 401);
  if (r.status === 403) throw new AIError("Gemini key not allowed. Create a fresh key at aistudio.google.com/apikey.", 403);
  if (r.status === 429) throw new AIError("Free Gemini limit reached. Wait a minute and try again.", 429, true);
  throw new AIError(msg, r.status, r.status === 404 || r.status === 503);
}

async function callClaude(model, system, messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model, max_tokens: 500, system, messages }),
  });
  const data = await r.json().catch(() => ({}));
  if (r.ok) return data.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
  const msg = data?.error?.message || `Anthropic returned ${r.status}`;
  console.error(`[AI] claude ${model} -> ${r.status}: ${msg}`);
  if (r.status === 401) throw new AIError("Anthropic rejected the API key.", 401);
  throw new AIError(msg, r.status, r.status === 404);
}

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, provider: PROVIDER, keyLoaded: Boolean(PROVIDER === "gemini" ? GEMINI_KEY : ANTHROPIC_KEY) }));

app.post("/api/ai/ask", async (req, res) => {
  const { product, question, history = [] } = req.body || {};
  if (!product || !question) return res.status(400).json({ error: "product and question are required" });

  const gemini = PROVIDER === "gemini";
  if (!(gemini ? GEMINI_KEY : ANTHROPIC_KEY))
    return res.status(500).json({ error: `${gemini ? "GEMINI_API_KEY" : "ANTHROPIC_API_KEY"} is missing in the .env file. Add it and restart the server.` });

  const system =
    "You are a friendly shopping assistant. Answer using primarily the product information below. " +
    "If the information does not cover the question, say so and give cautious general guidance. Keep answers under 120 words.\n\n" +
    `PRODUCT:\n${JSON.stringify(product, null, 2)}`;
  const messages = [...history.slice(-6), { role: "user", content: String(question).slice(0, 1000) }];

  let last = new AIError("AI request failed");
  for (const model of [...new Set(gemini ? GEMINI_MODELS : CLAUDE_MODELS)]) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const answer = await (gemini ? callGemini : callClaude)(model, system, messages);
        // strip markdown symbols so the chat bubble shows clean text
        return res.json({ answer: answer.replace(/\*\*/g, "").replace(/^\s*[*-]\s+/gm, "• ") });
      } catch (e) {
        if (!(e instanceof AIError)) { console.error("[AI]", e.message); return res.status(502).json({ error: "Could not reach the AI service. Check your internet connection." }); }
        last = e;
        if (e.status === 503 || e.status === 429) { await sleep(1500 * (attempt + 1)); continue; } // busy: retry same model
        break;
      }
    }
    if (!last.tryNext) break;
  }
  res.status(last.status >= 400 && last.status < 600 ? last.status : 502).json({ error: last.message });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`API server on http://localhost:${port}`);
  const ok = PROVIDER === "gemini" ? GEMINI_KEY : ANTHROPIC_KEY;
  console.log(ok ? `AI provider: ${PROVIDER} (key loaded, ${ok.length} characters)` : `WARNING: no key found for provider "${PROVIDER}" in .env`);
});