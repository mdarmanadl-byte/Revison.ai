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
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "PDF file is required",
            });
        }

        const subjectId = Number(req.body.subjectId);

        if (!Number.isInteger(subjectId)) {
            return res.status(400).json({
                success: false,
                message: "Valid subjectId is required",
            });
        }

        // Temporary user ID until JWT authentication
        const userId = 1;

        // Make sure subject belongs to this user
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

        // Create document
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

        // Extract → Chunk → Embedding
        await processDocument(document);
        

        // Analyze topic
       
// PDF → chunks → embeddings
await processDocument(document);

// Get document chunks
const chunks = await prisma.documentChunk.findMany({
    where: {
        document_id: document.id,
    },
    orderBy: {
        chunk_index: "asc",
    },
});

// AI analyzes topic + concepts
const analysis = await analyzeTopic(chunks);

// Save topic + concepts
const topic = await saveTopicAnalysis(
    document.id,
    subjectId,
    analysis
);



        // Update status
        const updatedDocument =
            await prisma.documents.update({
                where: {
                    id: document.id,
                },
                data: {
                    status: "PROCESSED",
                },
            });

        return res.status(201).json({
            success: true,
            message: "Document uploaded and processed successfully",
            document: updatedDocument,
            subject: {
                id: subject.id,
                name: subject.name,
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