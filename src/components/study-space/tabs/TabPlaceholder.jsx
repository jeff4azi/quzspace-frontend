export default function TabPlaceholder({ icon: Icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl border border-muted/30 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs my-6 space-y-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}

      <div>
        <h3 className="text-xl font-extrabold text-brand tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-xs text-muted font-bold uppercase tracking-wider mb-2">
          Module Coming Soon
        </p>
        <p className="text-sm text-gray leading-relaxed">
          {description || "Interactive content for this study module will be available in the next release."}
        </p>
      </div>
    </div>
  );
}
