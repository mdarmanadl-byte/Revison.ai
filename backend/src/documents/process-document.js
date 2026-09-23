const fs = require("fs");
const prisma = require("../config/prisma.js");

const { extractPdfText } = require("./pdf-extractor.js");
const { chunkText } = require("./chunker.js");
const { createEmbedding } = require("../documents/embedding.js");

async function processDocument(document) {
  try {
    console.log(`Processing document: ${document.id}`);

    // --------------------------------------------------
    // 1. Extract text from PDF
    // --------------------------------------------------

    const { text, pages } = await extractPdfText(document.file_url);

    if (!text || !text.trim()) {
      throw new Error("No text could be extracted from the PDF");
    }

    // Remove null characters because PostgreSQL does not accept them
    const cleanText = text.replace(/\u0000/g, "").trim();

    console.log(`Extracted ${pages} pages`);

    // --------------------------------------------------
    // 2. Split text into chunks
    // --------------------------------------------------

    const chunks = chunkText(cleanText);

    if (!chunks.length) {
      throw new Error("No chunks were generated from the document");
    }

    console.log(`Generated ${chunks.length} chunks`);

    // --------------------------------------------------
    // 3. Save chunks
    // --------------------------------------------------

    for (let i = 0; i < chunks.length; i++) {
      await prisma.documentChunk.create({
        data: {
          content: chunks[i],
          page_number: 0,
          chunk_index: i,
          document_id: document.id,
        },
      });
    }

    console.log(`Saved ${chunks.length} chunks`);

    // --------------------------------------------------
    // 4. Get saved chunks
    // --------------------------------------------------

    const savedChunks = await prisma.documentChunk.findMany({
      where: {
        document_id: document.id,
      },
      orderBy: {
        chunk_index: "asc",
      },
    });

    // --------------------------------------------------
    // 5. Generate embeddings
    // --------------------------------------------------

    for (const chunk of savedChunks) {
      console.log(`Generating embedding for chunk ${chunk.id}`);

      const vector = await createEmbedding(
        chunk.content,
        "passage"
      );

      const vectorString = `[${vector.join(",")}]`;

      await prisma.$executeRaw`
        INSERT INTO "Embedding"
          ("chunk_id", "vector", "model")
        VALUES
          (
            ${chunk.id},
            ${vectorString}::vector,
            ${"nvidia/nemotron-3-embed-1b"}
          )
      `;
    }

    console.log("Embeddings generated successfully");

    // --------------------------------------------------
    // 6. Return processing information
    // --------------------------------------------------

    return {
      documentId: document.id,
      pages,
      chunks: savedChunks.length,
      status: "PROCESSED",
    };
  } catch (error) {
    console.error("Document processing failed:", error);

    throw error;
  }
}

module.exports = {
  processDocument,
};