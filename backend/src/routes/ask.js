const express = require("express");
const auth = require("../middleware/auth.js");
const { answerQuestion } = require("../ai/rag.js");

const router = express.Router();

router.use(auth);

router.post("/", async (req, res) => {
    try {
        const {
            question,
            subjectId,
            documentId,
        } = req.body;

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        const parsedSubjectId =
            subjectId !== undefined &&
            subjectId !== null &&
            subjectId !== ""
                ? Number(subjectId)
                : null;

        const parsedDocumentId =
            documentId !== undefined &&
            documentId !== null &&
            documentId !== ""
                ? Number(documentId)
                : null;

        if (
            parsedSubjectId !== null &&
            !Number.isInteger(parsedSubjectId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid subjectId",
            });
        }

        if (
            parsedDocumentId !== null &&
            !Number.isInteger(parsedDocumentId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid documentId",
            });
        }

        const result = await answerQuestion({
            question,
            userId: req.user.id,
            subjectId: parsedSubjectId,
            documentId: parsedDocumentId,
        });

        return res.json({
            success: true,
            question,
            subjectId: parsedSubjectId,
            documentId: parsedDocumentId,
            ...result,
        });
    } catch (error) {
        console.error("RAG error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to answer question",
            error: error.message,
        });
    }
});

module.exports = router;