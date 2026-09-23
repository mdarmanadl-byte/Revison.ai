const express = require("express");

const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const {
    generatePersonalizedQuiz,
} = require("../ai/personalized-quiz.js");

const router = express.Router();

router.use(auth);


// GENERATE PERSONALIZED QUIZ
router.post("/", async (req, res) => {
    try {
        const {
            subjectId,
            numberOfQuestions = 10,
        } = req.body;

        const parsedSubjectId =
            subjectId !== undefined &&
            subjectId !== null &&
            subjectId !== ""
                ? Number(subjectId)
                : null;

        const questionCount = Math.min(
            Math.max(
                Number(numberOfQuestions) || 10,
                5
            ),
            20
        );

        if (
            parsedSubjectId !== null &&
            !Number.isInteger(parsedSubjectId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid subjectId",
            });
        }

        // Make sure subject belongs to user
        if (parsedSubjectId !== null) {
            const subject =
                await prisma.subject.findFirst({
                    where: {
                        id: parsedSubjectId,
                        user_id: req.user.id,
                    },
                });

            if (!subject) {
                return res.status(404).json({
                    success: false,
                    message: "Subject not found",
                });
            }
        }

        const result =
            await generatePersonalizedQuiz(
                req.user.id,
                parsedSubjectId,
                questionCount
            );

        // Save generated quiz
        const savedQuiz =
            await prisma.personalizedQuiz.create({
                data: {
                    user_id: req.user.id,
                    subject_id: parsedSubjectId,
                    questions: result.quiz.questions,
                },
            });

        return res.status(201).json({
            success: true,

            quiz: {
                id: savedQuiz.id,
                subject_id: savedQuiz.subject_id,
                questions: savedQuiz.questions,
            },

            weak_concepts:
                result.weak_concepts,
        });
    } catch (error) {
        console.error(
            "Personalized quiz error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to generate personalized quiz",
            error: error.message,
        });
    }
});


// SUBMIT PERSONALIZED QUIZ
router.post(
    "/:quizId/submit",
    async (req, res) => {
        try {
            const quizId = Number(
                req.params.quizId
            );

            const { answers } = req.body;

            if (!Number.isInteger(quizId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quiz ID",
                });
            }

            if (!Array.isArray(answers)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Answers must be an array",
                });
            }

            const quiz =
                await prisma.personalizedQuiz.findFirst({
                    where: {
                        id: quizId,
                        user_id: req.user.id,
                    },
                });

            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    message: "Quiz not found",
                });
            }

            const questions = quiz.questions;

            if (
                !Array.isArray(questions) ||
                questions.length === 0
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Quiz has no questions",
                });
            }

            let score = 0;

            const results = [];

            for (
                let index = 0;
                index < questions.length;
                index++
            ) {
                const question =
                    questions[index];

                const userAnswer =
                    answers[index] ?? null;

                const correct =
    userAnswer ===
    question.correct_answer;

if (correct) {
    score++;
}

if (question.concept) {
    const concept =
        await prisma.concepts.findFirst({
            where: {
                name: question.concept,

                ...(quiz.subject_id
                    ? {
                          Topic: {
                              subject_id:
                                  quiz.subject_id,
                          },
                      }
                    : {}),
            },
        });

    if (concept) {
        await prisma.conceptAttempt.create({
            data: {
                user_id: req.user.id,
                concept_id: concept.id,
                document_id: null,
                correct,
            },
        });
    }
}

                results.push({
                    question:
                        question.question,

                    user_answer:
                        userAnswer,

                    correct_answer:
                        question.correct_answer,

                    correct,

                    explanation:
                        question.explanation,

                    concept:
                        question.concept || null,
                });
            }

            const attempt =
                await prisma
                    .personalizedQuizAttempt
                    .create({
                        data: {
                            quiz_id: quizId,
                            user_id: req.user.id,
                            score,
                            total_questions:
                                questions.length,
                            answers: results,
                        },
                    });

            // Also update concept performance
          // Update concept performance
for (
    let index = 0;
    index < questions.length;
    index++
) {
    const question = questions[index];

    if (!question.concept) {
        continue;
    }

    const concept =
        await prisma.concepts.findFirst({
            where: {
                name: question.concept,

                ...(quiz.subject_id
                    ? {
                          Topic: {
                              subject_id:
                                  quiz.subject_id,
                          },
                      }
                    : {}),
            },
        });

    if (!concept) {
        continue;
    }

    await prisma.conceptAttempt.create({
        data: {
            user_id: req.user.id,
            concept_id: concept.id,

            // Personalized quiz can cover
            // multiple documents.
            document_id: null,

            correct,
        },
    });
}

            const percentage = Math.round(
                (score / questions.length) * 100
            );

            return res.status(201).json({
                success: true,

                result: {
                    attempt_id: attempt.id,
                    quiz_id: quizId,
                    score,
                    total_questions:
                        questions.length,
                    percentage,
                    answers: results,
                },
            });
        } catch (error) {
            console.error(
                "Personalized quiz submission error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to submit personalized quiz",
                error: error.message,
            });
        }
    }
);


// GET PERSONALIZED QUIZ HISTORY
router.get(
    "/history",
    async (req, res) => {
        try {
            const attempts =
                await prisma
                    .personalizedQuizAttempt
                    .findMany({
                        where: {
                            user_id: req.user.id,
                        },

                        orderBy: {
                            created_at: "desc",
                        },

                        select: {
                            id: true,
                            quiz_id: true,
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
                "Personalized history error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch quiz history",
                error: error.message,
            });
        }
    }
);


module.exports = router;