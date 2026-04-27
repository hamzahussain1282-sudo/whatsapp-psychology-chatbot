import { ChromaClient } from "chromadb";
import { HfInference } from "@huggingface/inference";
import { extractText } from "./textextractor.js";
import 'dotenv/config';

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false
});

const apiKey = process.env.HUGGINGFACE_API_KEY;
const hf = new HfInference(apiKey);

let collection = null;

export const rag_database = async () => {
  if (!collection) {
    try {
      collection = await client.getOrCreateCollection({
        name: "rag_database",
      });
      console.log("✅ Collection created or loaded.");

      const data = await extractText();
      console.log(`📄 Extracted ${data.length} chunks from PDF.`);

      if (data.length === 0) return collection;

      // feature extraction expects array
      const embeddings = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: data
      });

      const ids = data.map((_, i) => `chunk-${i}`);

      await collection.add({
        ids,
        embeddings,
        documents: data
      });

      console.log("✅ Data successfully stored in Chroma vector DB!");
    } catch (err) {
      console.error("❌ Error in rag_database:", err);
    }
  } else {
    console.log("ℹ️ Collection already exists, skipping creation.");
  }

  return collection;
};
