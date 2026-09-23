const OpenAI = require("openai");
const {
    semanticSearch,
} = require("../search/semantic-search.js");

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = "nvidia/nemotron-3-nano-30b-a3b";

async function answerQuestion({
    question,
    userId,
    subjectId = null,
    documentId = null,
}) {
    const chunks = await semanticSearch(
        question,
        userId,
        5,
        subjectId,
        documentId
    );

    if (!chunks.length) {
        return {
            answer:
                "I could not find relevant information in your study material.",
            sources: [],
        };
    }

    const context = chunks
        .map(
            (chunk, index) =>
                `[Source ${index + 1}]
Subject: ${chunk.subject_name}
Document: ${chunk.title}

${chunk.content}`
        )
        .join("\n\n");

    const response =
        await client.chat.completions.create({
            model: MODEL,

            messages: [
                {
                    role: "system",
                    content: `
You are a study assistant.

Answer the student's question ONLY using
the provided study material.

If the answer is not present in the material,
say that it is not available in the provided notes.

Do not invent facts.
Keep the explanation clear and student-friendly.
                    `,
                },
                {
                    role: "user",
                    content: `
Study material:

${context}

Question:
${question}
                    `,
                },
            ],

            temperature: 0.2,
            max_tokens: 1000,
        });

    return {
        answer:
            response.choices?.[0]?.message?.content || "",

        sources: chunks.map((chunk) => ({
            document_id: chunk.document_id,
            document_title: chunk.title,
            subject_id: chunk.subject_id,
            subject_name: chunk.subject_name,
            chunk_id: chunk.id,
            similarity: chunk.similarity,
        })),
    };
}

module.exports = {
    answerQuestion,
};