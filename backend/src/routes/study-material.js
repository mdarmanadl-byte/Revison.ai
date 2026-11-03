const express = require("express");
const prisma = require("../config/prisma.js");
const {
    generateStudyMaterial,
} = require("../documents/study-material.js");

const router = express.Router();

router.post("/:documentId", async (req, res) => {
    try {
        const documentId = Number(req.params.documentId);

        if (!Number.isInteger(documentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid document ID",
            });
        }

        // ------------------------------------------------
        // 1. Check whether material already exists
        // ------------------------------------------------

        const existingMaterial =
            await prisma.studyMaterial.findUnique({
                where: {
                    document_id: documentId,
                },
            });

        if (existingMaterial) {
            console.log(
                `Study material already exists for document ${documentId}`
            );

            return res.json({
                success: true,
                cached: true,
                material: existingMaterial,
            });
        }

        // ------------------------------------------------
        // 2. Get document chunks
        // ------------------------------------------------

        const chunks =
            await prisma.documentChunk.findMany({
                where: {
                    document_id: documentId,
                },
                orderBy: {
                    chunk_index: "asc",
                },
            });

        if (!chunks.length) {
            return res.status(404).json({
                success: false,
                message: "No chunks found for this document",
            });
        }

        // ------------------------------------------------
        // 3. Generate using AI
        // ------------------------------------------------

        console.log(
            `Generating study material for document ${documentId}`
        );

        const material =
            await generateStudyMaterial(chunks);

        // ------------------------------------------------
        // 4. Save result
        // ------------------------------------------------

        let savedMaterial;

try {
    savedMaterial = await prisma.studyMaterial.create({
        data: {
            document_id: documentId,
            summary: material.summary,
            key_concepts: material.key_concepts,
            important_points: material.important_points,
            mcqs: material.mcqs,
        },
    });
} catch (error) {
    // Another request may have saved this document's material.
    if (error.code === "P2002") {
        savedMaterial = await prisma.studyMaterial.findUnique({
            where: { document_id: documentId },
        });

        if (savedMaterial) {
            return res.json({
                success: true,
                cached: true,
                material: savedMaterial,
            });
        }
    }

    throw error;
}



        // ------------------------------------------------
        // 5. Return result
        // ------------------------------------------------

        return res.json({
            success: true,
            cached: false,
            material: savedMaterial,
        });
    } catch (error) {
        console.error(
            "Study material error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to generate study material",
            error: error.message,
        });
    }
});

module.exports = router;