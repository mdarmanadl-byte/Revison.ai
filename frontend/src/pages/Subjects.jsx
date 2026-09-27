import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Icon from "../components/ui/Icon";
import api from "../api/api";

function Subjects() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/subjects/");

      const data = response.data;

      /*
       * Supports common backend response shapes:
       *
       * { subjects: [...] }
       * { data: [...] }
       * [...]
       */
      const list = data?.subjects || data?.data || data || [];

      setSubjects(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);

      setError(err.response?.data?.message || "Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleCreateSubject = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Subject name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const response = await api.post("/subjects/", {
        name,
        description,
      });

      const createdSubject = response.data?.subject;

      if (!createdSubject?.id) {
        throw new Error("Subject was created but no subject ID was returned.");
      }

      setForm({
        name: "",
        description: "",
      });

      setShowModal(false);

      // IMPORTANT:
      // Open the newly-created subject immediately.
      navigate(`/subjects/${createdSubject.id}`);
    } catch (err) {
      console.error("Create subject error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create subject.",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const closeModal = () => {
    if (creating) return;

    setShowModal(false);

    setForm({
      name: "",
      description: "",
    });
  };

  return (
    <>
      <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1450px]">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-slate-500">Workspace</p>

              <h1 className="mt-1 text-2xl font-bold text-white">
                My Subjects
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Organize your notes and revision material.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              <Icon name="plus" size={17} />
              New Subject
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>

              <button
                type="button"
                onClick={fetchSubjects}
                className="text-xs font-medium text-red-300 hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <SubjectsSkeleton />
          ) : subjects.length === 0 ? (
            <EmptySubjects
              onCreate={() => {
                setError("");
                setShowModal(true);
              }}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1B2638] bg-[#0D1421] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1B2638] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create Subject
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a subject to organize your revision.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creating}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubject}>
              <div className="space-y-5 p-6">
                <div>
                  <label
                    htmlFor="subject-name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Subject name
                  </label>

                  <input
                    id="subject-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Data Structures"
                    disabled={creating}
                    autoFocus
                    className="w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject-description"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Description
                    <span className="ml-2 text-xs font-normal text-slate-600">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="subject-description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="What are you studying?"
                    disabled={creating}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                  />
                </div>

                {/* Modal Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-[#1B2638] px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating || !form.name.trim()}
                  className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------------------
   Subject Card
--------------------------------------------- */

function SubjectCard({ subject, onClick }) {
  /*
   * Backend may eventually provide these values.
   * Until then, don't fake progress.
   */
  const progress = Number(subject.progress ?? subject.percentage ?? 0);

  const documentCount =
    subject._count?.documents ??
    subject.documents?.length ??
    subject.documentCount ??
    0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6 text-left transition hover:-translate-y-0.5 hover:border-[#33425B] hover:bg-[#111A2A]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
          <Icon name="book" size={21} />
        </div>

        <Icon
          name="arrow"
          size={18}
          className="text-slate-700 transition group-hover:text-violet-400"
        />
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        {subject.name}
      </h2>

      <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-500">
        {subject.description || "No description added yet."}
      </p>

      <div className="mt-6 flex items-center justify-between text-xs">
        <span className="text-slate-600">
          {documentCount} {documentCount === 1 ? "document" : "documents"}
        </span>

        <span className="font-medium text-violet-400">{progress}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all"
          style={{
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
          }}
        />
      </div>
    </button>
  );
}

/* ---------------------------------------------
   Empty State
--------------------------------------------- */

function EmptySubjects({ onCreate }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#263247] bg-[#0D1421] px-6 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
        <Icon name="book" size={25} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">No subjects yet</h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Create your first subject and start uploading notes for AI-powered
        revision.
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
      >
        Create your first subject
      </button>
    </div>
  );
}

/* ---------------------------------------------
   Loading Skeleton
--------------------------------------------- */

function SubjectsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="h-[245px] animate-pulse rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6"
        >
          <div className="h-11 w-11 rounded-xl bg-[#1B2638]" />

          <div className="mt-5 h-5 w-40 rounded bg-[#1B2638]" />

          <div className="mt-3 h-4 w-full rounded bg-[#1B2638]" />

          <div className="mt-2 h-4 w-3/4 rounded bg-[#1B2638]" />

          <div className="mt-8 h-3 w-full rounded bg-[#1B2638]" />
        </div>
      ))}
    </div>
  );
}

export default Subjects;
