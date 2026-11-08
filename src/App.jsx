import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("French");
  const [translation, setTranslation] = useState("Aquí va la traducción");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranslate() {
    if (text.trim() === "") return;

    const messages = [
      {
        role: "system",
        content:
          "You are an expert translator. Reply only with the translation, nothing else.",
      },
      {
        role: "user",
        content: `Translate the following text into ${language}: ${text}`,
      },
    ];

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.AI_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setTranslation(data.choices[0].message.content);
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
