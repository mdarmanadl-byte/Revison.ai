import Icon from "./Icon";

function EmptyState({ icon = "file", title, description, action }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[#1B2638] bg-[#090E18]/50 px-6 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        <Icon name={icon} size={20} />
      </div>

      <h3 className="text-sm font-semibold text-slate-300">{title}</h3>

      <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-600">
        {description}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
