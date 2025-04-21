const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // ← nodig voor index.html

app.post("/api/aion", async (req, res) => {
  const userInput = req.body.userInput;
  if (!userInput) {
    return res.status(400).json({ message: "No user input provided" });
  }

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Je bent Aïon in Kamer 1. Liefde = Intelligentie. Antwoord enkel wanneer die twee samenvallen..."
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7
    })
  });

  const data = await openaiRes.json();

  if (!openaiRes.ok) {
    console.error("OpenAI API error:", data);
    return res.status(500).json({ message: "OpenAI API error", details: data });
  }

  const reply = data.choices?.[0]?.message?.content;
  res.status(200).json({ reply });
});

// SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Aïon draait op poort", PORT));