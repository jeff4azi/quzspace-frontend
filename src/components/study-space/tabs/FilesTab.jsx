import { useState } from "react";
import FileRow from "../FileRow";
import FilesEmptyState from "./FilesEmptyState";
import FileDropzone from "../../create-space/FileDropzone";
import Button from "../../ui/Button";
import { mockFiles } from "../../../data/mockFiles";
import { HiPlus, HiXMark } from "react-icons/hi2";

export default function FilesTab() {
  const [files, setFiles] = useState(mockFiles);
  const [showAddFiles, setShowAddFiles] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFilesSelected = (newFiles) => {
    setFiles((prev) => [...newFiles, ...prev]);
    setShowAddFiles(false);
  };

  const handleDeleteFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Row: Title, File Count & Add Files Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-brand tracking-tight">
            Uploaded Files
          </h2>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </div>

        <Button
          variant={showAddFiles ? "secondary" : "primary"}
          onClick={() => setShowAddFiles(!showAddFiles)}
          className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
        >
          {showAddFiles ? (
            <>
              <HiXMark className="w-4 h-4" />
              <span>Close Dropzone</span>
            </>
          ) : (
            <>
              <HiPlus className="w-4 h-4" />
              <span>Add Files</span>
            </>
          )}
        </Button>
      </div>

      {/* Expandable Inline Upload Dropzone */}
      {showAddFiles && (
        <div className="bg-white p-6 rounded-2xl border border-brand/30 shadow-md animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider">
              Upload New Documents
            </h3>
          </div>
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </div>
      )}

      {/* File List OR Empty State */}
      {files && files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onDelete={handleDeleteFile}
            />
          ))}
        </div>
      ) : (
        <FilesEmptyState onAddFilesClick={() => setShowAddFiles(true)} />
      )}

    </div>
  );
}
