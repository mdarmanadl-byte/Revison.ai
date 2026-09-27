import { useNavigate, useParams } from "react-router-dom";
import Icon from "../components/ui/Icon";
import SectionCard from "../components/ui/SectionCard";

function Document() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1200px]">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-xs text-slate-500 hover:text-white"
        >
          ← Back
        </button>

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-widest text-violet-400">
              Document
            </p>

            <h1 className="mt-2 text-2xl font-bold text-white">
              Chapter Notes
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Uploaded PDF • Document #{id}
            </p>
          </div>

          <button
            onClick={() => navigate(`/documents/${id}/quiz`)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
          >
            <Icon name="spark" size={17} />
            Start Quiz
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="AI Summary"
            description="Generated from your document"
          >
            <p className="text-sm leading-7 text-slate-400">
              This document contains the core concepts and important information
              that you need to revise. The AI-generated summary will appear here
              after processing.
            </p>
          </SectionCard>

          <SectionCard
            title="Key Concepts"
            description="Important concepts identified by AI"
          >
            <div className="space-y-2">
              {[
                "Core Concept",
                "Important Principle",
                "Problem Solving",
                "Applications",
              ].map((concept) => (
                <div
                  key={concept}
                  className="flex items-center gap-3 rounded-xl bg-[#090E18] p-3"
                >
                  <div className="h-2 w-2 rounded-full bg-violet-500" />

                  <span className="text-sm text-slate-300">{concept}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default Document;
