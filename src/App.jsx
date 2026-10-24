import { useMemo, useState } from "react";
import { Bell, ChevronRight } from "lucide-react";

import { tenders as sampleTenders, emptyProfile } from "./data/tenders.js";
import Sidebar from "./components/Sidebar.jsx";
import Overview from "./components/Overview.jsx";
import DiscoverTenders from "./components/DiscoverTenders.jsx";
import BusinessProfile from "./components/BusinessProfile.jsx";
import TenderDetails from "./components/TenderDetails.jsx";
import BidChecklist from "./components/BidChecklist.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

export default function App() {
  const [page, setPage] = useState("Overview");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");
  const [profile, setProfile] = useState(emptyProfile);
  const [saved, setSaved] = useState(false);
  const [checked, setChecked] = useState({});
  const [notice, setNotice] = useState("");

  const filteredTenders = useMemo(
    () =>
      sampleTenders.filter((tender) => {
        const searchText = [
          tender.title,
          tender.authority,
          tender.id,
        ]
          .join(" ")
          .toLowerCase();

        return (
          searchText.includes(query.toLowerCase()) &&
          (category === "All" ||
            tender.category === category) &&
          (region === "All" || tender.region === region)
        );
      }),
    [query, category, region]
  );

  function navigate(nextPage) {
    setPage(nextPage);
    setSelected(null);
  }

  function saveProfile(event) {
    event.preventDefault();
    setSaved(true);
    setNotice("Profile saved for this browser session.");

    window.setTimeout(() => setNotice(""), 2500);
  }

  let content;

  if (selected) {
    content = (
      <TenderDetails
        tender={selected}
        profile={profile}
        onBack={() => setSelected(null)}
        onChecklist={() => navigate("Bid checklist")}
      />
    );
  } else if (page === "Overview") {
    content = (
      <Overview
        tenders={sampleTenders}
        profile={profile}
        onNavigate={navigate}
        onOpen={setSelected}
      />
    );
  } else if (page === "Discover tenders") {
    content = (
      <DiscoverTenders
        tenders={filteredTenders}
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        region={region}
        setRegion={setRegion}
        onOpen={setSelected}
      />
    );
  } else if (page === "Business profile") {
    content = (
      <BusinessProfile
        profile={profile}
        setProfile={setProfile}
        onSave={saveProfile}
        saved={saved}
      />
    );
  } else if (page === "Bid checklist") {
    content = (
      <BidChecklist
        checked={checked}
        setChecked={setChecked}
      />
    );
  } else {
    content = <HowItWorks />;
  }

  return (
    <div className="app-shell">
      <Sidebar page={selected ? "" : page} onNavigate={navigate} />

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            Workspace <ChevronRight size={14} />
            <b>{selected ? "Tender details" : page}</b>
          </div>

          <div className="topbar-actions">
            <span className="demo-pill">
              <i /> DEMO ENVIRONMENT
            </span>

            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setNotice("You are all caught up.")}
            >
              <Bell size={18} />
            </button>

            <div className="user-avatar">GK</div>
          </div>
        </header>

        {notice && <div className="toast">{notice}</div>}

        {content}

        <footer className="footer">
          TenderBridge AI <span>·</span>
          Evidence-based tender decision support
        </footer>
      </main>
    </div>
  );
}