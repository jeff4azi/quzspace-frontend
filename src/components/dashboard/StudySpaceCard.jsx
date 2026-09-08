import { Link } from "react-router-dom";
import { 
  HiOutlineDocumentText, 
  HiOutlineClock, 
  HiOutlineChevronRight,
  HiOutlineEllipsisHorizontal
} from "react-icons/hi2";

export default function StudySpaceCard({
  id,
  title,
  fileCount,
  lastAccessed,
  progressPercent,
  categoryBadge,
  badgeColor = "bg-brand/10 text-brand border-brand/20",
}) {
  return (
    <Link
      to={`/spaces/${id}`}
      className="group bg-white p-5 sm:p-6 rounded-2xl border border-muted/30 shadow-xs hover:shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
            {categoryBadge}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              alert(`Options for "${title}"`);
            }}
            className="text-gray hover:text-brand p-1 rounded-lg hover:bg-light transition-colors"
            aria-label="More options"
          >
            <HiOutlineEllipsisHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-brand group-hover:text-black transition-colors line-clamp-2 mb-3">
          {title}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray mb-5">
          <span className="flex items-center gap-1.5 font-medium">
            <HiOutlineDocumentText className="w-4 h-4 text-brand" />
            {fileCount} {fileCount === 1 ? "file" : "files"}
          </span>
          <span className="flex items-center gap-1.5">
            <HiOutlineClock className="w-4 h-4 text-muted" />
            {lastAccessed}
          </span>
        </div>
      </div>

      {/* Progress Bar & Footer Action */}
      <div className="space-y-2 pt-3 border-t border-muted/20">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-gray">Mastery Progress</span>
          <span className="text-brand font-bold">{progressPercent}%</span>
        </div>

        <div className="w-full bg-muted/20 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="pt-2 flex items-center justify-end text-xs font-bold text-brand group-hover:translate-x-1 transition-transform">
          <span>Open Space</span>
          <HiOutlineChevronRight className="w-4 h-4 ml-0.5" />
        </div>
      </div>
    </Link>
  );
}
