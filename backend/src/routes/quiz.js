const express = require("express");
const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);


// SUBMIT QUIZ
router.post("/submit/:documentId", async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);
        const { answers } = req.body;

        if (!Number.isInteger(documentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID",
            });
        }

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Answers must be an array",
            });
        }

        const document =
            await prisma.documents.findFirst({
                where: {
                    id: documentId,
                    user_id: req.user.id,
                },

                include: {
                    studyMaterial: true,
                },
            });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found",
            });
        }

        if (!document.studyMaterial) {
            return res.status(404).json({
                success: false,
                message: "Quiz is not available",
            });
        }

        const mcqs = document.studyMaterial.mcqs;

        if (!Array.isArray(mcqs) || mcqs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No MCQs found",
            });
        }

        let score = 0;

        const result = [];

        for (let index = 0; index < mcqs.length; index++) {
            const mcq = mcqs[index];

            const userAnswer =
                answers[index] ?? null;

            const correct =
                userAnswer === mcq.correct_answer;

            if (correct) {
                score++;
            }

            // Find concept generated for this MCQ
            let concept = null;

            if (mcq.concept) {
                concept =
                    await prisma.concepts.findFirst({
                        where: {
                            name: mcq.concept,

                            Topic: {
                                subject_id:
                                    document.subject_id,
                            },
                        },
                    });
            }

            // Save concept performance
            if (concept) {
                await prisma.conceptAttempt.create({
                    data: {
                        user_id: req.user.id,
                        concept_id: concept.id,
                        document_id: documentId,
                        correct,
                    },
                });
            }

            result.push({
                question: mcq.question,
                user_answer: userAnswer,
                correct_answer:
                    mcq.correct_answer,
                correct,
                explanation:
                    mcq.explanation,
                concept: mcq.concept || null,
            });
        }

        const attempt =
            await prisma.quizAttempt.create({
                data: {
                    user_id: req.user.id,
                    document_id: documentId,
                    score,
                    total_questions: mcqs.length,
                    answers: result,
                },
            });

        const percentage = Math.round(
            (score / mcqs.length) * 100
        );

        return res.status(201).json({
            success: true,

            result: {
                attempt_id: attempt.id,
                score,
                total_questions: mcqs.length,
                percentage,
                answers: result,
            },
        });
    } catch (error) {
        console.error(
            "Quiz submission error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to submit quiz",
            error: error.message,
        });
    }
});


// QUIZ HISTORY
router.get("/history/:documentId", async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);

        if (!Number.isInteger(documentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID",
            });
        }

        const attempts =
            await prisma.quizAttempt.findMany({
                where: {
                    document_id: documentId,
                    user_id: req.user.id,
                },

                orderBy: {
                    created_at: "desc",
                },

                select: {
                    id: true,
                    score: true,
                    total_questions: true,
                    created_at: true,
                },
            });

        return res.json({
            success: true,
            attempts,
        });
    } catch (error) {
        console.error(
            "Quiz history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch quiz history",
            error: error.message,
        });
    }
});


// OVERALL PROGRESS
router.get("/progress", async (req, res) => {
    try {
        const attempts =
            await prisma.quizAttempt.findMany({
                where: {
                    user_id: req.user.id,
                },

                select: {
                    score: true,
                    total_questions: true,
                },
            });

        const totalAttempts = attempts.length;

        const totalQuestions = attempts.reduce(
            (sum, attempt) =>
                sum + attempt.total_questions,
            0
        );

        const totalCorrect = attempts.reduce(
            (sum, attempt) =>
                sum + attempt.score,
            0
        );

        const percentage =
            totalQuestions > 0
                ? Math.round(
                      (totalCorrect /
                          totalQuestions) *
                          100
                  )
                : 0;

        return res.json({
            success: true,

            progress: {
                total_attempts: totalAttempts,
                total_questions: totalQuestions,
                total_correct: totalCorrect,
                overall_percentage: percentage,
            },
        });
    } catch (error) {
        console.error(
            "Progress error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch progress",
            error: error.message,
        });
    }
});


module.exports = router;