import { useEffect, useState } from "react";
import { 
  HiOutlineDocumentText, 
  HiOutlinePhoto, 
  HiOutlineDocumentCheck,
  HiCheckCircle,
  HiXMark
} from "react-icons/hi2";

export default function FileListItem({ file, onRemove }) {
  const [progress, setProgress] = useState(file.progress || 0);
  const [isComplete, setIsComplete] = useState(file.isComplete || false);

  // Format bytes into KB/MB string
  const formatSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "1.2 MB";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Determine file badge icon and color based on extension
  const getFileBadge = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") {
      return { icon: HiOutlineDocumentText, color: "bg-rose-100 text-rose-700 border-rose-200", label: "PDF" };
    }
    if (ext === "docx" || ext === "doc") {
      return { icon: HiOutlineDocumentText, color: "bg-blue-100 text-blue-700 border-blue-200", label: "DOCX" };
    }
    if (ext === "pptx" || ext === "ppt") {
      return { icon: HiOutlineDocumentText, color: "bg-amber-100 text-amber-700 border-amber-200", label: "PPTX" };
    }
    if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
      return { icon: HiOutlinePhoto, color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "IMG" };
    }
    return { icon: HiOutlineDocumentCheck, color: "bg-gray-100 text-gray-700 border-gray-200", label: "TXT" };
  };

  const badge = getFileBadge(file.name);
  const BadgeIcon = badge.icon;

  // Simulate upload progress over 1.2s
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 25;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <div className="bg-white p-3.5 rounded-xl border border-muted/30 shadow-xs flex items-center justify-between gap-3 transition-all">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Type Badge Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${badge.color}`}>
          <BadgeIcon className="w-5 h-5" />
        </div>

        {/* File Details & Progress Bar */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-brand truncate" title={file.name}>
              {file.name}
            </p>
            <span className="text-[11px] font-medium text-gray shrink-0">
              {formatSize(file.size)}
            </span>
          </div>

          {/* Upload Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted/20 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isComplete ? "bg-emerald-500" : "bg-brand"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray shrink-0 w-8 text-right">
              {isComplete ? "100%" : `${progress}%`}
            </span>
          </div>
        </div>
      </div>

      {/* Right State Icon or Remove Button */}
      <div className="flex items-center gap-1 shrink-0">
        {isComplete && (
          <HiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        )}
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="p-1 text-gray hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          aria-label="Remove file"
        >
          <HiXMark className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
