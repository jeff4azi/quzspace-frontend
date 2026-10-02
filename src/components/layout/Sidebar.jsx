import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/Quzspace_logo.png";
import {
  HiOutlineSquare2Stack,
  HiOutlineBookOpen,
  HiOutlineCog6Tooth,
  HiOutlineEllipsisVertical,
  HiOutlineArrowRightOnRectangle,
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

export default function Sidebar() {
  const navigate = useNavigate();
  const { profile, user, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const displayName = profile?.name || user?.user_metadata?.name || "You";
  const displayEmail = user?.email || "";
  const avatarColor = profile?.avatarColor || "bg-brand";
  const avatarInitials = profile?.avatarInitials
    || computeAvatarInitials(displayName, displayEmail);

  const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: HiOutlineSquare2Stack },
    {
      label: "Study Spaces",
      to: "/spaces",
      icon: HiOutlineBookOpen,
    },
    { label: "Settings", to: "/settings", icon: HiOutlineCog6Tooth },
  ];

  const handleLogout = async () => {
    setShowUserDropdown(false);
    try {
      await logout();
    } catch {
      /* ignore */
    }
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[270px] bg-white border-r border-muted/20 z-40 hidden lg:flex flex-col justify-between p-5 text-gray font-sans select-none">
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-2 py-1 hover:opacity-90 transition-opacity"
        >
          <img
            src={logo}
            alt="QuzSpace Logo"
            className="h-9 w-auto object-contain"
          />
          <span className="text-xl font-extrabold tracking-tight text-brand">
            Quz<span className="text-gray-500 font-semibold">Space</span>
          </span>
        </Link>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted/80 mb-2">
            Workspace
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end
              className={({ isActive }) => `
                group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-brand text-light shadow-md"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-brand"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-light"
                          : "text-gray-400 group-hover:text-brand"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="space-y-4 pt-4 border-t border-muted/20">
        <div className="relative">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-100/80 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full ${avatarColor} text-light font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
              >
                {avatarInitials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {displayEmail}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="p-1.5 text-gray-400 hover:text-brand rounded-lg hover:bg-muted/20 transition-colors"
              aria-label="User menu"
            >
              <HiOutlineEllipsisVertical className="w-5 h-5" />
            </button>
          </div>

          {showUserDropdown && (
            <div className="absolute bottom-12 right-0 w-48 bg-white rounded-xl shadow-xl border border-muted/30 p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 space-y-1">
              <Link
                to="/settings"
                onClick={() => setShowUserDropdown(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <HiOutlineCog6Tooth className="w-4 h-4 text-gray-500" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
              >
                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
