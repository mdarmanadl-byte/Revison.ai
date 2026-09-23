const express = require("express");
const prisma = require("../config/prisma.js");

const router = express.Router();


// GET REVISION MATERIAL FOR A DOCUMENT
router.get("/document/:documentId", async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);

        if (!Number.isInteger(documentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID",
            });
        }

        const document = await prisma.documents.findFirst({
            where: {
                id: documentId,
                user_id: 1,
            },

            include: {
                studyMaterial: true,

                Subject: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

                Topic: {
                    include: {
                        concepts: true,
                    },
                },
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
                message: "Study material has not been generated yet",
            });
        }

        res.json({
            success: true,

            document: {
                id: document.id,
                title: document.title,
            },

            subject: document.Subject,

            topic: document.Topic,

            revision: {
                id: document.studyMaterial.id,
                summary: document.studyMaterial.summary,
                key_concepts:
                    document.studyMaterial.key_concepts,
                important_points:
                    document.studyMaterial.important_points,
                mcqs: document.studyMaterial.mcqs,
            },
        });
    } catch (error) {
        console.error("Revision error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch revision material",
            error: error.message,
        });
    }
});


// GET ONLY MCQS
router.get("/document/:documentId/mcqs", async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);

        if (!Number.isInteger(documentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID",
            });
        }

        const material =
            await prisma.studyMaterial.findFirst({
                where: {
                    document_id: documentId,

                    document: {
                        user_id: 1,
                    },
                },
            });

        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Study material not found",
            });
        }

        res.json({
            success: true,
            document_id: documentId,
            mcqs: material.mcqs,
        });
    } catch (error) {
        console.error("MCQ error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch MCQs",
            error: error.message,
        });
    }
});


// GET SUMMARY
router.get("/document/:documentId/summary", async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);

        if (!Number.isInteger(documentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID",
            });
        }

        const material =
            await prisma.studyMaterial.findFirst({
                where: {
                    document_id: documentId,

                    document: {
                        user_id: 1,
                    },
                },
            });

        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Study material not found",
            });
        }

        res.json({
            success: true,
            document_id: documentId,
            summary: material.summary,
            important_points:
                material.important_points,
        });
    } catch (error) {
        console.error("Summary error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch summary",
            error: error.message,
        });
    }
});


module.exports = router;