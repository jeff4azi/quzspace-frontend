export default function FeatureCard({ icon: Icon, title, description, badge }) {
  return (
    <div className="group bg-light/60 p-6 sm:p-8 rounded-2xl border border-muted/30 hover:bg-white hover:border-brand/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header: Icon + optional badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-brand text-light flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            {Icon && <Icon className="w-6 h-6" />}
          </div>
          {badge && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand/10 text-brand">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-brand mb-2 group-hover:text-black transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-muted/20 flex items-center text-xs font-semibold text-brand opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Explore feature →</span>
      </div>
    </div>
  );
}
