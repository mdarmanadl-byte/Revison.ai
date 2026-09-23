const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = "nvidia/nemotron-3-nano-30b-a3b";

async function analyzeTopic(chunks) {
    const context = chunks
        .map((chunk) => chunk.content)
        .join("\n\n");

    const response = await client.chat.completions.create({
        model: MODEL,
        messages: [
            {
                role: "system",
                content: `
You are a study material analyzer.

Analyze the provided chapter content.

Return ONLY valid JSON:

{
  "topic": {
    "name": "string",
    "description": "string"
  },
  "concepts": [
    {
      "name": "string",
      "description": "string",
      "importance": "HIGH | MEDIUM | LOW",
      "difficulty": "EASY | MEDIUM | HARD"
    }
  ]
}

Rules:
- Identify the main topic of the chapter.
- Extract the important concepts.
- Do not invent information.
- Return only JSON.
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
        throw new Error("Empty AI response");
    }

    return JSON.parse(content);
}

module.exports = {
    analyzeTopic,
};