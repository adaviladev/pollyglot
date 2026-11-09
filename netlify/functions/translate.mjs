const LANGUAGES = ["French", "Spanish", "Japanese"];
const MODES = ["translate", "correct"];
const MAX_LENGTH = 500;

function buildMessages(mode, text, language) {
  if (mode === "correct") {
    return [
      {
        role: "system",
        content:
          "You are an expert proofreader. Fix the spelling and grammar of the text, keeping its original language. Reply only with the corrected text, nothing else.",
      },
      { role: "user", content: text },
    ];
  }

  return [
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
}

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { text, language, mode = "translate" } = body;

  if (!MODES.includes(mode)) {
    return Response.json({ error: "Invalid mode" }, { status: 400 });
  }

  if (
    typeof text !== "string" ||
    text.trim() === "" ||
    text.length > MAX_LENGTH
  ) {
    return Response.json({ error: "Invalid text" }, { status: 400 });
  }

  if (mode === "translate" && !LANGUAGES.includes(language)) {
    return Response.json({ error: "Invalid language" }, { status: 400 });
  }

  const messages = buildMessages(mode, text, language);

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
      console.error("OpenAI error:", response.status);
      return Response.json({ error: "Request failed" }, { status: 502 });
    }

    const data = await response.json();
    return Response.json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error("Function error:", err);
    return Response.json({ error: "Request failed" }, { status: 502 });
  }
};
