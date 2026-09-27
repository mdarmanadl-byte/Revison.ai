const express = require("express");
const prisma = require("../config/prisma.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

// ============================================
// CREATE SUBJECT
// POST /api/subjects/
// ============================================
router.post("/", async (req, res) => {
    try {
        const { name, description = "" } = req.body;

        if (!name || typeof name !== "string") {
            return res.status(400).json({
                success: false,
                message: "Subject name is required",
            });
        }

        const cleanName = name.trim();
        const cleanDescription =
            typeof description === "string"
                ? description.trim()
                : "";

        if (!cleanName) {
            return res.status(400).json({
                success: false,
                message: "Subject name cannot be empty",
            });
        }

        const subject = await prisma.subject.create({
            data: {
                name: cleanName,
                description: cleanDescription,
                user_id: req.user.id,
            },
        });

        return res.status(201).json({
            success: true,
            subject,
        });
    } catch (error) {
        console.error("Create subject error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create subject",
            error: error.message,
        });
    }
});


// ============================================
// GET ALL SUBJECTS
// GET /api/subjects/
// ============================================
router.get("/", async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({
            where: {
                user_id: req.user.id,
            },

            include: {
                documents: {
                    select: {
                        id: true,
                        title: true,
                        file_name: true,
                        status: true,
                        topicId: true,
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

        return res.json({
            success: true,
            count: subjects.length,
            subjects,
        });
    } catch (error) {
        console.error("Get subjects error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch subjects",
            error: error.message,
        });
    }
});


// ============================================
// GET SINGLE SUBJECT DASHBOARD
// GET /api/subjects/:id
// ============================================
router.get("/:id", async (req, res) => {
    try {
        const subjectId = Number(req.params.id);

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
                    orderBy: {
                        createdAt: "desc",
                    },

                    include: {
                        studyMaterial: true,
                    },
                },

                topic: {
                    orderBy: {
                        created_at: "desc",
                    },

                    include: {
                        concepts: true,

                        documents: {
                            select: {
                                id: true,
                                title: true,
                                status: true,
                            },
                        },
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

        return res.json({
            success: true,

            subject: {
                id: subject.id,
                name: subject.name,
                description: subject.description,
                documents: subject.documents,
                topics: subject.topic,
            },
        });
    } catch (error) {
        console.error("Get subject dashboard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch subject dashboard",
            error: error.message,
        });
    }
});


// ============================================
// DELETE SUBJECT
// DELETE /api/subjects/:id
// ============================================
router.delete("/:id", async (req, res) => {
    try {
        const subjectId = Number(req.params.id);

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
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        await prisma.subject.delete({
            where: {
                id: subjectId,
            },
        });

        return res.json({
            success: true,
            message: "Subject deleted successfully",
        });
    } catch (error) {
        console.error("Delete subject error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete subject",
            error: error.message,
        });
    }
});


module.exports = router;