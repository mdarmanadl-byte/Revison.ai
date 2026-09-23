const prisma = require("../config/prisma.js");

async function saveTopicAnalysis(
    documentId,
    subjectId,
    analysis
) {
    const topic = await prisma.topic.create({
        data: {
            name: analysis.topic.name,
            description: analysis.topic.description,
            subject_id: subjectId,

            documents: {
                connect: {
                    id: documentId,
                },
            },
        },
    });

    if (analysis.concepts?.length) {
        await prisma.concepts.createMany({
            data: analysis.concepts.map((concept) => ({
                topic_id: topic.id,
                name: concept.name,
                description: concept.description,
                importance: concept.importance,
                difficulty: concept.difficulty,
            })),
        });
    }

    return prisma.topic.findUnique({
        where: {
            id: topic.id,
        },
        include: {
            concepts: true,
        },
    });
}

module.exports = {
    saveTopicAnalysis,
};