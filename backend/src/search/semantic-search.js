const prisma = require("../config/prisma.js");
const { createEmbedding } = require("../documents/embedding.js");

async function semanticSearch(
    query,
    userId,
    limit = 5,
    subjectId = null,
    documentId = null
) {
    if (!query || typeof query !== "string") {
        throw new Error("Search query is required");
    }

    if (!userId) {
        throw new Error("User ID is required");
    }

    const queryVector = await createEmbedding(
        query,
        "query"
    );

    const vectorString = `[${queryVector.join(",")}]`;

    const results = await prisma.$queryRaw`
        SELECT
            dc.id,
            dc.content,
            dc.page_number,
            dc.chunk_index,

            d.id AS document_id,
            d.title,

            s.id AS subject_id,
            s.name AS subject_name,

            1 - (e.vector <=> ${vectorString}::vector)
                AS similarity

        FROM "Embedding" e

        INNER JOIN "DocumentChunk" dc
            ON dc.id = e.chunk_id

        INNER JOIN "Documents" d
            ON d.id = dc.document_id

        INNER JOIN "Subject" s
            ON s.id = d.subject_id

        WHERE
            d.user_id = ${userId}

            AND (
                ${subjectId}::int IS NULL
                OR d.subject_id = ${subjectId}
            )

            AND (
                ${documentId}::int IS NULL
                OR d.id = ${documentId}
            )

        ORDER BY e.vector <=> ${vectorString}::vector

        LIMIT ${limit};
    `;

    return results;
}

module.exports = {
    semanticSearch,
};