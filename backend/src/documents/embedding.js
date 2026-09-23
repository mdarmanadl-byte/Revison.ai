const OpenAI = require("openai");

const prisma = require("../config/prisma.js");
const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

async function createEmbedding(text, inputType = "passage") {
    const response = await client.embeddings.create({
        model: "nvidia/nemotron-3-embed-1b",
        input: text,
        encoding_format: "float",
        input_type: inputType,
    });

    return response.data[0].embedding;
}


async function saveEmbedding(chunkId, vector) {
    const vectorString = `[${vector.join(",")}]`;

    await prisma.$executeRaw`
        INSERT INTO "Embedding" ("chunk_id", "vector", "model")
        VALUES (
            ${chunkId},
            ${vectorString}::vector,
            ${"nvidia/nemotron-3-embed-1b"}
        )
    `;
}



module.exports = { createEmbedding ,saveEmbedding};