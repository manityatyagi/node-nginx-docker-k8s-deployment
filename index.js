import "dotenv/config";
import express from "express";

const app = express()
const PORT = process.env.PORT ?? 9500;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
})

app.get("/health", (req, res) => {
    res.json({
        success: true,
        status: "ok",
        message: "Server is healthy"
    })
})

app.get("/v1/hello", (req, res) => {
  const rawName = req.query.name;
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    return res.json({
      message: "Hello! Welcome to the Rate-Limited Public API.",
      greeting: "Hello, User!",
      timestamp: new Date().toISOString(),
      api_version: "v1"
    });
  }

  return res.json({
    message: `Hello ${name}! Welcome to the Rate-Limited Public API.`,
    greeting: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
    api_version: "v1"
  });
});

app.post("/v1/qa-ai", async (req, res) => {
  const startTime = Date.now();

  try {
    const delay = Math.floor(Math.random() * 800) + 300; 
    await new Promise(resolve => setTimeout(resolve, delay));
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
          success: false,
          message: "Invalid request",
          issue: "question must be a non-empty string"
      });
    }

    const normalizedQuestion = question.trim().toLowerCase();
    // Dummy AI Database
  const AI_DB = [
      { question: "what is ai", answer: "AI stands for Artificial Intelligence. It refers to systems that simulate human intelligence such as learning and reasoning." },
      { question: "what is machine learning", answer: "Machine learning is a subset of AI where systems learn from data without being explicitly programmed." },
      { question: "what is deep learning", answer: "Deep learning uses neural networks with multiple layers to model complex patterns in data." },
      { question: "what is generative ai", answer: "Generative AI creates new content such as text, images, code, or audio." },

      { question: "what is javascript", answer: "JavaScript is a programming language used to create interactive web applications." },
      { question: "what is typescript", answer: "TypeScript adds static typing on top of JavaScript for better tooling and safety." },
      { question: "what is nodejs", answer: "Node.js is a JavaScript runtime built on Chrome’s V8 engine." },
      { question: "what is express js", answer: "Express.js is a minimal Node.js framework for building APIs." },

      { question: "what is docker", answer: "Docker packages applications and dependencies into containers." },
      { question: "what is kubernetes", answer: "Kubernetes manages and scales containerized applications." },
      { question: "what is jwt", answer: "JWT is a secure token format commonly used for authentication." },

      { question: "what is logging", answer: "Logging records application events for debugging and monitoring." },
      { question: "what is monitoring", answer: "Monitoring tracks system performance and health using metrics and alerts." },
      { question: "what is prometheus", answer: "Prometheus is a monitoring system for collecting time-series metrics." }
    ];

    const match = AI_DB.find(entry =>
      normalizedQuestion.includes(entry.question)
    );

    if (!match) {
      return res.status(404).json({
          success: false,
          message: "No matching answer found",
          answer: null
      });
    }

    const latencyMs = Date.now() - startTime;

    return res.status(200).json({
        success: true,
        question,
        answer: match.answer,
        model: "Dummy-AI-v1",
        latencyMs
    });

} catch (error) {
    console.error("[Dummy AI Error]", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      model: "Dummy-AI-v1"
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})