import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Icon from "../components/ui/Icon";
import api from "../api/api";
import { uploadDocument } from "../api/documents";

function Subject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const subjectId = Number(id);

  const fetchSubject = useCallback(async () => {
    if (!Number.isInteger(subjectId)) {
      setError("Invalid subject ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/subjects/${subjectId}`);

      if (!response.data?.success || !response.data?.subject) {
        throw new Error("Invalid subject response from server.");
      }

      setSubject(response.data.subject);
    } catch (err) {
      console.error("Failed to load subject:", err);

      if (err.response?.status === 404) {
        setError(
          err.response?.data?.message ||
            "Subject not found. It may have been deleted or does not belong to this account.",
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load subject.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  const handleUploadClick = () => {
    setUploadMessage("");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (file.type !== "application/pdf") {
      setUploadMessage("Only PDF files are supported.");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage("");

      const response = await uploadDocument(subjectId, file);

      if (!response?.success) {
        throw new Error(response?.message || "Failed to upload document.");
      }

      setUploadMessage("Notes uploaded successfully.");

      await fetchSubject();
    } catch (err) {
      console.error("Upload error:", err);

      setUploadMessage(
        err.response?.data?.message || err.message || "Failed to upload notes.",
      );
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1450px]">
          <button
            type="button"
            onClick={() => navigate("/subjects")}
            className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <Icon name="arrow-left" size={16} />
            Back to subjects
          </button>

          <div className="animate-pulse">
            <div className="h-8 w-64 rounded-lg bg-[#111A2A]" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-[#111A2A]" />

            <div className="mt-10 h-48 rounded-2xl border border-[#1B2638] bg-[#0D1421]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1450px]">
          <button
            type="button"
            onClick={() => navigate("/subjects")}
            className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <Icon name="arrow-left" size={16} />
            Back to subjects
          </button>

          <div className="rounded-2xl border border-red-500/30 bg-[#0D1421] p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <Icon name="alert" size={22} />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-white">
              Unable to load subject
            </h1>

            <p className="mt-2 text-sm text-red-400">
              {error || "Subject not found"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchSubject}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                Try again
              </button>

              <button
                type="button"
                onClick={() => navigate("/subjects")}
                className="rounded-xl border border-[#263247] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                View all subjects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const documents = Array.isArray(subject.documents) ? subject.documents : [];

  const topics = Array.isArray(subject.topics) ? subject.topics : [];

  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1450px]">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/subjects")}
          className="mb-8 flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >
          <Icon name="arrow-left" size={16} />
          Back to subjects
        </button>

        {/* Subject Header */}
        <section className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Icon name="book" size={26} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-violet-400">
                  Subject
                </p>

                <h1 className="mt-1 text-2xl font-bold text-white">
                  {subject.name}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {subject.description || "No description added yet."}
                </p>
              </div>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="plus" size={17} />
                {uploading ? "Uploading..." : "Upload Notes"}
              </button>
            </div>
          </div>

          {uploadMessage && (
            <div className="mt-5 rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-slate-300">
              {uploadMessage}
            </div>
          )}
        </section>

        {/* Documents */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
                Workspace
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Documents
              </h2>
            </div>

            <span className="text-sm text-slate-600">
              {documents.length}{" "}
              {documents.length === 1 ? "document" : "documents"}
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#263247] bg-[#0D1421] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Icon name="file" size={25} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No documents yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Upload your notes or chapter PDF and ReviseAI will analyze them
                for revision.
              </p>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading}
                className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload your first PDF"}
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => navigate(`/documents/${document.id}`)}
                  className="group rounded-2xl border border-[#1B2638] bg-[#0D1421] p-5 text-left transition hover:-translate-y-0.5 hover:border-[#33425B] hover:bg-[#111A2A]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon name="file" size={19} />
                    </div>

                    <Icon
                      name="arrow"
                      size={17}
                      className="text-slate-700 transition group-hover:text-violet-400"
                    />
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-sm font-semibold text-white">
                    {document.title || document.file_name}
                  </h3>

                  <p className="mt-2 truncate text-xs text-slate-600">
                    {document.file_name}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      {document.status || "Uploaded"}
                    </span>

                    <span className="text-xs font-medium text-violet-400">
                      Open
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Topics */}
        <section className="mt-10">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
              AI Organization
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">Topics</h2>
          </div>

          {topics.length === 0 ? (
            <div className="rounded-2xl border border-[#1B2638] bg-[#0D1421] px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Icon name="brain" size={22} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-white">
                No topics yet
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Topics will appear here after your notes are processed.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-5"
                >
                  <h3 className="font-semibold text-white">{topic.name}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {topic.description || "No description available."}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      {Array.isArray(topic.concepts)
                        ? topic.concepts.length
                        : 0}{" "}
                      concepts
                    </span>

                    <span className="text-violet-400">AI generated</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Subject;
