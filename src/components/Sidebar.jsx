import {
  LayoutDashboard,
  Search,
  Building2,
  ListChecks,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Overview", Icon: LayoutDashboard },
  { label: "Discover tenders", Icon: Search },
  { label: "Business profile", Icon: Building2 },
  { label: "Bid checklist", Icon: ListChecks },
];

export default function Sidebar({ page, onNavigate }) {
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

      <div className="workspace">
        <div className="workspace-avatar">G</div>
        <div>
          <b>My Workspace</b>
          <small>MSME workspace</small>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <nav>
        {navItems.map(({ label, Icon }) => (
          <button
            key={label}
            className={`nav-item ${
              page === label ? "active" : ""
            }`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="nav-label resources-label">RESOURCES</div>

      <button
        className={`nav-item ${
          page === "How it works" ? "active" : ""
        }`}
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
          <button onClick={() => onNavigate("How it works")}>
            Explore guide <ArrowRight size={14} />
          </button>
        </div>

        <div className="user-row">
          <div className="user-avatar">GK</div>
          <div>
            <b>Govind Kumar</b>
            <small>Demo workspace</small>
          </div>
        </div>
      </div>
    </aside>
  );
}