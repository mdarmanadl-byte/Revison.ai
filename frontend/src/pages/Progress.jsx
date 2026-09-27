import SectionCard from "../components/ui/SectionCard";
import StatCard from "../components/ui/StatCard";

function Progress() {
  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1450px]">
        <div className="mb-8">
          <p className="text-sm text-slate-500">Analytics</p>

          <h1 className="mt-1 text-2xl font-bold text-white">Your Progress</h1>

          <p className="mt-2 text-sm text-slate-500">
            Track your learning and quiz performance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Average Score" value="78%" />
          <StatCard title="Questions" value="186" />
          <StatCard title="Correct" value="145" />
          <StatCard title="Streak" value="7 days" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Subject performance"
            description="Your current performance by subject."
          >
            <div className="space-y-5">
              {[
                ["Data Structures", 82],
                ["Machine Learning", 68],
                ["Database Systems", 75],
              ].map(([name, score]) => (
                <div key={name}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">{name}</span>
                    <span className="text-slate-500">{score}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Learning overview"
            description="Your revision activity."
          >
            <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-[#1B2638]">
              <p className="text-sm text-slate-600">
                Activity chart will appear here
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default Progress;
