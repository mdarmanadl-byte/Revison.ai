const prisma = require("../config/prisma.js");
const { createEmbedding } = require("./embedding.js");

async function semanticSearch(query, limit = 5) {
    // Create embedding for user's question
    const queryVector = await createEmbedding(query, "query");

    const vectorString = `[${queryVector.join(",")}]`;

    const results = await prisma.$queryRaw`
        SELECT
            dc.id,
            dc.content,
            dc.page_number,
            dc.chunk_index,
            d.id AS document_id,
            d.title,

            1 - (e.vector <=> ${vectorString}::vector) AS similarity

        FROM "Embedding" e

        JOIN "DocumentChunk" dc
            ON dc.id = e.chunk_id

        JOIN "Documents" d
            ON d.id = dc.document_id

        ORDER BY e.vector <=> ${vectorString}::vector

        LIMIT ${limit};
    `;

    return results;
}

module.exports = {
    semanticSearch,
};