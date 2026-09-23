const express = require("express");
const { answerQuestion } = require("../documents/rag.js");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                success: false,
                message: "Question is required",
            });
        }

        const result = await answerQuestion(question);

        res.json({
            success: true,
            question,
            ...result,
        });
    } catch (error) {
        console.error("RAG error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to answer question",
            error: error.message,
        });
    }
});

module.exports = router;