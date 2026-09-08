import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children, onCreateClick }) {
  return (
    <div className="min-h-screen bg-light text-gray font-sans selection:bg-brand selection:text-light">
      {/* Desktop Sidebar (≥1024px) */}
      <Sidebar />

      {/* Mobile Header & Bottom Tab Bar (<1024px) */}
      <MobileNav onCreateClick={onCreateClick} />

      {/* Main Content Area */}
      <div className="lg:pl-[270px] flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
