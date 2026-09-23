-- AlterTable
ALTER TABLE "Documents" ADD COLUMN     "subject_id" INTEGER,
ADD COLUMN     "topicId" INTEGER;

-- AlterTable
ALTER TABLE "topic" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConceptAttempt" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "concept_id" INTEGER NOT NULL,
    "document_id" INTEGER,
    "correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConceptAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalizedQuiz" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "subject_id" INTEGER,
    "questions" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalizedQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalizedQuizAttempt" (
    "id" SERIAL NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalizedQuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizAttempt_user_id_idx" ON "QuizAttempt"("user_id");

-- CreateIndex
CREATE INDEX "QuizAttempt_document_id_idx" ON "QuizAttempt"("document_id");

-- CreateIndex
CREATE INDEX "ConceptAttempt_user_id_idx" ON "ConceptAttempt"("user_id");

-- CreateIndex
CREATE INDEX "ConceptAttempt_concept_id_idx" ON "ConceptAttempt"("concept_id");

-- CreateIndex
CREATE INDEX "ConceptAttempt_document_id_idx" ON "ConceptAttempt"("document_id");

-- CreateIndex
CREATE INDEX "PersonalizedQuiz_user_id_idx" ON "PersonalizedQuiz"("user_id");

-- CreateIndex
CREATE INDEX "PersonalizedQuiz_subject_id_idx" ON "PersonalizedQuiz"("subject_id");

-- CreateIndex
CREATE INDEX "PersonalizedQuizAttempt_user_id_idx" ON "PersonalizedQuizAttempt"("user_id");

-- CreateIndex
CREATE INDEX "PersonalizedQuizAttempt_quiz_id_idx" ON "PersonalizedQuizAttempt"("quiz_id");

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptAttempt" ADD CONSTRAINT "ConceptAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptAttempt" ADD CONSTRAINT "ConceptAttempt_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "concepts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConceptAttempt" ADD CONSTRAINT "ConceptAttempt_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizedQuiz" ADD CONSTRAINT "PersonalizedQuiz_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizedQuiz" ADD CONSTRAINT "PersonalizedQuiz_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizedQuizAttempt" ADD CONSTRAINT "PersonalizedQuizAttempt_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "PersonalizedQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalizedQuizAttempt" ADD CONSTRAINT "PersonalizedQuizAttempt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
