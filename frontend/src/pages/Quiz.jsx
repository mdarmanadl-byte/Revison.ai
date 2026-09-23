import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  async function loadQuiz() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/revision/document/${id}`);

      const revision = response.data.revision;

      const mcqs = revision?.mcqs || [];

      if (!mcqs.length) {
        setError("No quiz questions are available for this chapter.");
        return;
      }

      setDocument(revision.document);
      setQuestions(mcqs);
      setAnswers(new Array(mcqs.length).fill(null));
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message || "Failed to load quiz. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const question = questions[current];

  const answeredCount = useMemo(() => {
    return answers.filter((answer) => answer !== null).length;
  }, [answers]);

  const progress = questions.length
    ? ((current + 1) / questions.length) * 100
    : 0;

  function selectAnswer(option) {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  }

  function nextQuestion() {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function previousQuestion() {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function submitQuiz() {
    if (answers.some((answer) => answer === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await api.post(`/quiz/submit/${id}`, {
        answers,
      });

      setResult(response.data.result);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to submit quiz. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function retryQuiz() {
    setAnswers(new Array(questions.length).fill(null));
    setCurrent(0);
    setResult(null);
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !questions.length) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5 text-2xl">
            !
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Quiz unavailable
          </h2>

          <p className="text-gray-500 mb-6">{error}</p>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResult
        result={result}
        questions={questions}
        document={document}
        onRetry={retryQuiz}
        onBack={() => navigate(`/documents/${id}`)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(`/documents/${id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-black transition"
            >
              <span className="text-lg">←</span>
              <span className="font-medium hidden sm:inline">
                Back to chapter
              </span>
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">
                Chapter Quiz
              </p>
              <p className="text-xs text-gray-500">
                {document?.title || "Revision"}
              </p>
            </div>

            <div className="text-sm font-semibold text-gray-700">
              {answeredCount}/{questions.length}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Question counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-semibold text-gray-500">
              Question
            </span>

            <span className="ml-2 text-sm font-bold text-gray-900">
              {current + 1} of {questions.length}
            </span>
          </div>

          {question?.concept && (
            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600">
              {question.concept}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Question card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sm:p-9">
          <h1 className="text-xl sm:text-2xl font-bold leading-relaxed text-gray-900">
            {question?.question}
          </h1>

          {/* Options */}
          <div className="mt-8 space-y-3">
            {question?.options?.map((option, index) => {
              const selected = answers[current] === option;

              return (
                <button
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selected
                      ? "border-black bg-gray-50"
                      : "border-gray-100 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        selected
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    <span
                      className={`text-sm sm:text-base ${
                        selected
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </span>

                    {selected && (
                      <div className="ml-auto w-5 h-5 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={previousQuestion}
            disabled={current === 0}
            className={`px-5 py-3 rounded-xl font-semibold transition ${
              current === 0
                ? "text-gray-300 cursor-not-allowed"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              disabled={answers[current] === null}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                answers[current] === null
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={submitting || answers[current] === null}
              className={`px-7 py-3 rounded-xl font-semibold transition ${
                submitting || answers[current] === null
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>

        {/* Question navigator */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Questions
          </p>

          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const answered = answers[index] !== null;
              const active = current === index;

              return (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                    active
                      ? "bg-black text-white"
                      : answered
                        ? "bg-gray-200 text-gray-900"
                        : "bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function QuizResult({ result, questions, document, onRetry, onBack }) {
  const percentage = result?.percentage ?? 0;
  const correct = result?.score ?? 0;
  const total = result?.total_questions ?? questions.length;

  const results = result?.answers || [];

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-black transition font-medium"
          >
            ← Back to chapter
          </button>

          <span className="text-sm font-semibold text-gray-900">
            Quiz Result
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Score card */}
        <section className="bg-black text-white rounded-3xl p-8 sm:p-10 text-center">
          <p className="text-sm text-gray-400 font-medium">Your Score</p>

          <div className="mt-3 text-6xl sm:text-7xl font-bold">
            {percentage}%
          </div>

          <p className="mt-3 text-gray-300">
            You got{" "}
            <span className="font-semibold text-white">
              {correct} out of {total}
            </span>{" "}
            questions correct.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Retry Quiz
            </button>

            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Back to Chapter
            </button>
          </div>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          <ResultStat label="Correct" value={correct} />

          <ResultStat label="Incorrect" value={total - correct} />

          <ResultStat label="Accuracy" value={`${percentage}%`} />
        </div>

        {/* Review */}
        <section className="mt-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Review Answers</h2>
            <p className="text-sm text-gray-500 mt-1">
              Understand what you got right and where you can improve.
            </p>
          </div>

          <div className="space-y-4">
            {results.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl border p-5 ${
                  item.correct ? "border-green-100" : "border-red-100"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                      item.correct
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.correct ? "✓" : "×"}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 leading-relaxed">
                      {index + 1}. {questions[index]?.question}
                    </p>

                    {item.concept && (
                      <span className="inline-block mt-3 px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                        {item.concept}
                      </span>
                    )}

                    <div className="mt-4 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-gray-500">
                          Your answer:
                        </span>{" "}
                        <span
                          className={
                            item.correct
                              ? "text-green-700 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {item.user_answer || "Not answered"}
                        </span>
                      </p>

                      {!item.correct && (
                        <p>
                          <span className="font-semibold text-gray-500">
                            Correct answer:
                          </span>{" "}
                          <span className="text-green-700 font-medium">
                            {item.correct_answer}
                          </span>
                        </p>
                      )}
                    </div>

                    {item.explanation && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Explanation
                        </p>

                        <p className="text-sm text-gray-700 leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function ResultStat({ label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export default Quiz;
