import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function Subject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadSubject();
  }, [id]);

  async function loadSubject() {
    try {
      const response = await api.get(`/subjects/${id}`);

      setSubject(response.data.subject);
    } catch (error) {
      console.error("Subject error:", error);

      setError(error.response?.data?.message || "Failed to load subject");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading subject...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}

      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-sm text-blue-600"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold">{subject.name}</h1>

        <p className="mt-2 text-gray-500">{subject.description}</p>
      </div>

      {/* DOCUMENTS */}

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Chapters</h2>

        {subject.documents.length === 0 ? (
          <div className="rounded-xl bg-white p-6">
            No chapters uploaded yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subject.documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => navigate(`/documents/${document.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* TOPICS */}

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Topics</h2>

        {subject.topic.length === 0 ? (
          <div className="rounded-xl bg-white p-6">
            No topics generated yet.
          </div>
        ) : (
          <div className="space-y-4">
            {subject.topic.map((topic) => (
              <div key={topic.id} className="rounded-xl bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold">{topic.name}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {topic.description}
                </p>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Concepts</p>

                  <div className="flex flex-wrap gap-2">
                    {topic.concepts.map((concept) => (
                      <span
                        key={concept.id}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                      >
                        {concept.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function DocumentCard({ document, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl bg-white p-5 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="mb-3 text-3xl">📄</div>

      <h3 className="font-semibold">{document.title}</h3>

      <p className="mt-2 text-sm text-gray-500">Status: {document.status}</p>

      <div className="mt-4 text-sm font-medium text-blue-600">
        Open Chapter →
      </div>
    </button>
  );
}

export default Subject;
