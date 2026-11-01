# Revison.ai

> An AI-powered personal revision assistant that helps students turn their study material into structured, searchable learning resources.

Revison.ai is being built to make revision more organized and active. Students can create subjects, upload their study material, and use AI to extract topics and concepts, generate revision resources, and ask questions grounded in their own notes.

The long-term goal is to go beyond summarizing PDFs: Revison.ai aims to help students understand what they have studied, identify topics they struggle with, and decide what to revise next.

**Project status:** Active development. The repository contains working backend components, while some product features and the broader architecture described below are still being developed.

---

## Table of contents

- [What the project aims to do](#what-the-project-aims-to-do)
- [Current implementation](#current-implementation)
- [How the current backend works](#how-the-current-backend-works)
- [Technology stack](#technology-stack)
- [Current backend structure](#current-backend-structure)
- [Planned product architecture](#planned-product-architecture)
- [Development roadmap](#development-roadmap)
- [Getting started](#getting-started)
- [Contributing](#contributing)
- [Project status and limitations](#project-status-and-limitations)

---

## What the project aims to do

The intended learning workflow is:

1. **Create subjects** — organize study material into subjects such as Mathematics, Biology, History, or Computer Science.
2. **Upload study material** — add PDF notes or learning resources to a subject.
3. **Extract topics and concepts** — process the document and use AI to identify the topic and important concepts in its content.
4. **Create revision material** — generate summaries, key concepts, important points, and practice questions from the uploaded material.
5. **Ask questions** — retrieve relevant passages from a student's notes and generate answers grounded in that material.
6. **Practice and review** — attempt quizzes, track performance, and identify weaker concepts.
7. **Revise strategically** — the longer-term goal is to use learning history and performance to recommend what a student should revise next.

The subject is selected or created by the student. AI-assisted topic and concept extraction is performed on the uploaded material; a complete automatic syllabus or chapter hierarchy is not yet implemented.

---

## Current implementation

The following describes backend functionality present in the repository. It does not imply that every feature has a finished frontend or a complete end-to-end user experience.

| Area | Current status |
|---|---|
| User authentication | Backend authentication and protected routes are present |
| Subject organization | Subject creation and user-scoped subject retrieval |
| PDF ingestion | Authenticated PDF upload, text extraction, cleaning, and chunking |
| Topic and concept extraction | Nemotron-based topic/concept analysis and persistence |
| Embeddings | NVIDIA Nemotron embedding integration |
| Semantic retrieval | PostgreSQL/pgvector similarity search over document chunks |
| RAG question answering | Retrieves relevant note chunks and generates context-grounded answers |
| Study material generation | Backend logic for summaries, key concepts, important points, and MCQs |
| Quiz attempts | MCQ answer evaluation and attempt persistence |
| Progress tracking | Subject-level and overall progress calculations |
| Weak-topic identification | Uses concept performance to identify lower-accuracy concepts |
| Frontend integration | Still under development |
| Spaced repetition and revision planning | Planned; not yet implemented as a complete system |
| Knowledge graph and concept relationships | Future direction; not currently implemented as a complete graph system |
| Redis/BullMQ background workers | Planned; not part of the current implementation |

---

## How the current backend works

### 1. Subject and document organization

A student creates a subject and uploads a PDF against that subject. The backend checks that the subject belongs to the authenticated user before associating the document with it.

### 2. PDF processing

The current document-processing pipeline:

- Extracts text from the uploaded PDF.
- Cleans extracted text.
- Splits the text into smaller chunks.
- Stores the chunks in PostgreSQL.
- Generates embeddings for the chunks using NVIDIA's embedding API.
- Stores vector representations for semantic retrieval.
- Runs topic and concept analysis on the processed content.

At present, chunk page metadata is not a reliable page-by-page citation system.

### 3. Topic and concept analysis

The topic-analysis module uses NVIDIA Nemotron to identify a topic and concepts from the document content. The extracted information is validated and saved to the database.

The current behavior is document-level topic/concept extraction. It should not be confused with a fully automated hierarchy that understands an entire textbook's chapters, sections, prerequisites, and relationships.

### 4. Study material generation

The study-material module processes document chunks in batches and can generate:

- A summary
- Key concepts
- Important points
- Multiple-choice questions (MCQs)

This is implemented as backend functionality. The complete student-facing workflow is still being developed.

### 5. Semantic search and RAG

The retrieval flow is:

```text
Student question
      |
      v
Generate query embedding
      |
      v
Search document chunks with pgvector
      |
      v
Retrieve the most relevant chunks
      |
      v
Pass retrieved context to Nemotron
      |
      v
Generate an answer grounded in the notes
```

The RAG prompt instructs the model to use the supplied study material and to say when the answer is not available in that material. Retrieved source information is returned with the answer so the application can show where the response came from.

### 6. Practice and progress

The backend includes quiz-attempt evaluation and persistence, progress calculations, and weak-concept identification based on recorded performance.

Personalized quiz generation and the broader practice experience are still being refined. These should not yet be treated as a fully complete adaptive assessment system.

---

## Technology stack

The stack below distinguishes technologies used by the current backend from technologies being considered for future development.

### Currently used

| Technology | Role |
|---|---|
| JavaScript | Backend language |
| Node.js | Runtime |
| Express.js | HTTP API |
| PostgreSQL | Relational database |
| Prisma | ORM and database access |
| pgvector | Vector similarity search |
| NVIDIA Nemotron | Topic/concept analysis, study-material generation, and RAG responses |
| NVIDIA Nemotron Embeddings | Text and query embeddings |
| JWT | Authentication |
| PDF text extraction libraries | PDF text extraction |

### Planned or under consideration

| Technology / capability | Intended use |
|---|---|
| Redis | Caching and asynchronous processing support |
| BullMQ | Background job queues and workers |
| OCR / vision model | Extracting content from scanned or handwritten notes |
| Flashcards | Additional active-recall format |
| Spaced-repetition algorithm | Scheduling revision based on learning history |
| Concept relationships | Representing connections between related concepts |

Planned technologies are not dependencies of the current working backend unless they are added to the implementation.

---

## Current backend structure

The following is the current structure of the main backend modules, rather than a proposed future directory layout:

```text
backend/
├── prisma/
│   └── schema.prisma
└── src/
    ├── ai/
    │   ├── rag.js
    │   ├── topic-analyzer.js
    │   ├── personalized-quiz.js
    │   └── save-topic.js
    │
    ├── documents/
    │   ├── process-document.js
    │   ├── embedding.js
    │   └── study-material.js
    │
    ├── search/
    │   └── semantic-search.js
    │
    └── routes/
        ├── documents.js
        ├── subjects.js
        ├── study-material.js
        ├── personalized-quiz.js
        ├── quiz.js
        ├── progress.js
        └── weak-topics.js
```

This is a focused overview of the main modules, not necessarily an exhaustive listing of every file in the repository.

### Main module responsibilities

| Module | Responsibility |
|---|---|
| `ai/rag.js` | Retrieves relevant study chunks and generates answers using their context |
| `ai/topic-analyzer.js` | Uses Nemotron to extract a topic and concepts from document content |
| `ai/save-topic.js` | Persists topic and concept analysis |
| `ai/personalized-quiz.js` | Contains personalized quiz-generation logic; still being refined |
| `documents/process-document.js` | Extracts, cleans, chunks, embeds, and stores PDF content |
| `documents/embedding.js` | Calls NVIDIA's embedding API |
| `documents/study-material.js` | Generates summaries, key concepts, important points, and MCQs |
| `search/semantic-search.js` | Performs vector similarity search over stored document chunks |
| `routes/` | Exposes backend functionality through API routes |

---

## Planned product architecture

As the project grows, the backend is intended to move toward clearer domain boundaries. The structure below is a **target architecture**, not a claim about folders or files that already exist.

```text
backend/
├── src/
│   ├── auth/
│   ├── users/
│   ├── subjects/
│   ├── documents/
│   │   ├── upload/
│   │   ├── extraction/
│   │   └── processing/
│   │
│   ├── knowledge/
│   │   ├── topics/
│   │   ├── concepts/
│   │   └── relationships/
│   │
│   ├── ai/
│   │   ├── providers/
│   │   ├── summarization/
│   │   ├── question-generation/
│   │   └── evaluation/
│   │
│   ├── search/
│   ├── quizzes/
│   ├── progress/
│   ├── revision/
│   │   ├── scheduling/
│   │   ├── memory/
│   │   └── sessions/
│   │
│   ├── workers/
│   ├── middleware/
│   └── utils/
│
└── prisma/
    └── schema.prisma
```

### Intended learning organization

The planned content model is:

```text
Student
  |
  └── Subject
        |
        └── Study material
              |
              └── Topic
                    |
                    └── Concepts
```

A subject groups a student's material. Documents provide the source content from which topics and concepts can be extracted. Over time, the system may also represent relationships between concepts, but a full knowledge graph is a future capability.

### Intended AI components

The AI layer is intended to separate provider communication from learning-related tasks:

| Component | Intended responsibility |
|---|---|
| AI provider client | Communicate with the selected model API |
| Summarizer | Produce concise, structured revision notes |
| Topic/concept extractor | Identify topics and concepts in study material |
| Question generator | Create practice questions from source material |
| Evaluator | Assess submitted answers against reference material |

The current code uses JavaScript modules under `backend/src/ai`, `backend/src/documents`, and `backend/src/search`. The modular design above is a direction for future refactoring and expansion.

---

## Long-term revision and memory vision

A major goal is to make revision adaptive rather than simply generating notes.

The intended system may consider:

- Which concepts a student has studied
- Quiz and practice performance
- Correct and incorrect answers
- How long it has been since a concept was revised
- Concept difficulty and importance
- The student's previous revision history

Using these signals, a future revision scheduler could recommend what to study next.

```text
Study material
      |
      v
Topics and concepts
      |
      v
Summaries and practice questions
      |
      v
Student attempts
      |
      v
Performance and progress history
      |
      v
Identify concepts needing attention
      |
      v
Recommend the next revision
```

This memory-and-revision loop is the long-term product vision. A complete spaced-repetition engine, memory-strength model, daily revision scheduler, and revision-session system are not yet implemented.

---

## Development roadmap

The roadmap is intentionally incremental. Items are plans, not assertions that the corresponding feature is already available.

### Phase 1 — Core learning organization
- [x] Subject creation and retrieval
- [x] PDF upload flow
- [x] PDF text extraction and chunking
- [x] Store documents and chunks
- [ ] Improve document lifecycle and error handling
- [ ] Complete the student-facing subject/document experience

### Phase 2 — AI-assisted study material
- [x] NVIDIA Nemotron integration
- [x] Topic and concept extraction logic
- [x] Summary and key-point generation logic
- [x] MCQ generation logic in the study-material module
- [ ] Improve output validation and quality checks
- [ ] Complete frontend integration for generated material

### Phase 3 — Retrieval and question answering
- [x] Generate embeddings for document chunks
- [x] Store vectors in PostgreSQL/pgvector
- [x] Semantic search over study material
- [x] RAG-based question answering
- [ ] Improve source attribution and retrieval evaluation
- [ ] Add broader retrieval and filtering options

### Phase 4 — Practice and progress
- [x] Quiz-attempt evaluation and persistence
- [x] Progress calculation
- [x] Weak-concept identification
- [ ] Stabilize personalized quiz generation
- [ ] Add more question formats
- [ ] Build a complete practice and results experience

### Phase 5 — Adaptive revision
- [ ] Track concept-level revision history
- [ ] Design a memory-strength model
- [ ] Implement spaced-repetition scheduling
- [ ] Recommend daily revision tasks
- [ ] Build revision sessions and learning analytics

### Phase 6 — Architecture and scalability
- [ ] Refactor AI functionality into provider and task-specific modules
- [ ] Add asynchronous workers for long-running processing
- [ ] Evaluate Redis and BullMQ for job processing
- [ ] Improve observability, testing, and failure recovery

### Phase 7 — Frontend and product experience
- [ ] Complete dashboard and subject views
- [ ] Integrate document upload and processing status
- [ ] Display generated summaries and concepts
- [ ] Build quiz, progress, and weak-topic screens
- [ ] Add the adaptive revision experience as its backend becomes available

---

## Getting started

The backend uses Node.js, PostgreSQL, Prisma, and NVIDIA API access.

1. Clone the repository:

   ```bash
   git clone https://github.com/mdarmanadl-byte/Revison.ai.git
   cd Revison.ai
   ```

2. Move into the backend directory:

   ```bash
   cd backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the environment variables used by the backend. At minimum, configure the PostgreSQL connection and NVIDIA API key according to the project's current environment configuration.

   Create a local `.env` file. Do not commit secrets or API keys.

5. Generate the Prisma client and apply the database migrations using the scripts and Prisma setup in the backend:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. Start the backend using the development script defined in `backend/package.json`.

> Setup commands and required environment variables may evolve while the project is under active development. Check the backend package scripts and Prisma configuration if a command differs in your local checkout.

---

## Contributing

Revison.ai is an open-source project under active development, and contributions are welcome.

You can contribute to areas such as:

- PDF parsing, extraction, and document processing
- Subject, topic, and concept organization
- AI-powered summarization and question generation
- RAG, embeddings, and semantic retrieval
- Quiz evaluation and progress tracking
- Adaptive revision and spaced-repetition research
- Frontend integration and user experience
- Testing, documentation, and bug fixes

### Before starting

1. Check the current implementation and open issues.
2. Discuss substantial changes before building a new module.
3. Keep pull requests focused and explain what has been tested.
4. Do not commit API keys, database credentials, uploaded private study material, or other secrets.
5. If you are implementing an item from the planned architecture, make that clear in the pull request.

Some architecture sections describe future direction. Please check whether a feature exists before depending on it.

---

## Project status and limitations

Revison.ai is a work in progress. The repository contains backend implementations for document processing, AI-assisted topic/concept extraction, study-material generation, semantic retrieval, RAG question answering, quizzes, and progress-related functionality.

The complete product experience is not finished. In particular, the long-term memory model, spaced-repetition scheduler, daily revision planner, full knowledge graph, background job architecture, and complete frontend integration remain future work or active development areas.

The goal is to build these capabilities incrementally and keep the implementation, documentation, and project roadmap transparent.

---

## Core principle

Revison.ai is intended to become more than a PDF summarizer.

```text
STUDY MATERIAL
      |
      v
UNDERSTANDING
      |
      v
TOPICS AND CONCEPTS
      |
      v
ACTIVE RECALL
      |
      v
PRACTICE AND EVALUATION
      |
      v
LEARNING HISTORY
      |
      v
PERSONALIZED REVISION
```

> **The long-term vision is for the system to help students understand what they have studied, recognize what they are struggling to remember, and decide what they should revise next.**
