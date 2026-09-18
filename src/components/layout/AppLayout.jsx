import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({
  children,
  onCreateClick,
  hideBottomNav = false,
  hideSidebar = false,
}) {
  return (
    <div className="min-h-screen bg-light text-gray font-sans selection:bg-brand selection:text-light">
      {/* Desktop Sidebar (≥1024px) */}
      {!hideSidebar && <Sidebar />}

      {/* Mobile Header & Bottom Tab Bar (<1024px) */}
      <MobileNav onCreateClick={onCreateClick} hideBottomNav={hideBottomNav} />

      {/* Main Content Area */}
      <div
        className={`${!hideSidebar ? "lg:pl-[270px]" : ""} flex flex-col min-h-screen`}
      >
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:pb-8">
          {children}
          {/* Mobile Bottom Navigation Clearance Spacer — only when nav is visible */}
          {!hideBottomNav && (
            <div className="h-32 lg:hidden" aria-hidden="true" />
          )}
        </main>
      </div>
    </div>
  );
}
