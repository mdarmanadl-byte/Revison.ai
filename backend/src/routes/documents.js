const express = require("express");
const prisma = require("../config/prisma.js");
const upload = require("../documents/upload.js");
const { processDocument } = require("../documents/process-document.js");
const { analyzeTopic } = require("../ai/topic-analyzer.js");
const { saveTopicAnalysis } = require("../ai/save-topic.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.use(auth);

router.post("/", upload.single("file"), async (req, res) => {
    try {
        // -----------------------------------------
        // 1. Check uploaded file
        // -----------------------------------------
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required",
            });
        }

        // -----------------------------------------
        // 2. Get subject ID from multipart form
        // -----------------------------------------
        // Frontend sends: subject_id
        const subjectId = Number(req.body.subject_id);

        if (!Number.isInteger(subjectId) || subjectId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid subject ID is required",
            });
        }

        // -----------------------------------------
        // 3. Get authenticated user
        // -----------------------------------------
        const userId = req.user.id;

        // -----------------------------------------
        // 4. Make sure subject belongs to user
        // -----------------------------------------
        const subject = await prisma.subject.findFirst({
            where: {
                id: subjectId,
                user_id: userId,
            },
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
            });
        }

        // -----------------------------------------
        // 5. Create document
        // -----------------------------------------
        const document = await prisma.documents.create({
            data: {
                title: req.file.originalname,
                file_name: req.file.filename,
                file_type: req.file.mimetype,
                file_url: req.file.path,
                status: "UPLOADED",

                user_id: userId,
                subject_id: subjectId,
            },
        });

        // -----------------------------------------
        // 6. Extract PDF → chunks → embeddings
        // -----------------------------------------
        const processed = await processDocument(document);

        // -----------------------------------------
        // 7. Get generated document chunks
        // -----------------------------------------
        const chunks = await prisma.documentChunk.findMany({
            where: {
                document_id: document.id,
            },
            orderBy: {
                chunk_index: "asc",
            },
        });

        if (!chunks.length) {
            throw new Error("No chunks were generated from the document");
        }

        // -----------------------------------------
        // 8. AI analyzes topic + concepts
        // -----------------------------------------
        const analysis = await analyzeTopic(chunks);

        // -----------------------------------------
        // 9. Save topic + concepts
        // -----------------------------------------
        const topic = await saveTopicAnalysis(
            document.id,
            subjectId,
            analysis
        );

        // -----------------------------------------
        // 10. Mark document as processed
        // -----------------------------------------
        const updatedDocument = await prisma.documents.update({
            where: {
                id: document.id,
            },
            data: {
                status: "PROCESSED",
            },
        });

        // -----------------------------------------
        // 11. Return response
        // -----------------------------------------
        return res.status(201).json({
            success: true,
            message: "Document uploaded and processed successfully",

            document: updatedDocument,

            subject: {
                id: subject.id,
                name: subject.name,
            },

            topic: topic || null,

            processing: {
                pages: processed?.pages ?? null,
                chunks: processed?.chunks ?? chunks.length,
                status: processed?.status ?? "PROCESSED",
            },
        });

    } catch (error) {
        console.error("Document upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload document",
            error: error.message,
        });
    }
});

module.exports = router;