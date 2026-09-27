import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import StatCard from "../components/ui/StatCard";
import SectionCard from "../components/ui/SectionCard";
import EmptyState from "../components/ui/EmptyState";
import { subjects, weakConcepts, recentActivity } from "../data/mockData";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1450px]">
        {/* Hero */}
        <section className="mb-9">
          <p className="mb-2 text-sm text-violet-400">Welcome back 👋</p>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Ready to revise?
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-[15px]">
            Continue where you left off and strengthen your weak concepts.
          </p>
        </section>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Subjects" value="3" description="Active subjects" />

          <StatCard
            title="Documents"
            value="19"
            description="Study materials"
          />

          <StatCard
            title="Quizzes Taken"
            value="24"
            description="Across all subjects"
          />

          <StatCard
            title="Study Streak"
            value="7 days"
            description="Keep it going"
          />
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
          {/* Subjects */}
          <SectionCard
            title="Your subjects"
            description="Continue studying your subjects."
            action={
              <button
                onClick={() => navigate("/subjects")}
                className="text-xs font-medium text-violet-400 hover:text-violet-300"
              >
                View all
              </button>
            }
          >
            <div className="space-y-3">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => navigate(`/subjects/${subject.id}`)}
                  className="group flex w-full items-center gap-4 rounded-xl border border-[#1B2638] bg-[#090E18] p-4 text-left transition hover:border-[#33425B] hover:bg-[#101827]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Icon name="book" size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="truncate text-sm font-semibold text-slate-200">
                        {subject.name}
                      </h3>

                      <span className="text-xs text-slate-500">
                        {subject.progress}%
                      </span>
                    </div>

                    <p className="mt-1 truncate text-xs text-slate-600">
                      {subject.description}
                    </p>

                    <div className="mt-3 h-1.5 rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                        style={{ width: `${subject.progress}%` }}
                      />
                    </div>
                  </div>

                  <Icon
                    name="arrow"
                    size={17}
                    className="text-slate-700 transition group-hover:text-violet-400"
                  />
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Weak concepts */}
          <SectionCard
            title="Weak concepts"
            description="Topics that need more practice."
            action={
              <button
                onClick={() => navigate("/weak-topics")}
                className="text-xs font-medium text-violet-400 hover:text-violet-300"
              >
                View all
              </button>
            }
          >
            <div className="space-y-3">
              {weakConcepts.map((concept) => (
                <div
                  key={concept.id}
                  className="rounded-xl border border-[#1B2638] bg-[#090E18] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {concept.name}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-600">
                        {concept.subject}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-red-400">
                      {concept.accuracy}%
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-red-500/70"
                      style={{ width: `${concept.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Recent activity */}
        <div className="mt-6">
          <SectionCard
            title="Recent activity"
            description="Your latest learning activity."
          >
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl px-3 py-3 hover:bg-white/[0.025]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon name="check" size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-300">
                      {activity.title}
                    </p>

                    <p className="mt-0.5 text-[11px] text-slate-600">
                      {activity.subject}
                    </p>
                  </div>

                  {activity.score && (
                    <span className="text-xs font-medium text-emerald-400">
                      {activity.score}
                    </span>
                  )}

                  <span className="text-[11px] text-slate-600">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
