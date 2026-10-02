import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileRow from "../FileRow";
import FilesEmptyState from "./FilesEmptyState";
import FileDropzone from "../../create-space/FileDropzone";
import Button from "../../ui/Button";
import ErrorBanner from "../../shared/ErrorBanner";
import api from "../../../lib/api";
import { HiPlus, HiXMark } from "react-icons/hi2";

function formatSize(bytes) {
  if (!bytes || Number.isNaN(Number(bytes))) return "1.2 MB";
  const b = Number(bytes);
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadedAgo(isoDate) {
  if (!isoDate) return "Recently";
  try {
    const then = new Date(isoDate).getTime();
    if (Number.isNaN(then)) return "Recently";
    const now = Date.now();
    const diffMs = now - then;
    const day = 24 * 60 * 60 * 1000;
    if (diffMs < day) {
      const hours = Math.max(1, Math.floor(diffMs / (60 * 60 * 1000)));
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    return new Date(isoDate).toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function normalizeFile(f) {
  return {
    id: f.id || f.file_id || `f-${Math.random().toString(36).slice(2, 8)}`,
    name: f.name || f.original_name || f.title || "Untitled file",
    type: f.type || f.mime_type || f.extension || "",
    size: typeof f.size_bytes === "number" ? formatSize(f.size_bytes) : formatSize(f.size),
    uploadedAt:
      typeof f.created_at || f.uploaded_at
        ? formatUploadedAgo(f.created_at || f.uploaded_at)
        : f.uploadedAt || "Recently",
    status: f.status || f.extraction_status || "processed",
  };
}

function RowSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl border border-muted/30 shadow-xs animate-pulse">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}

export default function FilesTab() {
  const { id: spaceId } = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showAddFiles, setShowAddFiles] = useState(false);
  const [dropzoneError, setDropzoneError] = useState("");

  const loadFiles = useCallback(async () => {
    if (!spaceId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/spaces/${spaceId}/files`);
      const list = Array.isArray(res) ? res : res?.files || [];
      setFiles(list.map(normalizeFile));
    } catch (err) {
      console.warn("files tab load failed:", err?.message || err);
      setError({
        title: "Couldn't load your uploaded files",
        message:
          err?.status === 403
            ? "You don't have permission to see files in this shared space."
            : "Retry in a moment, or use Add Files to upload new documents.",
      });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [spaceId, reloadKey]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleFilesSelected = useCallback(
    async (newFiles) => {
      if (!spaceId) return;
      const optimistic = newFiles.map((f) => ({
        id: f.id,
        name: f.name,
        size: formatSize(f.size),
        type: f.type,
        uploadedAt: "Just now",
        status: "uploading",
      }));
      setFiles((prev) => [...optimistic, ...prev]);
      setShowAddFiles(false);
      let anySuccess = false;
      try {
        for (const f of newFiles) {
          if (!f?.rawFile) continue;
          try {
            const fd = new FormData();
            fd.append("file", f.rawFile, f.name);
            fd.append("title", f.name);
            await api.post(`/spaces/${spaceId}/files`, fd, {
              headers: { "Content-Type": "multipart/form-data" },
              idempotencyKey: `tab-file-${f.id}`,
            });
            anySuccess = true;
          } catch (e) {
            setFiles((prev) =>
              prev.map((row) =>
                row.id === f.id ? { ...row, status: "failed" } : row,
              ),
            );
          }
        }
      } finally {
        if (anySuccess) setTimeout(() => setReloadKey((n) => n + 1), 500);
      }
    },
    [spaceId],
  );

  const handleDeleteFile = useCallback(
    async (fileId) => {
      if (!spaceId) return;
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      try {
        await api.delete(`/spaces/${spaceId}/files/${fileId}`);
      } catch (err) {
        console.warn("file delete failed:", err?.message || err);
        setReloadKey((n) => n + 1);
      }
    },
    [spaceId],
  );

  if (loading) {
    return (
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="h-6 w-48 bg-gray-100 rounded" />
        <div className="h-10 w-40 bg-gray-100 rounded-xl" />
      </div>
      <div className="space-y-3">
        <RowSkeleton />
        <RowSkeleton />
        <RowSkeleton />
      </div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      
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

      {error && (
        <ErrorBanner
          title={error.title}
          message={error.message}
          onRetry={() => setReloadKey((n) => n + 1)}
        />
      )}

      {showAddFiles && (
        <div className="bg-white p-6 rounded-2xl border border-brand/30 shadow-md animate-in fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider">
              Upload New Documents
            </h3>
          </div>
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            errorMessage={dropzoneError}
            setErrorMessage={setDropzoneError}
          />
        </div>
      )}

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
      ) : !error ? (
        <FilesEmptyState onAddFilesClick={() => setShowAddFiles(true)} />
      ) : null}

    </div>
  );
}
