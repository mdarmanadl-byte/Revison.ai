const express = require("express");
const { semanticSearch } = require("./sementic-search.js");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { query, limit } = req.body;

        if (!query || typeof query !== "string") {
            return res.status(400).json({
                message: "Query is required",
            });
        }

        const results = await semanticSearch(
            query,
            limit || 5
        );

        res.json({
            query,
            results,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Search failed",
        });
    }
});

module.exports = router;