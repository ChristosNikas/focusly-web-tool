# Focusly

A browser extension that blocks distracting websites using AI. When you start a focus session, every site you visit gets checked — if it's classified as distracting (social media, video platforms, etc), you get redirected to a block page instead.

## How it works

When focus mode is on, the extension sends the URL of each page you visit to a small backend server, which asks an AI model (via OpenRouter) whether the site is distracting. If yes, the site gets added to a blocklist and you're redirected. Sites already in the blocklist are blocked instantly without another API call.

Search engines are whitelisted so they're never blocked.

## Stack

- Extension: HTML, Tailwind CSS, vanilla JS, Manifest V3
- Backend: Node.js + Express
- AI: OpenRouter API

## Setup

**Backend:**

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

API_KEY=your-openrouter-api-key

Run the server:

```bash
node server.js
```

**Extension:**

1. Go to `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked" and select the `extension` folder

The server needs to be running locally for the extension to work — it keeps the API key out of the browser.

## Notes

This was built as a learning project to understand how browser extensions work — manifest config, background scripts, content scripts, and connecting to an external API safely. Currently runs locally only; deploying the backend is a possible next step.