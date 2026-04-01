import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const chatRouter = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

chatRouter.post("/", async (req, res) => {
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
    const { messages } = payload;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid chat payload: messages must be a non-empty array" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert UI messages to Generative AI format
    const history = messages
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: typeof msg.content === "string" ? msg.content : "" }],
      }));

    const chat = model.startChat({
      history: history.length > 1 ? history.slice(0, -1) : [],
      generationConfig: { maxOutputTokens: 1000 },
    });

    const userMessage = messages[messages.length - 1]?.content || "";
    const systemPrompt = "You are a helpful AI assistant for a food delivery website. You can help users find food, describe menu items, and answer questions about their orders or the delivery service. Keep your answers concise and friendly.";

    // Stream response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await chat.sendMessageStream(systemPrompt + "\n\nUser: " + userMessage);

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

export default chatRouter;
