import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/Quzspace_logo.png";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import {
  HiOutlineSquare2Stack,
  HiOutlineCog6Tooth,
  HiPlus,
} from "react-icons/hi2";
import { useAuth } from "../../hooks/useAuth";

function computeAvatarInitials(name, email, fallbackInitials = "??") {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || parts[0]?.[1] || "";
    return (first + second).toUpperCase() || fallbackInitials;
  }
  if (email) {
    return email[0]?.toUpperCase() + (email.split("@")[0]?.[1]?.toUpperCase() || "") || fallbackInitials;
  }
  return fallbackInitials;
}

export default function MobileNav({ onCreateClick, hideBottomNav = false }) {
  const { scrollDirection, isAtTop } = useScrollDirection();
  const { profile, user } = useAuth();

  const isHeaderHidden = scrollDirection === "down" && !isAtTop;

  const displayName = profile?.name || user?.user_metadata?.name || "You";
  const avatarColor = profile?.avatarColor || "bg-brand";
  const avatarInitials = profile?.avatarInitials
    || computeAvatarInitials(displayName, user?.email);

  return (
    <>
      <header
        className={`
          sticky top-0 z-30 px-4 py-3 flex items-center justify-between lg:hidden
          transition-all duration-300 ease-out
          ${isHeaderHidden ? "-translate-y-full" : "translate-y-0"}
          ${
            isAtTop
              ? "bg-white border-b border-transparent shadow-none"
              : "bg-white/90 backdrop-blur-md border-b border-muted/30 shadow-xs"
          }
        `}
      >
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src={logo}
            alt="QuzSpace Logo"
            className="h-8 w-auto object-contain"
          />
          <span className="text-lg font-extrabold text-brand tracking-tight">
            Quz<span className="text-gray font-semibold">Space</span>
          </span>
        </Link>

        <Link
          to="/settings"
          className={`w-8 h-8 rounded-full ${avatarColor} text-light font-bold text-xs flex items-center justify-center shadow-xs`}
          title={displayName}
        >
          {avatarInitials}
        </Link>
      </header>

      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-muted/30 px-6 py-2 flex items-center justify-around shadow-2xl lg:hidden pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => `
            flex flex-col items-center gap-1 text-xs font-semibold transition-colors
            ${isActive ? "text-brand" : "text-gray hover:text-brand"}
          `}
          >
            <HiOutlineSquare2Stack className="w-6 h-6" />
            <span>Dashboard</span>
          </NavLink>

          <Link
            to="/create-space"
            onClick={onCreateClick}
            className="flex flex-col items-center justify-center -mt-5"
            aria-label="Create Study Space"
          >
            <div className="w-12 h-12 rounded-full bg-brand text-light flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <HiPlus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-brand mt-1">
              Create
            </span>
          </Link>

          <NavLink
            to="/settings"
            end
            className={({ isActive }) => `
            flex flex-col items-center gap-1 text-xs font-semibold transition-colors
            ${isActive ? "text-brand" : "text-gray hover:text-brand"}
          `}
          >
            <HiOutlineCog6Tooth className="w-6 h-6" />
            <span>Settings</span>
          </NavLink>
        </nav>
      )}
    </>
  );
}
