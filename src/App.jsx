import { useState } from "react";
import Header from "./components/Header.jsx";
import TranslationResult from "./components/TranslationResult.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("French");
  const [translation, setTranslation] = useState("Aquí va la traducción");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranslate() {
    if (text.trim() === "") return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setTranslation(data.translation);
    } catch (err) {
      console.log("Algo falló:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main>
        <h2>Text to translate</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <LanguageSelector language={language} onLanguageChange={setLanguage} />

        <button onClick={handleTranslate} disabled={isLoading}>
          {isLoading ? "Translating..." : "Translate"}
        </button>
        <TranslationResult translation={translation} error={error} />
      </main>
    </div>
  );
}
