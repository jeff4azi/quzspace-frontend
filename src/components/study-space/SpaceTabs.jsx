import { useSearchParams } from "react-router-dom";
import FilesTab from "./tabs/FilesTab";
import SummaryTab from "./tabs/SummaryTab";
import FlashcardsTab from "./tabs/FlashcardsTab";
import QuizTab from "./tabs/QuizTab";
import ChatTab from "./tabs/ChatTab";
import WeakAreasTab from "./tabs/WeakAreasTab";
import CommunityTab from "./tabs/CommunityTab";
import ProgressTab from "./tabs/ProgressTab";

import { 
  HiOutlineFolderOpen, 
  HiOutlineDocumentText, 
  HiOutlineRectangleStack, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineExclamationTriangle, 
  HiOutlineUsers,
  HiOutlineArrowTrendingUp 
} from "react-icons/hi2";

export const TABS_CONFIG = [
  { id: "files", label: "Files", icon: HiOutlineFolderOpen, component: FilesTab },
  { id: "summary", label: "Summary", icon: HiOutlineDocumentText, component: SummaryTab },
  { id: "flashcards", label: "Flashcards", icon: HiOutlineRectangleStack, component: FlashcardsTab },
  { id: "quiz", label: "Quiz", icon: HiOutlineQuestionMarkCircle, component: QuizTab },
  { id: "chat", label: "AI Chat", icon: HiOutlineChatBubbleLeftRight, component: ChatTab },
  { id: "weak-areas", label: "Weak Areas", icon: HiOutlineExclamationTriangle, component: WeakAreasTab },
  { id: "community", label: "Community", icon: HiOutlineUsers, component: CommunityTab },
  { id: "progress", label: "Progress", icon: HiOutlineArrowTrendingUp, component: ProgressTab },
];

export function getActiveTabComponent(tabId) {
  const tab = TABS_CONFIG.find((t) => t.id === tabId);
  return tab ? tab.component : SummaryTab;
}

export default function SpaceTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get("tab") || "summary";

  const handleTabClick = (id) => {
    setSearchParams({ tab: id }, { replace: true });
  };

  return (
    <div className="relative border-b border-muted/30 mb-6 pb-1">
      {/* Scrollable Container with Fade Edge Hint on Mobile */}
      <div className="relative after:absolute after:right-0 after:top-0 after:bottom-0 after:w-8 after:bg-gradient-to-l after:from-light after:to-transparent after:pointer-events-none lg:after:hidden">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-1 py-1">
          {TABS_CONFIG.map((tab) => {
            const isActive = activeTabId === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`
                  inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0
                  ${
                    isActive
                      ? "bg-brand text-light shadow-sm scale-[1.02]"
                      : "text-gray hover:bg-gray-200/60 hover:text-brand"
                  }
                `}
              >
                <TabIcon className={`w-4 h-4 ${isActive ? "text-light" : "text-gray"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
