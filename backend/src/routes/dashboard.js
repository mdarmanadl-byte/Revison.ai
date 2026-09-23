const express = require("express");
const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    // --------------------------------------------------
    // 1. Get user's subjects
    // --------------------------------------------------

    const subjects = await prisma.subject.findMany({
      where: {
        user_id: userId,
      },

      include: {
        documents: {
          select: {
            id: true,
            title: true,
            status: true,
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

    // --------------------------------------------------
    // 2. Get quiz attempts
    // --------------------------------------------------

    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        user_id: userId,
      },

      include: {
        Document: {
          select: {
            id: true,
            title: true,
            subject_id: true,
          },
        },
      },

      orderBy: {
        created_at: "desc",
      },
    });

    // --------------------------------------------------
    // 3. Get concept attempts
    // --------------------------------------------------

    const conceptAttempts = await prisma.conceptAttempt.findMany({
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

      orderBy: {
        created_at: "desc",
      },
    });

    // --------------------------------------------------
    // 4. Basic overview
    // --------------------------------------------------

    const totalSubjects = subjects.length;

    const totalDocuments = subjects.reduce(
      (total, subject) => total + subject.documents.length,
      0
    );

    const totalQuizAttempts = quizAttempts.length;

    const totalQuestions = quizAttempts.reduce(
      (total, attempt) => total + attempt.total_questions,
      0
    );

    const totalCorrect = quizAttempts.reduce(
      (total, attempt) => total + attempt.score,
      0
    );

    const overallPercentage =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

    // --------------------------------------------------
    // 5. Subject progress
    // --------------------------------------------------

    const subjectProgress = subjects.map((subject) => {
      const subjectDocumentIds = subject.documents.map(
        (document) => document.id
      );

      const attempts = quizAttempts.filter((attempt) =>
        subjectDocumentIds.includes(attempt.document_id)
      );

      const questions = attempts.reduce(
        (total, attempt) => total + attempt.total_questions,
        0
      );

      const correct = attempts.reduce(
        (total, attempt) => total + attempt.score,
        0
      );

      const percentage =
        questions > 0
          ? Math.round((correct / questions) * 100)
          : 0;

      return {
        id: subject.id,
        name: subject.name,
        description: subject.description,
        documents: subject.documents,
        topics: subject.topic,
        document_count: subject.documents.length,
        topic_count: subject.topic.length,
        progress: percentage,
      };
    });

    // --------------------------------------------------
    // 6. Weak concepts
    // --------------------------------------------------

    const conceptMap = new Map();

    for (const attempt of conceptAttempts) {
      const concept = attempt.Concept;

      if (!concept) continue;

      if (!conceptMap.has(concept.id)) {
        conceptMap.set(concept.id, {
          id: concept.id,
          name: concept.name,
          description: concept.description,
          difficulty: concept.difficulty,
          importance: concept.importance,
          topic: concept.Topic?.name || null,
          total: 0,
          correct: 0,
        });
      }

      const item = conceptMap.get(concept.id);

      item.total += 1;

      if (attempt.correct) {
        item.correct += 1;
      }
    }

    const weakConcepts = Array.from(conceptMap.values())
      .map((concept) => ({
        ...concept,
        accuracy:
          concept.total > 0
            ? Math.round(
                (concept.correct / concept.total) * 100
              )
            : 0,
      }))
      .filter((concept) => concept.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    // --------------------------------------------------
    // 7. Recent quiz attempts
    // --------------------------------------------------

    const recentAttempts = quizAttempts
      .slice(0, 10)
      .map((attempt) => ({
        id: attempt.id,
        document_id: attempt.document_id,
        document_title: attempt.Document?.title || "Unknown",
        subject_id: attempt.Document?.subject_id || null,
        score: attempt.score,
        total_questions: attempt.total_questions,
        percentage:
          attempt.total_questions > 0
            ? Math.round(
                (attempt.score / attempt.total_questions) * 100
              )
            : 0,
        created_at: attempt.created_at,
      }));

    // --------------------------------------------------
    // 8. Response
    // --------------------------------------------------

    return res.json({
      success: true,

      overview: {
        subjects: totalSubjects,
        documents: totalDocuments,
        quiz_attempts: totalQuizAttempts,
        questions_answered: totalQuestions,
        correct_answers: totalCorrect,
        overall_percentage: overallPercentage,
      },

      subjects: subjectProgress,

      weak_concepts: weakConcepts,

      recent_attempts: recentAttempts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
});

module.exports = router;