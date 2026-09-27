const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL =
    process.env.LLM_MODEL ||
    "nvidia/nemotron-3.5-lightning-30b-a3b";

function extractFirstJsonObject(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Empty AI response");
    }

    const start = text.indexOf("{");

    if (start === -1) {
        throw new Error(
            `AI response does not contain JSON: ${text.slice(0, 500)}`
        );
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
        const char = text[i];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (inString) {
            continue;
        }

        if (char === "{") {
            depth++;
        }

        if (char === "}") {
            depth--;

            if (depth === 0) {
                return text.slice(start, i + 1);
            }
        }
    }

    throw new Error("AI returned incomplete JSON");
}

function parseJSON(content) {
    const jsonText = extractFirstJsonObject(content);

    try {
        return JSON.parse(jsonText);
    } catch (error) {
        throw new Error(
            `Invalid JSON syntax: ${error.message}`
        );
    }
}

function validateAnalysis(data) {
    if (!data || typeof data !== "object") {
        throw new Error("AI analysis is not an object");
    }

    if (!data.topic || typeof data.topic !== "object") {
        throw new Error("AI analysis is missing topic");
    }

    if (
        typeof data.topic.name !== "string" ||
        !data.topic.name.trim()
    ) {
        throw new Error("Invalid topic name");
    }

    if (
        typeof data.topic.description !== "string"
    ) {
        throw new Error("Invalid topic description");
    }

    if (!Array.isArray(data.concepts)) {
        throw new Error("AI analysis is missing concepts");
    }

    const concepts = data.concepts
        .filter(
            (concept) =>
                concept &&
                typeof concept.name === "string" &&
                concept.name.trim()
        )
        .map((concept) => ({
            name: concept.name.trim(),

            description:
                typeof concept.description === "string"
                    ? concept.description.trim()
                    : "",

            importance: [
                "HIGH",
                "MEDIUM",
                "LOW",
            ].includes(concept.importance)
                ? concept.importance
                : "MEDIUM",

            difficulty: [
                "EASY",
                "MEDIUM",
                "HARD",
            ].includes(concept.difficulty)
                ? concept.difficulty
                : "MEDIUM",
        }));

    if (!concepts.length) {
        throw new Error("AI returned no concepts");
    }

    return {
        topic: {
            name: data.topic.name.trim(),
            description: data.topic.description.trim(),
        },
        concepts,
    };
}


/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
|
| We deliberately DON'T use response_format here.
|
| Nemotron is returning its reasoning text even when JSON mode is requested.
|
| We instead instruct the model to put the JSON at the END of the response,
| then extract the JSON object from the response.
|
|--------------------------------------------------------------------------
*/

async function callTopicAI(context) {

    const systemPrompt = `
You are a study material analyzer.

Your task is to analyze educational text and return structured JSON.

IMPORTANT:

Do NOT output your reasoning.

Do NOT output a thinking process.

Do NOT output:
- "Here's a thinking process"
- analysis
- explanations
- markdown
- code fences

Your FINAL ANSWER must contain this JSON object:

{
  "topic": {
    "name": "string",
    "description": "string"
  },
  "concepts": [
    {
      "name": "string",
      "description": "string",
      "importance": "HIGH",
      "difficulty": "EASY"
    }
  ]
}

Rules:

1. Identify the main topic.
2. Extract important concepts actually present in the text.
3. Do not invent information.
4. importance must be HIGH, MEDIUM, or LOW.
5. difficulty must be EASY, MEDIUM, or HARD.
6. Keep concept descriptions concise.
7. Return at least 3 concepts when the material contains enough information.
8. The JSON must be valid.
9. The JSON object must appear as the final structured answer.

DO NOT discuss how you solved the task.
`;

    const userPrompt = `
Analyze the following educational material.

Return the required JSON.

EDUCATIONAL MATERIAL:

${context}
`;

    console.log("Sending topic analysis request to Nemotron...");

    const response =
        await client.chat.completions.create({
            model: MODEL,

            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],

            temperature: 0,

            max_tokens: 3000,
        });

    const content =
        response.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("Empty AI response");
    }

    console.log(
        `AI response received (${content.length} characters)`
    );

    console.log(
        "AI response preview:",
        content.slice(0, 500)
    );

    return parseJSON(content);
}


/*
|--------------------------------------------------------------------------
| Main analyzer
|--------------------------------------------------------------------------
*/

async function analyzeTopic(chunks) {

    if (
        !Array.isArray(chunks) ||
        chunks.length === 0
    ) {
        throw new Error(
            "No chunks provided for topic analysis"
        );
    }

    const validChunks = chunks.filter(
        (chunk) =>
            chunk &&
            typeof chunk.content === "string" &&
            chunk.content.trim()
    );

    if (!validChunks.length) {
        throw new Error(
            "Document chunks contain no text"
        );
    }

    console.log(
        `Analyzing topic using ${validChunks.length} chunks with ${MODEL}`
    );

    /*
     * Don't send all chunks blindly.
     *
     * Limit context to avoid huge prompts.
     */

    const MAX_CHUNKS = 13;

    const selectedChunks =
        validChunks.slice(0, MAX_CHUNKS);

    const context = selectedChunks
        .map(
            (chunk, index) =>
                `CHUNK ${index + 1}:\n${chunk.content}`
        )
        .join("\n\n");

    let analysis;

    try {

        analysis = await callTopicAI(context);

    } catch (error) {

        console.error(
            "First topic analysis failed:",
            error.message
        );

        /*
         * SECOND ATTEMPT
         *
         * Send a much smaller context.
         *
         * This is important because if the model starts producing
         * reasoning instead of JSON, reducing the context often
         * prevents the problem.
         */

        console.log(
            "Retrying topic analysis with reduced context..."
        );

        const reducedChunks =
            selectedChunks.slice(0, 6);

        const reducedContext =
            reducedChunks
                .map(
                    (chunk, index) =>
                        `CHUNK ${index + 1}:\n${chunk.content}`
                )
                .join("\n\n");

        try {

            analysis =
                await callTopicAI(
                    reducedContext
                );

        } catch (retryError) {

            console.error(
                "Second topic analysis failed:",
                retryError.message
            );

            throw new Error(
                `AI topic analysis failed: ${retryError.message}`
            );
        }
    }

    return validateAnalysis(analysis);
}

module.exports = {
    analyzeTopic,
};