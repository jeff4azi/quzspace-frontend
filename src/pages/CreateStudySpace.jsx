import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/shared/ErrorBanner";
import FileDropzone from "../components/create-space/FileDropzone";
import FileListItem from "../components/create-space/FileListItem";
import api from "../lib/api";
import { 
  HiArrowLeft, 
  HiOutlineDocumentArrowUp, 
  HiOutlineDocumentText, 
  HiOutlineCpuChip,
  HiSparkles,
  HiCheckCircle,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { CgSpinner } from "react-icons/cg";

const PROCESSING_STAGES = [
  { id: 0, title: "Uploading materials", desc: "Encrypting and uploading your study files securely..." },
  { id: 1, title: "Extracting text & concepts", desc: "Parsing document structure, tables, and key definitions..." },
  { id: 2, title: "Generating AI study suite", desc: "Creating smart summaries, active recall flashcards, and quizzes..." },
  { id: 3, title: "Ready!", desc: "Your personalized study space is ready to explore." },
];

const POLL_INTERVAL_MS = 1200;
const MAX_POLL_ATTEMPTS = 60;

function inferSubjectFromTitle(title = "") {
  const t = title.toLowerCase();
  if (t.includes("network") || t.includes("protocol") || t.includes("code") || t.includes("algorithm") || t.includes("data struct")) return "Computer Science";
  if (t.includes("chem") || t.includes("organic") || t.includes("reaction")) return "Chemistry";
  if (t.includes("bio") || t.includes("cell") || t.includes("gene") || t.includes("genetic")) return "Biology";
  if (t.includes("math") || t.includes("algebra") || t.includes("calculus") || t.includes("vector")) return "Mathematics";
  if (t.includes("hist") || t.includes("war") || t.includes("european") || t.includes("empire")) return "History";
  return "General";
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function CreateStudySpace() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState([]);
  const [pastedText, setPastedText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [processingError, setProcessingError] = useState(null);
  const [createdSpaceId, setCreatedSpaceId] = useState(null);
  const attemptRef = useRef(0);

  const handleFilesSelected = (newFiles) => {
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const isFormValid =
    title.trim().length > 0 &&
    ((activeTab === "files" && files.length > 0) ||
      (activeTab === "text" && pastedText.trim().length > 0));

  const resetProcessingState = () => {
    setIsProcessing(false);
    setCurrentStage(0);
    setProcessingError(null);
    setCreatedSpaceId(null);
    attemptRef.current = 0;
  };

  const pollFilesProcessed = useCallback(async (spaceId) => {
    let checks = 0;
    while (checks < MAX_POLL_ATTEMPTS) {
      checks++;
      try {
        const res = await api.get(`/spaces/${spaceId}/files`);
        const list = Array.isArray(res) ? res : res?.files || [];
        if (list.length === 0) {
          await sleep(POLL_INTERVAL_MS);
          continue;
        }
        const anyProcessed = list.some(
          (f) => f.status === "processed" || f.extraction_status === "processed" || f.status === "ready",
        );
        const allTerminal = list.every((f) =>
          ["processed", "ready", "failed", "error"].includes(
            f.status || f.extraction_status,
          ),
        );
        if (anyProcessed || allTerminal) return { done: true, list };
      } catch (err) {
        if (err?.status && err.status >= 500) {
          /* transient — ignore, retry */
        }
      }
      await sleep(POLL_INTERVAL_MS);
    }
    return { done: false, list: [] };
  }, []);

  const pollSummaryReady = useCallback(async (spaceId) => {
    let checks = 0;
    while (checks < MAX_POLL_ATTEMPTS) {
      checks++;
      try {
        await api.get(`/spaces/${spaceId}/summary`);
        return true;
      } catch (err) {
        const status = err?.status;
        if (status === 425) {
          await sleep(POLL_INTERVAL_MS);
          continue;
        }
        if (!status || status >= 500) {
          await sleep(POLL_INTERVAL_MS);
          continue;
        }
        return true;
      }
    }
    return true;
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!isFormValid) return;

      setIsProcessing(true);
      setCurrentStage(0);
      setProcessingError(null);

      let spaceId = null;
      try {
        const createRes = await api.post("/spaces", {
          title: title.trim(),
          subject: inferSubjectFromTitle(title),
        });
        spaceId = createRes?.id || createRes?.space_id;
        if (!spaceId) throw new Error("Space was created but no ID returned");
        setCreatedSpaceId(spaceId);

        if (activeTab === "files") {
          for (const file of files) {
            if (!file?.rawFile) continue;
            const fd = new FormData();
            fd.append("file", file.rawFile, file.name);
            fd.append("title", file.name);
            await api.post(`/spaces/${spaceId}/files`, fd, {
              headers: { "Content-Type": "multipart/form-data" },
              idempotencyKey: `file-${file.id}`,
            });
          }
        } else {
          await api.post(
            `/spaces/${spaceId}/text-upload`,
            {
              title: title.trim(),
              content: pastedText,
            },
            { idempotencyKey: `text-${spaceId}` },
          );
        }

        setCurrentStage(1);
        await pollFilesProcessed(spaceId);

        setCurrentStage(2);
        await pollSummaryReady(spaceId);

        setCurrentStage(3);
      } catch (err) {
        console.warn("create study space failed:", err?.message || err);
        setProcessingError({
          title: "Couldn't finish creating this study space",
          message:
            err?.status === 401 || err?.code === "HTTP_401"
              ? "Your session expired. Please sign in again and retry."
              : "Check the backend is running on port 5000, or retry in a moment. Your file selections are preserved so you can try again.",
        });
        if (spaceId) setCreatedSpaceId(spaceId);
      }
    },
    [activeTab, files, isFormValid, pastedText, pollFilesProcessed, pollSummaryReady, title],
  );

  useEffect(() => {
    if (!isProcessing) return;
    if (currentStage < 3) return;
    if (!createdSpaceId) return;
    const t = setTimeout(() => {
      navigate(`/spaces/${createdSpaceId}?tab=summary`, { replace: true });
    }, 1200);
    return () => clearTimeout(t);
  }, [isProcessing, currentStage, createdSpaceId, navigate]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-16 lg:pb-0">
        
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray hover:text-brand transition-colors mb-4"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
            Create a Study Space
          </h1>
          <p className="text-sm text-gray mt-1 leading-relaxed">
            Upload your lecture notes, slides, or PDFs. Our AI will automatically generate summaries, flashcard decks, and practice quizzes for you.
          </p>
        </div>

        {!isProcessing ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-muted/30 shadow-xs space-y-6 sm:space-y-8">
            
            <div className="space-y-2">
              <Input
                label="Step 1: Study Space Title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Computer Networks & Protocols"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand">
                Step 2: Add Study Material <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-2 p-1 rounded-xl bg-light border border-muted/30 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("files")}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all
                    ${
                      activeTab === "files"
                        ? "bg-white text-brand shadow-xs"
                        : "text-gray hover:text-brand"
                    }
                  `}
                >
                  <HiOutlineDocumentArrowUp className="w-4 h-4" />
                  <span>Upload Files</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("text")}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all
                    ${
                      activeTab === "text"
                        ? "bg-white text-brand shadow-xs"
                        : "text-gray hover:text-brand"
                    }
                  `}
                >
                  <HiOutlineDocumentText className="w-4 h-4" />
                  <span>Paste Text</span>
                </button>
              </div>

              {activeTab === "files" ? (
                <div className="space-y-4">
                  <FileDropzone
                    onFilesSelected={handleFilesSelected}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                  />

                  {files.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <p className="text-xs font-bold text-brand uppercase tracking-wider">
                        Attached Files ({files.length})
                      </p>
                      <div className="space-y-2">
                        {files.map((file) => (
                          <FileListItem
                            key={file.id}
                            file={file}
                            onRemove={handleRemoveFile}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your raw lecture notes, textbook excerpt, or study outline here..."
                    className="w-full p-4 rounded-xl border border-muted/40 text-sm text-brand placeholder:text-muted/70 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-y min-h-[200px]"
                  />
                  <div className="flex items-center justify-between text-xs text-gray">
                    <span>Guideline: Longer, detailed notes produce better flashcards.</span>
                    <span className="font-mono font-semibold">
                      {pastedText.length.toLocaleString()} characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-muted/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray">
                Processing typically takes 5–10 seconds depending on file length.
              </p>
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid}
                className="w-full sm:w-auto px-8 py-3.5"
              >
                <HiSparkles className="w-5 h-5 text-amber-400" />
                <span>Create Study Space</span>
              </Button>
            </div>

          </form>
        ) : processingError ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-muted/30 shadow-xs space-y-5">
            <ErrorBanner
              title={processingError.title}
              message={processingError.message}
            />
            {createdSpaceId && (
              <div className="text-xs text-gray bg-light/60 p-3 rounded-xl border border-muted/20">
                A partial space was created. You can{" "}
                <Link to={`/spaces/${createdSpaceId}`} className="text-brand font-bold underline">
                  open it anyway
                </Link>
                , or retry below.
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  resetProcessingState();
                  setTimeout(() => handleSubmit(), 0);
                }}
                className="w-full sm:w-auto"
              >
                <HiOutlineArrowRight className="w-4 h-4" />
                Retry Creation
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 sm:p-12 rounded-2xl border border-muted/30 shadow-xl text-center max-w-lg mx-auto space-y-8 my-6">
            
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full bg-brand/10 ${currentStage < 3 ? "animate-ping opacity-75" : ""}`} />
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-light shadow-lg transition-all duration-500 ${
                currentStage === 3 ? "bg-emerald-600 scale-110" : "bg-brand"
              }`}>
                {currentStage === 3 ? (
                  <HiCheckCircle className="w-12 h-12 text-white" />
                ) : (
                  <HiOutlineCpuChip className="w-10 h-10 animate-pulse text-amber-300" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-brand tracking-tight">
                {currentStage === 3 ? "Your Study Space is Ready!" : "Processing Your Material..."}
              </h2>
              <p className="text-sm text-gray max-w-sm mx-auto leading-relaxed">
                {PROCESSING_STAGES[currentStage].desc}
              </p>
            </div>

            <div className="bg-light/60 p-4 rounded-xl border border-muted/30 text-left space-y-3">
              {PROCESSING_STAGES.map((stage) => {
                const isDone = currentStage > stage.id;
                const isCurrent = currentStage === stage.id;

                return (
                  <div key={stage.id} className="flex items-center gap-3 text-xs">
                    <div className="shrink-0">
                      {isDone ? (
                        <HiCheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : isCurrent && currentStage < 3 ? (
                        <CgSpinner className="w-5 h-5 text-brand animate-spin" />
                      ) : isCurrent && currentStage === 3 ? (
                        <HiCheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted/40 flex items-center justify-center text-[10px] font-bold text-gray">
                          {stage.id + 1}
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-semibold ${
                        isDone || isCurrent ? "text-brand" : "text-muted"
                      }`}
                    >
                      {stage.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {currentStage === 3 && (
              <div className="pt-2 animate-in fade-in">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() =>
                    navigate(`/spaces/${createdSpaceId}?tab=summary`, { replace: true })
                  }
                  className="py-4 text-base font-bold shadow-lg"
                >
                  <span>Go to Study Space</span>
                  <HiOutlineArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}

          </div>
        )}

      </div>
    </AppLayout>
  );
}
