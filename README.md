# ReviseAI Backend

> AI-powered personal revision and memory system for students.

ReviseAI helps students turn their study material into a persistent knowledge base and then uses that knowledge to generate revision plans, questions, flashcards, tests, and personalized learning sessions.

The backend is responsible for:

* Authentication and user management
* Document upload and processing
* Text extraction and chunking
* AI-powered concept extraction
* Knowledge graph creation
* Vector embeddings and semantic search
* AI-generated questions and explanations
* Memory tracking
* Spaced-repetition scheduling
* Revision sessions
* Background processing
* Personalized revision recommendations

---

# 1. Technology Stack

## Core

| Technology | Purpose                  |
| ---------- | ------------------------ |
| Node.js    | Backend runtime          |
| TypeScript | Type safety              |
| Express.js | HTTP API                 |
| PostgreSQL | Main database            |
| Prisma     | ORM/database access      |
| pgvector   | Vector similarity search |
| Redis      | Queue/cache              |
| BullMQ     | Background jobs          |
| JWT        | Authentication           |
| Zod        | Request validation       |

## AI

| Component           | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| NVIDIA Nemotron     | Reasoning, summarization, concept extraction, question generation |
| Embedding model/API | Convert text/concepts into vectors                                |
| Vision/OCR model    | Process handwritten notes/images when required                    |
| Image model         | Optional diagrams/visual learning material                        |

---

# 2. High-Level Architecture

```text
                         FRONTEND
                     Next.js / React
                            │
                            │ HTTP / WebSocket
                            ▼
                   ┌──────────────────┐
                   │   Express API    │
                   │     Node.js      │
                   └────────┬─────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        PostgreSQL        Redis          AI Layer
        + pgvector        Queue          Nemotron
             │              │              │
             │              ▼              │
             │          BullMQ Workers     │
             │              │              │
             └──────────────┼──────────────┘
                            │
                            ▼
                       AI Processing
```

---

# 3. Project Structure

```text
src/
│
├── app.ts
├── server.ts
│
├── config/
│
├── routes/
│
├── auth/
│
├── users/
│
├── documents/
│
├── knowledge/
│
├── ai/
│
├── tests/
│
├── revision/
│
├── search/
│
├── workers/
│
├── middleware/
│
├── db/
│
├── utils/
│
├── types/
│
└── lib/
```

---

# 4. Application Entry Files

## `src/app.ts`

Creates and configures the Express application.

Responsibilities:

* Create Express app
* Register middleware
* Register routes
* Register error handler
* Configure CORS
* Configure JSON parsing

Example flow:

```text
app.ts
   │
   ├── middleware
   ├── routes
   └── error handler
```

It should NOT start the server.

---

## `src/server.ts`

Starts the HTTP server.

```text
server.ts
     │
     └── app.ts
           │
           └── Express application
```

Keeping `app.ts` and `server.ts` separate makes testing easier.

---

# 5. Configuration

```text
src/config/
│
├── env.ts
├── database.ts
├── redis.ts
└── ai.ts
```

## `env.ts`

Loads and validates environment variables.

Example:

```text
DATABASE_URL
REDIS_URL
JWT_SECRET
NVIDIA_API_KEY
```

Use Zod to validate them when the application starts.

---

## `database.ts`

Creates the database/Prisma connection.

Used by:

```text
users
documents
knowledge
tests
revision
search
```

---

## `redis.ts`

Creates the Redis connection.

Used by:

```text
workers
queues
rate limiting
temporary processing state
```

---

## `ai.ts`

Stores AI client configuration.

Used by:

```text
ai/nemotron
ai/summarizer
ai/question-generator
ai/evaluator
```

---

# 6. Authentication

```text
src/auth/
│
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.schema.ts
├── auth.types.ts
└── auth.utils.ts
```

## Purpose

Handles:

* Registration
* Login
* Logout
* Token generation
* Password hashing
* Authentication

### Dependency

```text
auth
 ├── database
 ├── Prisma
 ├── JWT
 └── bcrypt
```

### Main endpoints

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

# 7. Users

```text
src/users/
│
├── user.routes.ts
├── user.controller.ts
├── user.service.ts
├── user.schema.ts
└── user.types.ts
```

Responsible for:

* User profile
* Exam preference
* Subjects
* Learning preferences
* Revision preferences

Example:

```text
User
 │
 ├── UPSC
 ├── Indian Polity
 ├── History
 ├── Geography
 └── Current Affairs
```

### Dependencies

```text
users
 ├── auth middleware
 └── database
```

---

# 8. Documents

This is one of the most important modules.

```text
src/documents/
│
├── document.routes.ts
├── document.controller.ts
├── document.service.ts
├── document.schema.ts
├── document.types.ts
│
├── upload/
│   ├── upload.service.ts
│   └── upload.utils.ts
│
├── extraction/
│   ├── extraction.service.ts
│   ├── pdf.extractor.ts
│   ├── image.extractor.ts
│   └── text.cleaner.ts
│
└── processing/
    ├── processing.service.ts
    ├── chunker.ts
    └── document.pipeline.ts
```

## Purpose

Handles:

```text
Upload
   ↓
Store
   ↓
Extract
   ↓
Clean
   ↓
Chunk
   ↓
AI processing
```

### Upload

Accept:

* PDF
* JPG
* PNG
* WebP
* potentially DOCX later

### Extraction

Converts:

```text
PDF/image
   ↓
Raw text
```

### Processing

Converts:

```text
Raw text
   ↓
Clean text
   ↓
Semantic chunks
```

### Dependencies

```text
documents
 ├── database
 ├── object storage
 ├── extraction libraries
 ├── AI layer
 └── workers
```

---

# 9. Knowledge

The knowledge module represents what the student has learned.

```text
src/knowledge/
│
├── concept.routes.ts
├── concept.controller.ts
├── concept.service.ts
│
├── concepts/
│   ├── concept.service.ts
│   └── concept.repository.ts
│
├── relationships/
│   ├── relationship.service.ts
│   └── relationship.repository.ts
│
└── embeddings/
    ├── embedding.service.ts
    ├── embedding.repository.ts
    └── vector.service.ts
```

---

## Concepts

Example:

```text
Fundamental Rights
       │
       ├── Article 14
       ├── Article 19
       ├── Article 21
       └── Article 32
```

A concept can contain:

```text
id
name
description
subject
importance
difficulty
memory_strength
```

---

## Relationships

Stores relationships between concepts.

Example:

```text
Article 32
    │
    ├── related to → Fundamental Rights
    ├── related to → Supreme Court
    └── related to → Article 226
```

This allows ReviseAI to understand that topics aren't isolated.

---

## Embeddings

Converts concepts/chunks into vectors.

```text
Text
 ↓
Embedding model
 ↓
Vector
 ↓
PostgreSQL + pgvector
```

Used for:

* Semantic search
* Related concepts
* RAG
* Finding relevant study material
* Question generation

### Dependencies

```text
knowledge
 ├── database
 ├── pgvector
 ├── embedding model
 └── AI layer
```

---

# 10. AI Layer

```text
src/ai/
│
├── nemotron/
│   ├── nemotron.client.ts
│   ├── nemotron.service.ts
│   └── nemotron.types.ts
│
├── summarizer/
│   ├── summarizer.service.ts
│   └── summarizer.prompts.ts
│
├── question-generator/
│   ├── question.service.ts
│   ├── question.prompts.ts
│   └── question.types.ts
│
└── evaluator/
    ├── evaluator.service.ts
    ├── evaluator.prompts.ts
    └── evaluator.types.ts
```

---

# 11. Nemotron

`nemotron.client.ts`

Responsible only for communicating with NVIDIA's API/service.

Do not put business logic here.

Example:

```text
nemotron.client
       ↓
NVIDIA API
```

---

## `nemotron.service.ts`

Provides reusable AI operations.

Example:

```text
generate()
summarize()
extractConcepts()
generateQuestions()
evaluateAnswer()
```

Other modules should use the service instead of directly calling the NVIDIA API.

---

# 12. Summarizer

Responsible for transforming study material into useful revision content.

```text
Document
   ↓
Relevant chunks
   ↓
Nemotron
   ↓
Structured revision notes
```

Output could include:

```text
Summary
Key points
Definitions
Important facts
Comparisons
Examples
Related concepts
```

---

# 13. Question Generator

Creates questions from the student's actual study material.

```text
Concepts
   +
Relevant chunks
   ↓
Nemotron
   ↓
Questions
```

Question types:

* MCQ
* True/False
* Short answer
* Fill in the blank
* Descriptive
* UPSC-style questions

Every generated question should store its source concept/chunk.

This allows:

```text
Question
   ↓
Source
   ↓
Original study material
```

---

# 14. Evaluator

Evaluates student answers.

```text
Question
   +
Student answer
   +
Reference material
   ↓
Evaluator
   ↓
Score
Explanation
Weak concepts
```

The evaluator should update the student's knowledge/memory state.

---

# 15. Tests

```text
src/tests/
│
├── test.routes.ts
├── test.controller.ts
├── test.service.ts
├── test.repository.ts
└── test.types.ts
```

Responsible for creating and managing tests.

Examples:

```http
POST /api/tests
GET  /api/tests/:id
POST /api/tests/:id/submit
GET  /api/tests/:id/result
```

Dependencies:

```text
tests
 ├── questions
 ├── knowledge
 ├── AI evaluator
 └── database
```

---

# 16. Revision

This is the core product logic.

```text
src/revision/
│
├── revision.routes.ts
├── revision.controller.ts
├── revision.service.ts
│
├── scheduler/
│   ├── scheduler.service.ts
│   ├── spaced-repetition.ts
│   └── priority.ts
│
├── memory/
│   ├── memory.service.ts
│   ├── memory-score.ts
│   └── memory.repository.ts
│
└── sessions/
    ├── session.service.ts
    ├── session.repository.ts
    └── session.types.ts
```

---

# 17. Memory System

The memory system tracks how well a student remembers a concept.

Example:

```text
Concept: Article 32

Memory strength: 42%
Last studied: 12 days ago
Last tested: 2 days ago
Correct answers: 4/10
```

The score should eventually consider:

```text
Time since revision
+
Correct answers
+
Incorrect answers
+
Difficulty
+
Response time
+
Importance
```

---

# 18. Revision Scheduler

Answers the question:

> "What should this student revise today?"

Inputs:

```text
Memory strength
Last revision
Importance
Difficulty
Previous performance
Related concepts
```

Output:

```text
Today's revision

1. Article 32        15 min
2. Article 226       10 min
3. Fundamental Rights 10 min
4. Practice test      15 min
```

---

# 19. Revision Sessions

A revision session represents one actual learning session.

Example:

```text
Session
 ├── Article 32
 ├── Article 226
 ├── 5 flashcards
 ├── 5 questions
 └── final score
```

Used for:

* Progress tracking
* Memory updates
* Analytics
* Streaks

---

# 20. Search

```text
src/search/
│
├── search.routes.ts
├── search.controller.ts
├── search.service.ts
├── semantic-search.ts
└── search.types.ts
```

Supports:

```text
Keyword search
+
Semantic search
```

Example:

Student searches:

> "Supreme Court constitutional remedies"

The system can find relevant content even if the exact phrase doesn't appear.

Dependencies:

```text
search
 ├── PostgreSQL
 ├── pgvector
 └── embeddings
```

---

# 21. Workers

AI processing should NOT happen inside normal HTTP requests.

```text
src/workers/
│
├── queues/
│   ├── document.queue.ts
│   ├── embedding.queue.ts
│   └── question.queue.ts
│
├── document-worker.ts
├── embedding-worker.ts
└── question-worker.ts
```

---

# 22. Document Worker

Triggered after upload.

```text
Upload
  ↓
Redis Queue
  ↓
Document Worker
  ↓
Extract
  ↓
Clean
  ↓
Chunk
  ↓
Store
```

---

# 23. Embedding Worker

Triggered after document processing.

```text
Chunks
  ↓
Embedding model
  ↓
Vectors
  ↓
pgvector
```

This prevents slow embedding operations from blocking API requests.

---

# 24. Question Worker

Generates questions asynchronously.

```text
Concepts
   ↓
Question Queue
   ↓
Worker
   ↓
Nemotron
   ↓
Validate
   ↓
Store Questions
```

---

# 25. Middleware

```text
src/middleware/
│
├── auth.middleware.ts
├── error.middleware.ts
├── rate-limit.middleware.ts
├── validation.middleware.ts
└── upload.middleware.ts
```

## Authentication Middleware

Checks JWT.

```text
Request
 ↓
JWT
 ↓
User
 ↓
Route
```

---

## Error Middleware

Centralized error handling.

All controllers should use this instead of manually returning random error formats.

---

## Validation Middleware

Validates incoming requests using Zod.

Example:

```text
POST /tests

Request
 ↓
Zod validation
 ↓
Controller
```

---

# 26. Database

```text
src/db/
│
├── prisma.ts
└── repositories/
```

Prisma schema should live outside `src`:

```text
prisma/
└── schema.prisma
```

Main entities:

```text
User
Document
DocumentChunk
Subject
Topic
Concept
ConceptRelationship
Embedding
Question
Test
TestAttempt
Answer
MemoryState
RevisionSession
RevisionItem
```

---

# 27. Utils

```text
src/utils/
│
├── logger.ts
├── errors.ts
├── pagination.ts
├── dates.ts
├── hashing.ts
└── retry.ts
```

Only put genuinely reusable utilities here.

Do not turn `utils/` into a dumping ground.

---

# 28. Types

```text
src/types/
│
├── express.d.ts
├── api.ts
└── common.ts
```

Shared TypeScript types.

Domain-specific types should stay inside their modules.

---

# 29. Lib

```text
src/lib/
│
├── storage.ts
├── queue.ts
└── logger.ts
```

Contains initialized third-party integrations.

Example:

```text
lib/storage
      ↓
Object storage provider

lib/queue
      ↓
BullMQ

lib/logger
      ↓
Logging system
```

---

# 30. Request Flow — Uploading Notes

Complete flow:

```text
Student
   │
   ▼
POST /api/documents
   │
   ▼
document.controller
   │
   ▼
document.service
   │
   ├── Store file
   │
   └── Create database record
             │
             ▼
        Document Queue
             │
             ▼
       document-worker
             │
       ┌─────┴─────┐
       ▼           ▼
   extraction    processing
       │           │
       └─────┬─────┘
             ▼
          Chunks
             │
             ▼
       embedding queue
             │
             ▼
      embedding-worker
             │
             ▼
         pgvector
             │
             ▼
       AI processing
             │
             ▼
          Concepts
             │
             ▼
     Knowledge Database
```

---

# 31. Request Flow — Taking a Test

```text
Student
   │
   ▼
GET /api/tests/:id
   │
   ▼
Test Service
   │
   ▼
Questions
   │
   ▼
Student answers
   │
   ▼
POST /api/tests/:id/submit
   │
   ▼
Evaluator
   │
   ├── Score
   ├── Explanation
   └── Weak concepts
             │
             ▼
       Memory Service
             │
             ▼
      Revision Scheduler
             │
             ▼
     Next revision date
```

---

# 32. Request Flow — Today's Revision

```text
GET /api/revision/today
             │
             ▼
      Revision Service
             │
      ┌──────┼─────────┐
      ▼      ▼         ▼
    Memory  History  Importance
      │      │         │
      └──────┼─────────┘
             ▼
       Priority Engine
             │
             ▼
       Today's Plan
```

Response:

```json
{
  "date": "2026-08-22",
  "estimatedMinutes": 45,
  "items": [
    {
      "concept": "Fundamental Rights",
      "reason": "Weak and overdue",
      "duration": 15
    },
    {
      "concept": "Article 32",
      "reason": "Low recent accuracy",
      "duration": 10
    }
  ]
}
```

---

# 33. Dependency Rules

The most important architectural rule:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

AI should be accessed through:

```text
Services
  ↓
AI Services
  ↓
AI Provider
```

Workers should call services, not duplicate business logic.

### Bad

```text
controller → NVIDIA API
worker → NVIDIA API
test → NVIDIA API
```

### Good

```text
controller
    ↓
service
    ↓
AI service
    ↓
Nemotron client
    ↓
NVIDIA
```

This means if we replace Nemotron later, most of the application doesn't change.

---

# 34. Important Dependency Direction

```text
HTTP Routes
     ↓
Controllers
     ↓
Domain Services
     ↓
Repositories
     ↓
Database
```

And:

```text
Domain Services
     ↓
AI Services
     ↓
AI Provider
```

Workers sit outside the HTTP layer:

```text
Queue
  ↓
Worker
  ↓
Domain Service
```

---

# 35. Required Helper Components

The project will eventually need these shared components:

```text
Authentication
File Storage
Database
Redis
Queue
Logger
Error Handler
Validation
AI Client
Embedding Client
```

These should be initialized once and reused.

---

# 36. Environment Variables

Example `.env`:

```env
NODE_ENV=development

PORT=5000

DATABASE_URL="postgresql://..."

REDIS_URL="redis://..."

JWT_SECRET="..."

NVIDIA_API_KEY="..."

STORAGE_ENDPOINT="..."
STORAGE_BUCKET="..."
STORAGE_ACCESS_KEY="..."
STORAGE_SECRET_KEY="..."
```

Never commit `.env`.

Commit:

```text
.env.example
```

---

# 37. API Structure

All API routes should start with:

```text
/api
```

Examples:

```text
/api/auth
/api/users
/api/documents
/api/concepts
/api/search
/api/tests
/api/revision
/api/progress
```

---

# 38. Development Order

Do NOT build everything simultaneously.

## Phase 1 — Foundation

```text
Node.js
TypeScript
Express
Prisma
PostgreSQL
Authentication
```

## Phase 2 — Documents

```text
Upload
Storage
PDF extraction
Text cleaning
Chunking
```

## Phase 3 — AI

```text
Nemotron integration
Summarization
Concept extraction
Question generation
```

## Phase 4 — Knowledge

```text
Concepts
Relationships
Embeddings
pgvector
Semantic search
```

## Phase 5 — Tests

```text
Question bank
Test creation
Answer submission
Evaluation
```

## Phase 6 — Memory

```text
Memory state
Revision history
Spaced repetition
Revision scheduler
```

## Phase 7 — Workers

```text
Redis
BullMQ
Document worker
Embedding worker
Question worker
```

## Phase 8 — Frontend

```text
Dashboard
Upload
Knowledge
Revision
Tests
Analytics
```

---

# 39. Core Principle

ReviseAI is NOT:

```text
PDF
 ↓
AI
 ↓
Summary
```

It is:

```text
STUDY MATERIAL
      ↓
UNDERSTANDING
      ↓
KNOWLEDGE
      ↓
MEMORY
      ↓
REVISION
      ↓
ACTIVE RECALL
      ↓
EVALUATION
      ↓
MEMORY UPDATE
      ↓
NEXT REVISION
```

The long-term goal is:

> **The system should know what the student has learned, how well they remember it, what they are forgetting, and what they should revise next.**

That memory/revision loop is the core product.
