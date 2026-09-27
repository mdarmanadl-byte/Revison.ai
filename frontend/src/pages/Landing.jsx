import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <nav className="flex h-20 items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
            <Icon name="brain" size={22} />
          </div>

          <span className="text-lg font-bold">
            Revise<span className="text-violet-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium hover:bg-violet-500"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs text-violet-300">
            <Icon name="spark" size={14} />
            AI-powered revision
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Study smarter.
            <br />
            <span className="text-violet-400">Remember more.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500">
            Upload your notes, understand important concepts, practice with
            AI-generated quizzes and track your learning progress.
          </p>

          <button
            onClick={() => navigate("/signup")}
            className="mt-8 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Start learning
          </button>
        </div>
      </main>
    </div>
  );
}

export default Landing;
