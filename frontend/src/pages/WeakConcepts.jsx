import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import { weakConcepts } from "../data/mockData";

function WeakConcepts() {
  const navigate = useNavigate();

  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8">
          <p className="text-sm text-violet-400">AI Intelligence</p>

          <h1 className="mt-1 text-2xl font-bold text-white">Weak Concepts</h1>

          <p className="mt-2 text-sm text-slate-500">
            Concepts where your quiz performance needs improvement.
          </p>
        </div>

        <div className="space-y-3">
          {weakConcepts.map((concept) => (
            <div
              key={concept.id}
              className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <Icon name="brain" size={20} />
                </div>

                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-white">
                    {concept.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    {concept.subject}
                  </p>

                  <div className="mt-3 h-1.5 max-w-md rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-red-500/70"
                      style={{ width: `${concept.accuracy}%` }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-red-400">
                    {concept.accuracy}%
                  </p>

                  <p className="text-[10px] text-slate-600">accuracy</p>
                </div>

                <button
                  onClick={() => navigate("/quizzes")}
                  className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300 hover:bg-violet-500/15"
                >
                  Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeakConcepts;
