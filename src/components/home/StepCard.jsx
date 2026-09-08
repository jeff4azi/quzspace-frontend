export default function StepCard({ stepNumber, icon: Icon, title, description }) {
  return (
    <div className="relative group bg-white p-6 sm:p-8 rounded-2xl border border-muted/30 shadow-sm hover:shadow-xl hover:border-brand/40 transition-all duration-300 flex flex-col h-full">
      {/* Top row: Step badge & Icon */}
      <div className="flex items-center justify-between mb-6">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-brand font-bold text-xs">
          0{stepNumber}
        </span>
        <div className="w-12 h-12 rounded-xl bg-light text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-light transition-colors duration-300 shadow-sm">
          {Icon && <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-brand mb-3 group-hover:text-black transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray leading-relaxed flex-1">
        {description}
      </p>
    </div>
  );
}
