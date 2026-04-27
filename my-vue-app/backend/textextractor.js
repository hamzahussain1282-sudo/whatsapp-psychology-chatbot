import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// ✅ Path to your PDF
const filePath = "./Current Essentials of Medicine(1)(1).pdf";

export const extractText = async () => {
  try {
    // 1️⃣ Load and parse PDF using LangChain’s built-in PDFLoader
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    console.log(`📄 Loaded ${docs.length} pages from PDF`);

    // 2️⃣ Combine all pages into a single text string
    const text = docs.map((doc) => doc.pageContent).join("\n");

    // 3️⃣ Split extracted text into smaller overlapping chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,  // Each chunk will have ~1000 characters
      chunkOverlap: 200, // Overlap for context continuity
    });

    const splittedText = await textSplitter.splitText(text);

    console.log(`✅ Created ${splittedText.length} chunks`);
    return splittedText;
  } catch (err) {
    console.error("❌ Error extracting text:", err);
    return [];
  }
};
