import express from "express";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";

const chatRouter = express.Router();

chatRouter.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: "You are a helpful AI assistant for a food delivery website. You can help users find food, describe menu items, and answer questions about their orders or the delivery service. Keep your answers concise and friendly.",
      messages,
    });

    result.pipeTextStreamToResponse(res);
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

export default chatRouter;
