const express = require("express");
const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
    try {
        const attempts =
            await prisma.conceptAttempt.findMany({
                where: {
                    user_id: req.user.id,
                },

                include: {
                    Concept: {
                        include: {
                            Topic: true,
                        },
                    },
                },
            });

        const map = new Map();

        for (const attempt of attempts) {
            const conceptId = attempt.concept_id;

            if (!map.has(conceptId)) {
                map.set(conceptId, {
                    concept_id: conceptId,
                    concept_name:
                        attempt.Concept.name,
                    topic:
                        attempt.Concept.Topic.name,
                    total: 0,
                    wrong: 0,
                });
            }

            const item = map.get(conceptId);

            item.total++;

            if (!attempt.correct) {
                item.wrong++;
            }
        }

        const weakTopics = Array.from(
            map.values()
        )
            .map((item) => ({
                ...item,
                accuracy: Math.round(
                    ((item.total - item.wrong) /
                        item.total) *
                        100
                ),
            }))
            .filter(
                (item) => item.accuracy < 70
            )
            .sort(
                (a, b) =>
                    a.accuracy - b.accuracy
            );

        res.json({
            success: true,
            weak_topics: weakTopics,
        });
    } catch (error) {
        console.error(
            "Weak topics error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to calculate weak topics",
            error: error.message,
        });
    }
});

module.exports = router;