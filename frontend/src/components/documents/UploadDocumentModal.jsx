import { useRef, useState } from "react";
import { uploadDocument } from "../../api/documnets";

function UploadDocumentModal({
  subjectId,
  topics = [],
  open,
  onClose,
  onUploaded,
}) {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [topicId, setTopicId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const result = await uploadDocument(subjectId, file, topicId || null);

      onUploaded?.(result);

      setFile(null);
      setTopicId("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (uploading) return;

    setFile(null);
    setTopicId("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#1B2638] bg-[#0D1421] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1B2638] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-white">Upload Notes</h2>

            <p className="mt-1 text-sm text-slate-400">
              Upload a PDF to generate AI-powered revision material.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={uploading}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* File picker */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              PDF File
            </label>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-xl border border-dashed border-[#334155] bg-[#090E18] px-6 py-8 text-center transition hover:border-violet-500 hover:bg-violet-500/5 disabled:cursor-not-allowed"
            >
              {file ? (
                <>
                  <div className="text-sm font-medium text-white">
                    {file.name}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </>
              ) : (
                <>
                  <div className="text-3xl">↑</div>

                  <div className="mt-2 text-sm font-medium text-slate-200">
                    Choose PDF
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Click to browse your files
                  </div>
                </>
              )}
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Topic */}
          {topics.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Topic
                <span className="ml-2 text-xs text-slate-500">Optional</span>
              </label>

              <select
                value={topicId}
                onChange={(event) => setTopicId(event.target.value)}
                disabled={uploading}
                className="w-full rounded-xl border border-[#1B2638] bg-[#090E18] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500"
              >
                <option value="">Let AI suggest a topic</option>

                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Error */}
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
            onClick={handleClose}
            disabled={uploading}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Processing..." : "Upload Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadDocumentModal;
