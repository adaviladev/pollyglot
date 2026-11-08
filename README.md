# PollyGlot

Perfect translation every time. PollyGlot is a small web app that translates a piece of text into French, Spanish or Japanese using an AI model.

**Live demo:** [super-kataifi-cad1e0.netlify.app/](https://super-kataifi-cad1e0.netlify.app/)

## Tech stack

- **React** with **Vite** for the interface
- **Netlify Functions** as a small server-side layer between the app and the AI API
- **OpenAI API** for the translations
- Deployed on **Netlify**

## Origin

This started as a solo project from the Scrimba course and was then moved out of the browser editor into its own repository, so that the API key stays on the server.

## Running locally

You need [Node.js](https://nodejs.org) and the [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed.

1. Clone the repository and install the dependencies:

   ```bash
   git clone https://github.com/adaviladev/pollyglot.git
   cd pollyglot
   npm install
   ```

2. Create a `.env` file in the project root with your own values:

   ```
   AI_KEY=your-api-key
   AI_URL=https://api.openai.com/v1
   AI_MODEL=your-model-name
   ```

3. Start the app with the Netlify CLI:

   ```bash
   netlify dev
   ```

4. Open the address shown in the terminal (usually `http://localhost:8888`).

> **Note:** use `netlify dev` instead of `npm run dev`. The translation runs in a Netlify Function, which only exists when the app is started through the Netlify CLI. With `npm run dev` the page loads, but translating will fail.

## How the API key is protected

The OpenAI API key never reaches the browser:

- The app does not call OpenAI directly. It sends only the text and the target language to a Netlify Function (`netlify/functions/translate.mjs`).
- The function holds the key as a server-side environment variable, builds the prompt itself and calls OpenAI.
- Locally the key lives in a `.env` file, which is listed in `.gitignore` and never committed. In production it is stored as a secret in the Netlify dashboard.
- The function only accepts `POST` requests, a non-empty text of up to 500 characters and a language from a fixed list. This limits what someone could do by calling it directly.

## Known limitations

- The function endpoint is public, so anyone who finds it could call it. The validation above limits the abuse, but the project has no rate limiting yet.
