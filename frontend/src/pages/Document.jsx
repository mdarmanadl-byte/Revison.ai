import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function Document() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadDocument();
  }, [id]);

  async function loadDocument() {
    try {
      const response = await api.get(`/revision/document/${id}`);

      setData(response.data);
    } catch (error) {
      console.error("Document error:", error);

      setError(error.response?.data?.message || "Failed to load chapter");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 text-red-500 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  const { document, subject, topic, revision } = data;

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* TOP BAR */}

      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate(`/subjects/${subject.id}`)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← {subject.name}
          </button>

          <button
            onClick={() => navigate(`/documents/${id}/quiz`)}
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Start Quiz →
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}

        <section className="mb-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 p-8 text-white">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
              {subject.name}
            </span>

            {topic && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                {topic.name}
              </span>
            )}
          </div>

          <h1 className="max-w-3xl text-3xl font-bold md:text-4xl">
            {document.title}
          </h1>

          {topic && (
            <p className="mt-3 max-w-2xl text-gray-300">{topic.description}</p>
          )}
        </section>

        {/* TABS */}

        <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border bg-white p-2">
          <Tab
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Tab>

          <Tab
            active={activeTab === "concepts"}
            onClick={() => setActiveTab("concepts")}
          >
            Concepts
          </Tab>

          <Tab
            active={activeTab === "points"}
            onClick={() => setActiveTab("points")}
          >
            Important Points
          </Tab>

          <Tab
            active={activeTab === "mcqs"}
            onClick={() => setActiveTab("mcqs")}
          >
            Quick Questions
          </Tab>
        </div>

        {/* OVERVIEW */}

        {activeTab === "overview" && <Overview revision={revision} />}

        {/* CONCEPTS */}

        {activeTab === "concepts" && (
          <Concepts concepts={revision.key_concepts} />
        )}

        {/* IMPORTANT POINTS */}

        {activeTab === "points" && (
          <ImportantPoints points={revision.important_points} />
        )}

        {/* MCQS */}

        {activeTab === "mcqs" && <MCQs mcqs={revision.mcqs} />}
      </main>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Overview({ revision }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            📖
          </div>

          <h2 className="text-xl font-bold">Chapter Summary</h2>
        </div>

        <p className="leading-8 text-gray-600">{revision.summary}</p>
      </section>

      <aside className="rounded-3xl bg-white p-6 shadow-sm">
        <h3 className="mb-5 font-bold">Quick Revision</h3>

        <div className="space-y-4">
          <QuickStat
            label="Key Concepts"
            value={revision.key_concepts?.length || 0}
          />

          <QuickStat
            label="Important Points"
            value={revision.important_points?.length || 0}
          />

          <QuickStat
            label="Practice Questions"
            value={revision.mcqs?.length || 0}
          />
        </div>
      </aside>
    </div>
  );
}

function Concepts({ concepts }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {concepts.map((concept, index) => (
        <div key={index} className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
              {index + 1}
            </span>
          </div>

          <h3 className="text-lg font-bold">{concept.name}</h3>

          <p className="mt-3 leading-7 text-gray-500">{concept.description}</p>
        </div>
      ))}
    </div>
  );
}

function ImportantPoints({ points }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="space-y-5">
        {points.map((point, index) => (
          <div key={index} className="flex gap-4">
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-600">
              ✓
            </div>

            <p className="leading-7 text-gray-600">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MCQs({ mcqs }) {
  return (
    <div className="space-y-5">
      {mcqs.map((mcq, index) => (
        <div key={index} className="rounded-3xl bg-white p-7 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-400">
              Question {index + 1}
            </span>

            {mcq.concept && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                {mcq.concept}
              </span>
            )}
          </div>

          <h3 className="mb-5 text-lg font-semibold">{mcq.question}</h3>

          <div className="grid gap-3 md:grid-cols-2">
            {mcq.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="rounded-xl border p-4 text-sm text-gray-600"
              >
                <span className="mr-3 font-semibold text-gray-400">
                  {String.fromCharCode(65 + optionIndex)}.
                </span>

                {option}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
      <span className="text-sm text-gray-500">{label}</span>

      <span className="font-bold">{value}</span>
    </div>
  );
}

function Tab({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-medium transition ${
        active ? "bg-black text-white" : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] p-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8 h-10 w-64 rounded bg-gray-200" />

        <div className="mb-8 h-52 rounded-3xl bg-gray-200" />

        <div className="h-96 rounded-3xl bg-gray-200" />
      </div>
    </div>
  );
}

export default Document;
