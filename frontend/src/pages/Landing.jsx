import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-gray-900 overflow-hidden">
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-black tracking-tight"
        >
          Revise<span className="text-gray-400">AI</span>
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-black transition">
            Features
          </a>

          <a href="#how-it-works" className="hover:text-black transition">
            How it works
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black transition"
          >
            Log in
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-gray-600 mb-8 shadow-sm">
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            AI-powered revision for students
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
            Turn your notes into
            <span className="block text-gray-400">your personal AI tutor.</span>
          </h1>

          <p className="max-w-2xl mx-auto mt-7 text-lg md:text-xl text-gray-500 leading-relaxed">
            Upload your notes. Revise with AI. Test yourself. ReviseAI
            transforms your study material into summaries, concepts, questions
            and personalized quizzes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
            <button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto px-7 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition shadow-lg"
            >
              Start Revising — It's Free
            </button>

            <button
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-7 py-4 bg-white border border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* PRODUCT PREVIEW */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-black rounded-[2rem] p-3 shadow-2xl">
            <div className="bg-[#f7f8fc] rounded-[1.5rem] overflow-hidden">
              {/* Fake browser header */}
              <div className="h-12 bg-white border-b border-gray-100 flex items-center px-5 gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="w-3 h-3 rounded-full bg-gray-200" />

                <div className="hidden sm:block mx-auto bg-gray-50 rounded-lg px-16 py-2 text-xs text-gray-400">
                  app.reviseai.com
                </div>
              </div>

              {/* Fake dashboard */}
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      YOUR DASHBOARD
                    </p>

                    <h3 className="text-2xl font-bold mt-1">Keep learning.</h3>
                  </div>

                  <div className="hidden sm:flex bg-black text-white rounded-xl px-4 py-2 text-sm font-medium">
                    + Upload Notes
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <PreviewCard
                    title="Data Structures"
                    value="82%"
                    subtitle="Overall progress"
                  />

                  <PreviewCard
                    title="Machine Learning"
                    value="74%"
                    subtitle="Overall progress"
                  />

                  <PreviewCard
                    title="Operating Systems"
                    value="91%"
                    subtitle="Overall progress"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                      Weak concepts
                    </p>

                    <div className="mt-5 space-y-3">
                      <WeakConcept name="Dynamic Programming" accuracy="42%" />

                      <WeakConcept name="Graph Traversal" accuracy="56%" />

                      <WeakConcept name="Binary Trees" accuracy="63%" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                      AI recommendation
                    </p>

                    <h4 className="font-bold mt-4">
                      Focus on Dynamic Programming
                    </h4>

                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      Your recent quizzes show that this concept needs more
                      revision.
                    </p>

                    <button className="mt-5 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-semibold">
                      Start personalized quiz →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Everything in one place
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">
              Your notes become
              <span className="text-gray-400"> interactive.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-14">
            <FeatureCard
              number="01"
              title="AI understands your notes"
              description="Upload your study material and let AI identify topics, concepts and important information."
            />

            <FeatureCard
              number="02"
              title="Revise with context"
              description="Ask questions and get answers grounded in the material you actually uploaded."
            />

            <FeatureCard
              number="03"
              title="Practice intelligently"
              description="Take quizzes and track which concepts you understand and which ones need work."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Simple workflow
            </p>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-3">
              From notes to mastery.
            </h2>

            <p className="text-gray-500 mt-5 text-lg">
              No complicated setup. Just upload what you're studying and start
              revising.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5 mt-16">
            <Step
              number="01"
              title="Upload"
              text="Upload your chapter, lecture notes or study material."
            />

            <Step
              number="02"
              title="Understand"
              text="ReviseAI extracts topics, concepts and important points."
            />

            <Step
              number="03"
              title="Practice"
              text="Test your understanding with AI-generated questions."
            />

            <Step
              number="04"
              title="Improve"
              text="Identify weak concepts and focus your next revision."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto bg-black rounded-[2rem] px-8 py-16 md:py-20 text-center text-white">
          <p className="text-gray-400 font-medium">
            Ready to study differently?
          </p>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight mt-3">
            Your next revision
            <span className="text-gray-500"> starts here.</span>
          </h2>

          <button
            onClick={() => navigate("/signup")}
            className="mt-8 px-7 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition"
          >
            Create your free account →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-black text-lg">
            Revise<span className="text-gray-400">AI</span>
          </div>

          <p className="text-sm text-gray-400">
            Learn smarter. Remember longer.
          </p>
        </div>
      </footer>
    </div>
  );
}

function PreviewCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-700">{title}</p>

      <p className="text-3xl font-black mt-4">{value}</p>

      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>

      <div className="mt-4 h-1.5 bg-gray-100 rounded-full">
        <div
          className="h-full bg-black rounded-full"
          style={{
            width: value,
          }}
        />
      </div>
    </div>
  );
}

function WeakConcept({ name, accuracy }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">Needs revision</p>
      </div>

      <span className="text-sm font-bold text-gray-700">{accuracy}</span>
    </div>
  );
}

function FeatureCard({ number, title, description }) {
  return (
    <div className="rounded-3xl bg-[#f7f8fc] p-7 border border-gray-100">
      <span className="text-sm font-black text-gray-300">{number}</span>

      <h3 className="text-xl font-bold mt-10">{title}</h3>

      <p className="text-gray-500 leading-relaxed mt-3">{description}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="border-t-2 border-black pt-5">
      <p className="text-sm font-black">{number}</p>

      <h3 className="text-xl font-bold mt-6">{title}</h3>

      <p className="text-gray-500 mt-3 leading-relaxed">{text}</p>
    </div>
  );
}

export default Landing;
