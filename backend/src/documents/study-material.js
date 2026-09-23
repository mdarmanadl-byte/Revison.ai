const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = "nvidia/nemotron-3-nano-30b-a3b";

const BATCH_SIZE = 10;
const CONCURRENCY = 5;
const MAX_RETRIES = 3;

function createBatches(items, size) {
    const batches = [];

    for (let i = 0; i < items.length; i += size) {
        batches.push(items.slice(i, i + size));
    }

    return batches;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
    const status = error?.status || error?.response?.status;

    return (
        status === 429 ||
        status >= 500 ||
        error?.code === "ETIMEDOUT" ||
        error?.code === "ECONNRESET"
    );
}

async function withRetry(fn, label) {
    let lastError;

    for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (
                attempt > MAX_RETRIES ||
                !isRetryableError(error)
            ) {
                throw error;
            }

            const delay = Math.min(
                1000 * Math.pow(2, attempt - 1),
                10000
            );

            console.log(
                `⚠️ ${label} failed. Retry ${attempt}/${MAX_RETRIES} in ${delay}ms`
            );

            await sleep(delay);
        }
    }

    throw lastError;
}

async function analyzeBatch(chunks, batchNumber) {
    const context = chunks
        .map(
            (chunk, index) =>
                `[Chunk ${index + 1}]\n${chunk.content}`
        )
        .join("\n\n");

    return withRetry(
        async () => {
            console.log(
                `→ Processing batch ${batchNumber}`
            );

            const response =
                await client.chat.completions.create({
                    model: MODEL,

                    messages: [
                        {
                            role: "system",
                            content: `
You are an expert study-material analyzer.

Analyze the provided study material.

Return ONLY valid JSON:

{
  "summary": "string",
  "key_concepts": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "important_points": [
    "string"
  ],
  "mcqs": [
   {
        "question": "string",
        "options": [
            "string",
            "string",
            "string",
            "string"
        ],
        "correct_answer": "string",
        "explanation": "string",
        "concept": "string"
    }
  ]
}

Do not add markdown.
Do not add text outside JSON.
                            `,
                        },
                        {
                            role: "user",
                            content: context,
                        },
                    ],

                    temperature: 0.2,
                    max_tokens: 3000,
                });

            const content =
                response.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error(
                    `Empty response from AI for batch ${batchNumber}`
                );
            }

            return JSON.parse(content);
        },
        `Batch ${batchNumber}`
    );
}

async function runWithConcurrency(tasks, concurrency) {
    const results = new Array(tasks.length);
    let nextIndex = 0;

    async function worker() {
        while (true) {
            const index = nextIndex++;

            if (index >= tasks.length) {
                return;
            }

            results[index] = await tasks[index]();
        }
    }

    const workers = Array.from(
        {
            length: Math.min(concurrency, tasks.length),
        },
        () => worker()
    );

    await Promise.all(workers);

    return results;
}

async function synthesizeResults(results) {
    const combined = results
        .map(
            (result, index) => `
[Batch ${index + 1}]

Summary:
${result.summary}

Key Concepts:
${JSON.stringify(result.key_concepts)}

Important Points:
${JSON.stringify(result.important_points)}

MCQs:
${JSON.stringify(result.mcqs)}
`
        )
        .join("\n");

    return withRetry(
        async () => {
            console.log("→ Running final synthesis...");

            const response =
                await client.chat.completions.create({
                    model: MODEL,

                    messages: [
                        {
                            role: "system",
                            content: `
You are an expert study-material editor.

Combine the provided batch analyses into one
coherent study guide.

Remove duplicates.
Preserve important information.
Do not invent facts.

Return ONLY valid JSON:

{
  "summary": "string",
  "key_concepts": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "important_points": [
    "string"
  ],
  "mcqs": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correct_answer": "string",
      "explanation": "string"
    }
  ]
}

Do not add markdown.
Do not add text outside JSON.
                            `,
                        },
                        {
                            role: "user",
                            content: combined,
                        },
                    ],

                    temperature: 0.2,
                    max_tokens: 5000,
                });

            const content =
                response.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error(
                    "Empty response during final synthesis"
                );
            }

            return JSON.parse(content);
        },
        "Final synthesis"
    );
}

async function generateStudyMaterial(chunks) {
    if (!Array.isArray(chunks) || chunks.length === 0) {
        throw new Error("No chunks provided");
    }

    const batches = createBatches(
        chunks,
        BATCH_SIZE
    );

    console.log(
        `📚 ${chunks.length} chunks → ${batches.length} batches`
    );

    const tasks = batches.map(
        (batch, index) => () =>
            analyzeBatch(batch, index + 1)
    );

    const results = await runWithConcurrency(
        tasks,
        CONCURRENCY
    );

    console.log(
        `✅ All ${results.length} batches completed`
    );

    return synthesizeResults(results);
}

module.exports = {
    generateStudyMaterial,
};