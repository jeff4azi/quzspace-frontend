import { useRef, useState } from "react";
import { 
  HiOutlineDocumentArrowUp, 
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiExclamationTriangle
} from "react-icons/hi2";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc", "pptx", "ppt", "txt", "png", "jpg", "jpeg", "webp"];

export default function FileDropzone({ onFilesSelected, errorMessage, setErrorMessage }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    if (setErrorMessage) setErrorMessage("");

    const validFiles = [];
    const invalidFiles = [];

    Array.from(fileList).forEach((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        validFiles.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          isComplete: false,
        });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0 && setErrorMessage) {
      setErrorMessage(`Unsupported format: ${invalidFiles.join(", ")}. Accepted formats: PDF, DOCX, PPTX, TXT, Images.`);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // reset input value so re-selecting same file triggers change
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Dashed Dropzone Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-200
          ${
            isDragging
              ? "border-brand bg-brand/10 shadow-lg scale-[1.01]"
              : "border-muted/40 bg-white hover:border-brand hover:bg-light/40"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.pptx,.ppt,.txt,image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
            isDragging ? "bg-brand text-light" : "bg-brand/10 text-brand"
          }`}>
            <HiOutlineDocumentArrowUp className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-bold text-brand mb-1">
              <span className="underline decoration-muted underline-offset-4">Click to upload</span> or drag and drop files
            </p>
            <p className="text-xs text-gray">
              Upload your lecture notes, slides, textbook PDFs, or document images
            </p>
          </div>

          {/* Supported Formats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              <HiOutlineDocumentText className="w-3.5 h-3.5" /> PDF
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              <HiOutlineDocumentText className="w-3.5 h-3.5" /> DOCX
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
              <HiOutlineDocumentText className="w-3.5 h-3.5" /> PPTX
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              <HiOutlinePhoto className="w-3.5 h-3.5" /> Images
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
              TXT
            </span>
          </div>
        </div>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
          <HiExclamationTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
