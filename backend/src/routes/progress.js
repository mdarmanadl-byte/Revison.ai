const express = require("express");
const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);


// SUBJECT PROGRESS
router.get("/subject/:subjectId", async (req, res) => {
    try {
        const subjectId = Number(req.params.subjectId);

        if (!Number.isInteger(subjectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID",
            });
        }

        const subject = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                user_id: req.user.id,
            },

            include: {
                documents: {
                    select: {
                        id: true,
                        title: true,
                    },
                },

                topic: {
                    include: {
                        concepts: true,
                    },
                },
            },
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        const documentIds = subject.documents.map(
            (document) => document.id
        );

        const attempts =
            documentIds.length > 0
                ? await prisma.quizAttempt.findMany({
                      where: {
                          user_id: req.user.id,
                          document_id: {
                              in: documentIds,
                          },
                      },

                      select: {
                          document_id: true,
                          score: true,
                          total_questions: true,
                          created_at: true,
                      },
                  })
                : [];

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

        const documentProgress =
            subject.documents.map((document) => {
                const documentAttempts =
                    attempts.filter(
                        (attempt) =>
                            attempt.document_id ===
                            document.id
                    );

                const questions =
                    documentAttempts.reduce(
                        (sum, attempt) =>
                            sum +
                            attempt.total_questions,
                        0
                    );

                const correct =
                    documentAttempts.reduce(
                        (sum, attempt) =>
                            sum + attempt.score,
                        0
                    );

                const score =
                    questions > 0
                        ? Math.round(
                              (correct / questions) *
                                  100
                          )
                        : 0;

                return {
                    document_id: document.id,
                    title: document.title,
                    attempts:
                        documentAttempts.length,
                    score,
                };
            });

        return res.json({
            success: true,

            subject: {
                id: subject.id,
                name: subject.name,
            },

            progress: {
                total_documents:
                    subject.documents.length,
                total_attempts: attempts.length,
                total_questions: totalQuestions,
                total_correct: totalCorrect,
                percentage,
            },

            documents: documentProgress,
        });
    } catch (error) {
        console.error("Subject progress error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to calculate progress",
            error: error.message,
        });
    }
});


// ALL SUBJECTS PROGRESS
router.get("/subjects", async (req, res) => {
    try {
        const subjects =
            await prisma.subject.findMany({
                where: {
                    user_id: req.user.id,
                },

                include: {
                    documents: {
                        select: {
                            id: true,
                        },
                    },
                },
            });

        const result = [];

        for (const subject of subjects) {
            const documentIds =
                subject.documents.map(
                    (document) => document.id
                );

            const attempts =
                documentIds.length > 0
                    ? await prisma.quizAttempt.findMany({
                          where: {
                              user_id: req.user.id,
                              document_id: {
                                  in: documentIds,
                              },
                          },

                          select: {
                              score: true,
                              total_questions: true,
                          },
                      })
                    : [];

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

            const percentage =
                totalQuestions > 0
                    ? Math.round(
                          (totalCorrect /
                              totalQuestions) *
                              100
                      )
                    : 0;

            result.push({
                subject_id: subject.id,
                subject_name: subject.name,

                total_documents:
                    subject.documents.length,

                total_attempts:
                    attempts.length,

                percentage,
            });
        }

        return res.json({
            success: true,
            subjects: result,
        });
    } catch (error) {
        console.error(
            "Subjects progress error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch subjects progress",
            error: error.message,
        });
    }
});

module.exports = router;