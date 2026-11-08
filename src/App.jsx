import { useState } from "react";

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
      <header>
        <img src="assets/parrot.png" alt="PollyGlot parrot" />
        <div>
          <h1>PollyGlot</h1>
          <p>Perfect Translation Every Time</p>
        </div>
      </header>

      <main>
        <h2>Text to translate</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <h2>Select language</h2>

        <label>
          <input
            type="radio"
            name="language"
            value="French"
            checked={language === "French"}
            onChange={(e) => setLanguage(e.target.value)}
          />
          French
          <img src="assets/fr-flag.png" alt="French flag" />
        </label>
        <label>
          <input
            type="radio"
            name="language"
            value="Spanish"
            checked={language === "Spanish"}
            onChange={(e) => setLanguage(e.target.value)}
          />
          Spanish
          <img src="assets/sp-flag.png" alt="Spanish flag" />
        </label>
        <label>
          <input
            type="radio"
            name="language"
            value="Japanese"
            checked={language === "Japanese"}
            onChange={(e) => setLanguage(e.target.value)}
          />
          Japanese
          <img src="assets/jpn-flag.png" alt="Japanese flag" />
        </label>

        <button onClick={handleTranslate} disabled={isLoading}>
          {isLoading ? "Translating..." : "Translate"}
        </button>

        <h2>Your translation</h2>
        <p className="translation">{translation}</p>
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}
