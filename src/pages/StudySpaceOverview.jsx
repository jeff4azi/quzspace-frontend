import { useParams, useSearchParams, Link } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import SpaceTabs, { getActiveTabComponent } from "../components/study-space/SpaceTabs";
import Button from "../components/ui/Button";
import { getSpaceById } from "../data/mockActiveSpace";
import { 
  HiArrowLeft, 
  HiOutlineDocumentText, 
  HiOutlineClock, 
  HiOutlineCalendar,
  HiOutlineShare,
  HiOutlineSparkles
} from "react-icons/hi2";

export default function StudySpaceOverview() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  
  const space = getSpaceById(id);
  const activeTabId = searchParams.get("tab") || "summary";
  const ActiveTabComponent = getActiveTabComponent(activeTabId);

  const handleShare = () => {
    alert("Share Study Space placeholder.");
  };

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        
        {/* Header Section */}
        <div className="space-y-4">
          
          {/* Top row: Back link + Share Button */}
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray hover:text-brand transition-colors"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            {/* Share Button (Desktop top-right) */}
            <Button
              variant="secondary"
              onClick={handleShare}
              className="py-1.5 px-3.5 text-xs font-bold"
            >
              <HiOutlineShare className="w-4 h-4" />
              <span>Share Space</span>
            </Button>
          </div>

          {/* Title & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className={`self-start text-xs font-bold px-2.5 py-1 rounded-full border ${space.badgeColor}`}>
              {space.categoryBadge}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand tracking-tight">
              {space.title}
            </h1>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray pt-1">
            <span className="flex items-center gap-1.5 font-semibold text-brand">
              <HiOutlineDocumentText className="w-4 h-4" />
              {space.fileCount} {space.fileCount === 1 ? "file" : "files"}
            </span>

            <span className="flex items-center gap-1.5">
              <HiOutlineClock className="w-4 h-4 text-muted" />
              Last active {space.lastAccessed}
            </span>

            <span className="flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4 text-muted" />
              Created {space.createdDate}
            </span>

            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <HiOutlineSparkles className="w-3.5 h-3.5 text-emerald-600" />
              {space.progressPercent}% Mastery
            </span>
          </div>

        </div>

        {/* Tab Navigation */}
        <SpaceTabs />

        {/* Dynamic Tab Content Area */}
        <div className="min-h-[300px]">
          <ActiveTabComponent />
        </div>

      </div>
    </AppLayout>
  );
}
