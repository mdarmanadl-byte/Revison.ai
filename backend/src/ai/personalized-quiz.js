const OpenAI = require("openai");

const prisma = require("../config/prisma.js");

const client = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

const MODEL = process.env.LLM_MODEL;

async function generatePersonalizedQuiz(
    userId,
    subjectId = null,
    numberOfQuestions = 10
) {
    // Get concept attempts
    const attempts =
        await prisma.conceptAttempt.findMany({
            where: {
                user_id: userId,

                ...(subjectId
                    ? {
                          Concept: {
                              Topic: {
                                  subject_id: subjectId,
                              },
                          },
                      }
                    : {}),
            },

            include: {
                Concept: {
                    include: {
                        Topic: true,
                    },
                },
            },
        });

    if (!attempts.length) {
        throw new Error(
            "No quiz history available yet"
        );
    }

    // Calculate concept accuracy
    const conceptMap = new Map();

    for (const attempt of attempts) {
        const conceptId = attempt.concept_id;

        if (!conceptMap.has(conceptId)) {
            conceptMap.set(conceptId, {
                concept_id: conceptId,
                name: attempt.Concept.name,
                description:
                    attempt.Concept.description,
                topic: attempt.Concept.Topic.name,
                total: 0,
                correct: 0,
            });
        }

        const concept =
            conceptMap.get(conceptId);

        concept.total++;

        if (attempt.correct) {
            concept.correct++;
        }
    }

    // Select weakest concepts
    const weakConcepts = Array.from(
        conceptMap.values()
    )
        .map((concept) => ({
            ...concept,
            accuracy: Math.round(
                (concept.correct /
                    concept.total) *
                    100
            ),
        }))
        .filter(
            (concept) => concept.accuracy < 70
        )
        .sort(
            (a, b) =>
                a.accuracy - b.accuracy
        );

    if (!weakConcepts.length) {
        throw new Error(
            "No weak concepts found"
        );
    }

    // Get documents belonging to weak topics
    const topicIds = weakConcepts.map(
        (concept) => concept.topic
    );

    const documents =
        await prisma.documents.findMany({
            where: {
                user_id: userId,

                ...(subjectId
                    ? {
                          subject_id: subjectId,
                      }
                    : {}),
            },

            include: {
                documentchunk: true,
            },
        });

    const context = documents
        .flatMap((document) =>
            document.documentchunk.map(
                (chunk) => chunk.content
            )
        )
        .join("\n\n")
        .slice(0, 30000);

    const weakConceptContext = weakConcepts
        .map(
            (concept) =>
                `Concept: ${concept.name}
Topic: ${concept.topic}
Description: ${concept.description}
Accuracy: ${concept.accuracy}%`
        )
        .join("\n\n");

    const response =
        await client.chat.completions.create({
            model: MODEL,

            messages: [
                {
                    role: "system",
                    content: `
You are an adaptive study assistant.

Generate a personalized revision quiz
for the student's weak concepts.

Use ONLY the provided study material.

Return ONLY valid JSON:

{
  "questions": [
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

Rules:

- Generate exactly ${numberOfQuestions} questions.
- Focus primarily on the weak concepts.
- Do not invent information.
- "concept" must exactly match one of the provided weak concept names.
- Questions should test understanding, not just memorization.
- Return only JSON.
                    `,
                },

                {
                    role: "user",
                    content: `
WEAK CONCEPTS:

${weakConceptContext}

STUDY MATERIAL:

${context}
                    `,
                },
            ],

            temperature: 0.3,
            max_tokens: 5000,
        });

    const content =
        response.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error(
            "Empty response from AI"
        );
    }

    return {
        weak_concepts: weakConcepts,
        quiz: JSON.parse(content),
    };
}

module.exports = {
    generatePersonalizedQuiz,
};