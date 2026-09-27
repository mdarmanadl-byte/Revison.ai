const prisma = require("../config/prisma.js");

async function saveTopicAnalysis(documentId, subjectId, analysis) {
    if (!analysis?.topic) {
        throw new Error("Invalid topic analysis");
    }

    const topicName = analysis.topic.name?.trim();

    const topicDescription =
        analysis.topic.description?.trim() || "";

    if (!topicName) {
        throw new Error("Topic name is missing");
    }

    // Create topic
    const topic = await prisma.topic.create({
        data: {
            name: topicName,

            // IMPORTANT:
            // Your current Prisma schema uses "decription"
            // (typo), so we must use that exact field.
            decription: topicDescription,

            subject_id: subjectId,

            documents: {
                connect: {
                    id: documentId,
                },
            },
        },
    });

    // Save concepts
    if (
        Array.isArray(analysis.concepts) &&
        analysis.concepts.length > 0
    ) {
        await prisma.concepts.createMany({
            data: analysis.concepts.map((concept) => ({
                topic_id: topic.id,
                name: concept.name.trim(),
                description:
                    concept.description?.trim() || "",
                importance: concept.importance || "MEDIUM",
                difficulty: concept.difficulty || "MEDIUM",
            })),
        });
    }

    return topic;
}

module.exports = {
    saveTopicAnalysis,
};