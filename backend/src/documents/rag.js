const OpenAI = require("openai");
const { semanticSearch } = require("./sementic-search.js");

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

async function answerQuestion(question) {
    const chunks = await semanticSearch(question, 5);

    if (!chunks.length) {
        return {
            answer: "I could not find relevant information in your notes.",
            sources: [],
        };
    }

    const context = chunks
        .map(
            (chunk, index) =>
                `[Source ${index + 1}]\n${chunk.content}`
        )
        .join("\n\n");

    const response = await client.chat.completions.create({
        model: process.env.LLM_MODEL,
        messages: [
            {
                role: "system",
                content:
                    "You are a study assistant. Answer only using the provided study material. If the answer is not present in the material, say that it is not available in the provided notes.",
            },
            {
                role: "user",
                content: `
Study material:

${context}

Question:
${question}

Give a clear and concise answer suitable for a student.
                `,
            },
        ],
        temperature: 0.2,
        max_tokens: 1000,
    });

    return {
        answer: response.choices[0].message.content,
        sources: chunks.map((chunk) => ({
            document_id: chunk.document_id,
            title: chunk.title,
            chunk_id: chunk.id,
            similarity: chunk.similarity,
        })),
    };
}

module.exports = {
    answerQuestion,
};