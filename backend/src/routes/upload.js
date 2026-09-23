const express = require("express");
const prisma = require("../config/prisma.js");
const upload = require("../documents/upload.js");
const { processDocument } = require("../documents/process-chuck.js");
const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
      /*  #swagger.tags = ['Upload']
        #swagger.description = 'Upload a file to the server'
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['file'] = {
            in: 'formData',
            type: 'file',
            required: 'true',
            description: 'The file to upload',
    } */

    // Your actual file upload logic here (using multer, etc.)
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "PDF file is required",
            });
        }

        const document = await prisma.documents.create({
            data: {
                title: req.file.originalname,
                file_name: req.file.filename,
                file_type: req.file.mimetype,
                file_url: req.file.path,
                status: "UPLOADED",

                // temporary for testing
                user_id: 1,
            },
        });
        await processDocument(document);
        res.status(201).json({
            message: "File uploaded successfully",
            document,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to upload document",
        });
    }
});

module.exports = router;