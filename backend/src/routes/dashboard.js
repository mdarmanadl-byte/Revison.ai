const express = require("express");
const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);


// MAIN DASHBOARD
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;

        const subjects =
            await prisma.subject.findMany({
                where: {
                    user_id: userId,
                },

                include: {
                    documents: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            topic_id: true,
                            createdAt: true,
                        },
                    },

                    topic: {
                        include: {
                            concepts: true,
                        },
                    },
                },

                orderBy: {
                    created_at: "desc",
                },
            });

        const attempts =
            await prisma.quizAttempt.findMany({
                where: {
                    user_id: userId,
                },

                select: {
                    document_id: true,
                    score: true,
                    total_questions: true,
                    created_at: true,
                },
            });

        const conceptAttempts =
            await prisma.conceptAttempt.findMany({
                where: {
                    user_id: userId,
                },

                include: {
                    Concept: {
                        include: {
                            Topic: true,
                        },
                    },
                },
            });


        // -------------------------
        // OVERALL PROGRESS
        // -------------------------

        const totalQuestions =
            attempts.reduce(
                (sum, attempt) =>
                    sum + attempt.total_questions,
                0
            );

        const totalCorrect =
            attempts.reduce(
                (sum, attempt) =>
                    sum + attempt.score,
                0
            );

        const overallPercentage =
            totalQuestions > 0
                ? Math.round(
                      (totalCorrect /
                          totalQuestions) *
                          100
                  )
                : 0;


        // -------------------------
        // WEAK CONCEPTS
        // -------------------------

        const conceptMap = new Map();

        for (const attempt of conceptAttempts) {
            const conceptId =
                attempt.concept_id;

            if (!conceptMap.has(conceptId)) {
                conceptMap.set(conceptId, {
                    concept_id: conceptId,

                    concept_name:
                        attempt.Concept.name,

                    topic:
                        attempt.Concept.Topic.name,

                    total: 0,

                    correct: 0,
                });
            }

            const item =
                conceptMap.get(conceptId);

            item.total++;

            if (attempt.correct) {
                item.correct++;
            }
        }

        const weakConcepts =
            Array.from(
                conceptMap.values()
            )
                .map((item) => ({
                    ...item,

                    accuracy:
                        Math.round(
                            (item.correct /
                                item.total) *
                                100
                        ),
                }))

                .filter(
                    (item) =>
                        item.accuracy < 70
                )

                .sort(
                    (a, b) =>
                        a.accuracy -
                        b.accuracy
                )

                .slice(0, 10);


        // -------------------------
        // SUBJECT PROGRESS
        // -------------------------

        const subjectData =
            subjects.map((subject) => {
                const documentIds =
                    subject.documents.map(
                        (document) =>
                            document.id
                    );

                const subjectAttempts =
                    attempts.filter(
                        (attempt) =>
                            documentIds.includes(
                                attempt.document_id
                            )
                    );

                const questions =
                    subjectAttempts.reduce(
                        (sum, attempt) =>
                            sum +
                            attempt.total_questions,
                        0
                    );

                const correct =
                    subjectAttempts.reduce(
                        (sum, attempt) =>
                            sum +
                            attempt.score,
                        0
                    );

                const percentage =
                    questions > 0
                        ? Math.round(
                              (correct /
                                  questions) *
                                  100
                          )
                        : 0;

                return {
                    id: subject.id,

                    name: subject.name,

                    description:
                        subject.description,

                    documents:
                        subject.documents,

                    topics: subject.topic,

                    progress: {
                        attempts:
                            subjectAttempts.length,

                        questions,

                        correct,

                        percentage,
                    },
                };
            });


        // -------------------------
        // RECENT QUIZ ATTEMPTS
        // -------------------------

        const recentAttempts =
            await prisma.quizAttempt.findMany({
                where: {
                    user_id: userId,
                },

                orderBy: {
                    created_at: "desc",
                },

                take: 10,

                include: {
                    Document: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            });


        return res.json({
            success: true,

            dashboard: {
                overview: {
                    total_subjects:
                        subjects.length,

                    total_documents:
                        subjects.reduce(
                            (sum, subject) =>
                                sum +
                                subject.documents
                                    .length,
                            0
                        ),

                    total_quiz_attempts:
                        attempts.length,

                    total_questions:
                        totalQuestions,

                    total_correct:
                        totalCorrect,

                    overall_percentage:
                        overallPercentage,
                },

                subjects: subjectData,

                weak_concepts:
                    weakConcepts,

                recent_attempts:
                    recentAttempts,
            },
        });
    } catch (error) {
        console.error(
            "Dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load dashboard",
            error: error.message,
        });
    }
});


module.exports = router;