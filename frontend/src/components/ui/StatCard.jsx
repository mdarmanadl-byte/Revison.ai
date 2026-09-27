function StatCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-[#1B2638] bg-[#0D1421] px-6 py-5 transition hover:border-[#29364D]">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-4 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-[11px] text-slate-600">{description}</p>
      )}
    </div>
  );
}

export default StatCard;
