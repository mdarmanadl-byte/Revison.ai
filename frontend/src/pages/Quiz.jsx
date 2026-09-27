import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";

const questions = [
  {
    question: "What is the primary purpose of a hash table?",
    options: [
      "Sorting data",
      "Fast key-value lookup",
      "Compressing data",
      "Rendering UI",
    ],
    answer: 1,
  },
  {
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Linked List", "Stack", "Graph"],
    answer: 2,
  },
  {
    question: "Which traversal uses a queue?",
    options: ["DFS", "BFS", "Inorder", "Postorder"],
    answer: 1,
  },
];

function Quiz() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);

  const question = questions[current];

  function next() {
    const updated = [...answers, selected];
    setAnswers(updated);
    setSelected(null);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/progress");
    }
  }

  return (
    <div className="px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[850px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-violet-400">
              AI Quiz
            </p>

            <h1 className="mt-2 text-2xl font-bold text-white">
              Test your understanding
            </h1>
          </div>

          <span className="text-sm text-slate-500">
            {current + 1} / {questions.length}
          </span>
        </div>

        <div className="mb-8 h-1.5 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        <div className="rounded-2xl border border-[#1B2638] bg-[#0D1421] p-6 sm:p-8">
          <p className="text-lg font-semibold leading-8 text-white">
            {question.question}
          </p>

          <div className="mt-7 space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => setSelected(index)}
                className={`
                  flex w-full items-center gap-4 rounded-xl border p-4 text-left
                  transition
                  ${
                    selected === index
                      ? "border-violet-500 bg-violet-500/10 text-white"
                      : "border-[#1B2638] bg-[#090E18] text-slate-400 hover:border-[#33425B]"
                  }
                `}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-current text-xs">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="text-sm">{option}</span>
              </button>
            ))}
          </div>

          <button
            disabled={selected === null}
            onClick={next}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-violet-500"
          >
            {current === questions.length - 1 ? "Finish Quiz" : "Next Question"}

            <Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
