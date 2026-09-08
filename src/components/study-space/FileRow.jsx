import { useState } from "react";
import { 
  HiOutlineDocumentText, 
  HiOutlinePhoto, 
  HiOutlineDocumentCheck,
  HiOutlineEllipsisHorizontal,
  HiOutlinePencil,
  HiOutlineArrowDownTray,
  HiOutlineTrash,
  HiCheckCircle
} from "react-icons/hi2";

function getFileTypeBadge(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  const type = file.type?.toLowerCase() || ext;

  if (type === "pdf" || ext === "pdf") {
    return { icon: HiOutlineDocumentText, color: "bg-rose-100 text-rose-700 border-rose-200", label: "PDF" };
  }
  if (type === "docx" || ext === "docx" || ext === "doc") {
    return { icon: HiOutlineDocumentText, color: "bg-blue-100 text-blue-700 border-blue-200", label: "DOCX" };
  }
  if (type === "pptx" || ext === "pptx" || ext === "ppt") {
    return { icon: HiOutlineDocumentText, color: "bg-amber-100 text-amber-700 border-amber-200", label: "PPTX" };
  }
  if (["image", "png", "jpg", "jpeg", "webp"].includes(type) || ["png", "jpg", "jpeg", "webp"].includes(ext)) {
    return { icon: HiOutlinePhoto, color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "IMG" };
  }
  return { icon: HiOutlineDocumentCheck, color: "bg-gray-100 text-gray-700 border-gray-200", label: "TXT" };
}

export default function FileRow({ file, onDelete, onDownload, onRename }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const badge = getFileTypeBadge(file);
  const BadgeIcon = badge.icon;

  const handleAction = (e, actionCallback, actionName) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    if (actionCallback) {
      actionCallback(file.id);
    } else {
      alert(`${actionName} placeholder for "${file.name}"`);
    }
  };

  return (
    <div className="group bg-white p-4 rounded-xl border border-muted/30 shadow-xs hover:border-brand/40 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      
      {/* Left: Type Icon + File Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Type Badge Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${badge.color}`}>
          <BadgeIcon className="w-5 h-5" />
        </div>

        {/* File Name & Metadata */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-brand truncate" title={file.name}>
            {file.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium mt-0.5">
            <span>{file.size}</span>
            <span>•</span>
            <span>Uploaded {file.uploadedAt}</span>
          </div>
        </div>
      </div>

      {/* Right: Status Pill & Overflow Menu */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-muted/20">
        
        {/* Status Pill */}
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <HiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Processed</span>
        </span>

        {/* Overflow "•••" Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="File options"
          >
            <HiOutlineEllipsisHorizontal className="w-5 h-5" />
          </button>

          {/* Dropdown Menu Popover */}
          {showDropdown && (
            <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-muted/30 p-1.5 z-50 animate-in fade-in">
              <button
                onClick={(e) => handleAction(e, onDownload, "Download")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <HiOutlineArrowDownTray className="w-4 h-4 text-gray-500" />
                <span>Download</span>
              </button>
              <button
                onClick={(e) => handleAction(e, onRename, "Rename")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <HiOutlinePencil className="w-4 h-4 text-gray-500" />
                <span>Rename</span>
              </button>
              <button
                onClick={(e) => handleAction(e, onDelete, "Delete")}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
              >
                <HiOutlineTrash className="w-4 h-4 text-rose-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
