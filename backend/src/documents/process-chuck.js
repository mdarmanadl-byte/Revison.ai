const { extractPdfText } = require("./pdf-extractor");
const { chunkText } = require("./chunker");
const prisma = require("../config/prisma");
const { createEmbedding ,saveEmbedding} = require("./embedding");
async function processDocument(document) {
    const extracted = await extractPdfText(document.file_url);

    const cleanText = extracted.text.replace(/\u0000/g, "");
    const pages = extracted.pages;
    console.log(pages)
    const chunks = chunkText(cleanText);

    for (const [index, content] of chunks.entries()) {
    // 1. save chunk
    const chunk = await prisma.documentChunk.create({
        data: {
            content,
            page_number: pages[index] || 0,
            chunk_index: index,
            document_id: document.id,
        },
    });

    // 2. create embedding
    const vector = await createEmbedding(content);

    // 3. save vector
    await saveEmbedding(chunk.id, vector);
}

    return chunks;
}

module.exports = { processDocument };