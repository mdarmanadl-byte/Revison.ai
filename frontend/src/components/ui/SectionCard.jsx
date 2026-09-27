function SectionCard({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`
        rounded-2xl border border-[#1B2638]
        bg-[#0D1421] p-6
        ${className}
      `}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-semibold text-white">{title}</h2>

          {description && (
            <p className="mt-1.5 text-sm text-slate-500">{description}</p>
          )}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

export default SectionCard;
