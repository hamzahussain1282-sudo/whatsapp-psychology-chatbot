import express from "express";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import cors from "cors";
import { rag_database } from "./chroma.js";
import { startWhatsAppBot } from "./whatsapp.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ⚡ Use HfInference
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

let collection;

// ✅ Initialize vector DB once at startup
(async () => {
  collection = await rag_database();
  startWhatsAppBot();
})();

// Root endpoint
app.get("/", (req, res) => {
  res.send("RAG server is running!");
});

export const askQuestion = async (question) => {
  if (!collection) {
    throw new Error("Collection not initialized");
  }

  // 1️⃣ Embed the user’s question
  const questionEmbedding = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: question,
  });

  // 2️⃣ Query your vector DB
  const results = await collection.query({
    queryEmbeddings: [questionEmbedding],
    nResults: 3,
  });

  const context = results.documents[0].join("\n");

  // 3️⃣ Build prompt
  const prompt = `
    Use the following context to answer the question:
    Context:
    ${context}
    Question: ${question}
  `;

  // 4️⃣ Generate answer
  const answer = await hf.chatCompletion({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      { role: "system", content: "You are a helpful assistant that answers based on the given context." },
      { role: "user", content: prompt },
    ],
    max_tokens: 250,
  });

  return answer.choices[0].message.content;
};

// Retriever + Generation endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await askQuestion(question);
    res.json({ answer });
  } catch (err) {
    console.error("❌ Error in /ask:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => console.log("🚀 Server running on port 5000"));
