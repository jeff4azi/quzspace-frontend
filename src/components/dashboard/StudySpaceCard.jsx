import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  HiOutlineDocumentText, 
  HiOutlineClock, 
  HiOutlineChevronRight,
  HiOutlineEllipsisHorizontal,
  HiOutlineCpuChip,
  HiOutlineBeaker,
  HiOutlineAcademicCap,
  HiOutlineCalculator,
  HiOutlineBookOpen,
  HiOutlineFolder,
  HiOutlinePencil,
  HiOutlineShare,
  HiOutlineTrash
} from "react-icons/hi2";

// Subject icon resolver helper
function getSubjectIcon(subject = "") {
  const s = subject.toLowerCase();
  if (s.includes("computer") || s.includes("code")) return HiOutlineCpuChip;
  if (s.includes("chem")) return HiOutlineBeaker;
  if (s.includes("bio")) return HiOutlineAcademicCap;
  if (s.includes("math")) return HiOutlineCalculator;
  if (s.includes("hist")) return HiOutlineBookOpen;
  return HiOutlineFolder;
}

export default function StudySpaceCard({
  id,
  title,
  subject,
  fileCount,
  lastAccessed,
  progressPercent,
  accentStyle = "from-brand to-gray-700",
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const SubjectIcon = getSubjectIcon(subject);

  const handleDropdownAction = (e, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    alert(`${actionName} placeholder for "${title}"`);
  };

  return (
    <div className="relative group flex flex-col h-full">
      <Link
        to={`/spaces/${id}`}
        className="relative bg-white rounded-2xl border border-muted/30 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-brand/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentStyle}`} />

        <div className="space-y-4">
          {/* Top Row: Subject Tag Chip & Overflow Menu */}
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100/90 text-brand border border-muted/20">
              <SubjectIcon className="w-3.5 h-3.5 text-brand" />
              <span>{subject}</span>
            </span>

            {/* Overflow "•••" Dropdown Trigger */}
            <div className="relative z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="More space options"
              >
                <HiOutlineEllipsisHorizontal className="w-5 h-5" />
              </button>

              {/* Overflow Dropdown Menu */}
              {showDropdown && (
                <div 
                  className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-muted/30 p-1.5 z-50 animate-in fade-in"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <button
                    onClick={(e) => handleDropdownAction(e, "Rename")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <HiOutlinePencil className="w-4 h-4 text-gray-500" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={(e) => handleDropdownAction(e, "Share")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <HiOutlineShare className="w-4 h-4 text-gray-500" />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={(e) => handleDropdownAction(e, "Delete")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                  >
                    <HiOutlineTrash className="w-4 h-4 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title - Fixed Line Clamp & Focal Point */}
          <div>
            <h3 className="text-lg font-bold text-brand group-hover:text-black transition-colors line-clamp-2 leading-snug min-h-[3rem]">
              {title}
            </h3>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium mt-2">
              <span className="flex items-center gap-1.5">
                <HiOutlineDocumentText className="w-4 h-4 text-brand" />
                {fileCount} {fileCount === 1 ? "file" : "files"}
              </span>
              <span className="flex items-center gap-1.5">
                <HiOutlineClock className="w-4 h-4 text-muted" />
                {lastAccessed}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Area & Integrated Open Affordance */}
        <div className="space-y-3 pt-4 mt-4 border-t border-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-semibold">Mastery Progress</span>
            <span className="text-sm font-extrabold text-brand">{progressPercent}%</span>
          </div>

          {/* Thicker Progress Bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Action Affordance Button */}
          <div className="pt-1 flex items-center justify-end">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand bg-brand/5 group-hover:bg-brand group-hover:text-light px-3 py-1.5 rounded-xl transition-all duration-200">
              <span>Open Space</span>
              <HiOutlineChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
