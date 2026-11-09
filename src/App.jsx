import { useState } from "react";
import Header from "./components/Header.jsx";
import TranslationResult from "./components/TranslationResult.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import TextInput from "./components/TextInput.jsx";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("French");
  const [translation, setTranslation] = useState("Aquí va la traducción");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequest(mode) {
    if (text.trim() === "") return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/.netlify/functions/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, mode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setTranslation(data.result);
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
        <TextInput text={text} onTextChange={setText} />
        <LanguageSelector language={language} onLanguageChange={setLanguage} />
        <button onClick={() => handleRequest("translate")} disabled={isLoading}>
          {isLoading ? "Translating..." : "Translate"}
        </button>
        <button onClick={() => handleRequest("correct")} disabled={isLoading}>
          Correct
        </button>
        <TranslationResult translation={translation} error={error} />
      </main>
    </div>
  );
}
