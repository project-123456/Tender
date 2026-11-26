
import {
  LayoutDashboard,
  Search,
  Building2,
  ListChecks,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Overview", Icon: LayoutDashboard },
  { label: "Discover tenders", Icon: Search },
  { label: "Business profile", Icon: Building2 },
  { label: "Bid checklist", Icon: ListChecks },
];

export default function Sidebar({
  page,
  onNavigate,
  user = {},
}) {
  const displayName =
    user.name ||
    user.business?.companyName ||
    user.email ||
    "Your account";

  const businessName =
    user.business?.companyName || "Business profile";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">TB</div>
        <div>
          <b>
            TenderBridge <span>AI</span>
          </b>
          <small>PROCUREMENT INTELLIGENCE</small>
        </div>
      </div>

      <button
        type="button"
        className="workspace"
        onClick={() => onNavigate("Business profile")}
        title="Open your workspace profile"
      >
        <div className="workspace-avatar">{initials || "U"}</div>

        <div className="workspace-copy">
          <b>My Workspace</b>
          <small>{businessName}</small>
        </div>

        <ChevronRight size={15} />
      </button>

      <div className="nav-label">WORKSPACE</div>

      <nav>
        {navItems.map(({ label, Icon }) => (
          <button
            type="button"
            key={label}
            className={`nav-item ${page === label ? "active" : ""}`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="nav-label resources-label">RESOURCES</div>

      <button
        type="button"
        className={`nav-item ${page === "How it works" ? "active" : ""}`}
        onClick={() => onNavigate("How it works")}
      >
        <BookOpen size={18} />
        <span>How it works</span>
      </button>

      <div className="sidebar-bottom">
        <div className="help-card">
          <Sparkles size={18} />
          <b>Evidence over guesswork</b>
          <p>
            Review source evidence before deciding to bid.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("How it works")}
          >
            Explore guide <ArrowRight size={14} />
          </button>
        </div>

        <button
  type="button"
  className="user-row"
  onClick={() => onNavigate("My account")}
  title="Open your account"
>
  <div className="user-avatar">{initials || "U"}</div>

  <div className="user-info">
    <b>{displayName}</b>
    <small>{user.email || "Account profile"}</small>
  </div>

  <ChevronRight className="profile-chevron" size={16} />
</button>
      </div>
    </aside>
  );
}
