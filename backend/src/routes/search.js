const express = require("express");
const { semanticSearch } = require("../documents/sementic-search.js");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { query, limit = 5 } = req.body;

        if (!query || typeof query !== "string") {
            return res.status(400).json({
                success: false,
                message: "Query is required",
            });
        } 

        const parsedLimit = Math.min(
            Math.max(Number(limit) || 5, 1),
            20
        );

        const results = await semanticSearch(
            query,
            parsedLimit
        );

        return res.json({
            success: true,
            query,
            count: results.length,
            results,
        });
    } catch (error) {
        console.error("Semantic search error:", error);

        return res.status(500).json({
            success: false,
            message: "Semantic search failed",
            error: error.message,
        });
    }
});

module.exports = router;