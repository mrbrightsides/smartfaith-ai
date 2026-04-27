import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // AI Clients
  const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { persona, message, history, personaInstructions } = req.body;

    try {
      // Try Gemini First
      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: personaInstructions,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text, provider: 'gemini' });

    } catch (error: any) {
      console.error("Gemini Error, checking for fallback...", error.message);
      
      // Check if fallback to OpenAI is possible
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        try {
          console.log("Falling back to OpenAI...");
          const messages: any[] = [
            { role: "system", content: personaInstructions },
            ...history.map((h: any) => ({
              role: h.role === 'model' ? 'assistant' : 'user',
              content: h.parts[0].text
            })),
            { role: "user", content: message }
          ];

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
          });

          const responseText = completion.choices[0].message.content;
          return res.json({ text: responseText, provider: 'openai' });
        } catch (oaError: any) {
          console.error("OpenAI Fallback Error:", oaError.message);
          return res.status(500).json({ error: "Both Gemini and OpenAI failed." });
        }
      }

      return res.status(500).json({ error: "Gemini failed and no OpenAI key provided." });
    }
  });

  app.post("/api/generate-khutbah", async (req, res) => {
    const { prompt, systemInstruction } = req.body;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text, provider: 'gemini' });
    } catch (error) {
      if (import.meta.env.VITE_OPENAI_API_KEY) {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
        });
        return res.json({ text: completion.choices[0].message.content, provider: 'openai' });
      }
      return res.status(500).json({ error: "Failed to generate khutbah" });
    }
  });

  app.post("/api/analyze-hafalan", async (req, res) => {
    const { audioBase64, prompt, systemInstruction } = req.body;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "audio/mp3",
                  data: audioBase64
                }
              }
            ]
          }
        ],
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
        }
      });

      return res.json({ text: response.text, provider: 'gemini' });
    } catch (error) {
      // Audio fallback is complex, for now we just return error if Gemini fails
      return res.status(500).json({ error: "Failed to analyze hafalan (Gemini only for audio)" });
    }
  });

  // Vite middleware for development
  if (import.meta.env.VITE_NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
