import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const response = await api.get("/dashboard");

      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-3xl font-bold">My Dashboard</h1>

      {/* OVERVIEW */}

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <StatCard title="Subjects" value={dashboard.overview.total_subjects} />

        <StatCard
          title="Documents"
          value={dashboard.overview.total_documents}
        />

        <StatCard
          title="Quiz Attempts"
          value={dashboard.overview.total_quiz_attempts}
        />

        <StatCard
          title="Overall Score"
          value={`${dashboard.overview.overall_percentage}%`}
        />
      </div>

      {/* SUBJECTS */}

      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">Subjects</h2>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {dashboard.subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      {/* WEAK CONCEPTS */}

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Concepts to Revise</h2>

        {dashboard.weak_concepts.length === 0 ? (
          <div className="rounded-xl bg-white p-6">No weak concepts yet.</div>
        ) : (
          <div className="space-y-3">
            {dashboard.weak_concepts.map((concept) => (
              <div
                key={concept.concept_id}
                className="rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{concept.concept_name}</h3>

                    <p className="text-sm text-gray-500">{concept.topic}</p>
                  </div>

                  <span className="font-semibold text-red-500">
                    {concept.accuracy}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function SubjectCard({ subject }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold">{subject.name}</h3>

      <p className="mt-1 text-sm text-gray-500">{subject.description}</p>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>

          <span>{subject.progress.percentage}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{
              width: `${subject.progress.percentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>{subject.documents.length} chapters</span>

        <span>{subject.progress.attempts} attempts</span>
      </div>
    </div>
  );
}

export default Dashboard;
