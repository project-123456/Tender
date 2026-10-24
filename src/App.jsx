import {  useEffect, useMemo, useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { apiRequest } from "./api.js";
import { tenders as sampleTenders, emptyProfile } from "./data/tenders.js";
import Sidebar from "./components/Sidebar.jsx";
import Overview from "./components/Overview.jsx";
import DiscoverTenders from "./components/DiscoverTenders.jsx";
import BusinessProfile from "./components/BusinessProfile.jsx";
import TenderDetails from "./components/TenderDetails.jsx";
import BidChecklist from "./components/BidChecklist.jsx";
import HowItWorks from "./components/HowItWorks.jsx";

export default function App() {
  
const [profileLoading, setProfileLoading] = useState(false);
const [profileSaving, setProfileSaving] = useState(false);

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

useEffect(() => {
  const token = localStorage.getItem("tenderbridge_token");

  if (!token) return;

  async function loadProfile() {
    setProfileLoading(true);

    try {
      const data = await apiRequest("/profile");

      const user = data.user ?? data;
      const business = user.business || {};

      setProfile({
        ...emptyProfile,
        name: business.companyName || "",
        category: business.categories?.[0] || "Other",
        region: business.state || "All India",
        turnover: business.annualTurnover ?? "",
        experience: business.yearsOfExperience ?? "",
        documents: business.documents || "",
      });

      setSaved(true);
    } catch (error) {
      setNotice(`Could not load profile: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  }

  loadProfile();
}, []);

  
async function saveProfile(event) {
  event.preventDefault();

  setProfileSaving(true);

  try {
    const business = {
      companyName: profile.name,
      categories: profile.category ? [profile.category] : [],
      state: profile.region,
      annualTurnover:
        profile.turnover === ""
          ? null
          : Number(profile.turnover),
      yearsOfExperience:
        profile.experience === ""
          ? null
          : Number(profile.experience),
      documents: profile.documents,
    };

    await apiRequest("/profile", {
      method: "PATCH",
      body: JSON.stringify({ business }),
    });

    setSaved(true);
    setNotice("Business profile saved successfully!");
  } catch (error) {
    setNotice(error.message);
  } finally {
    setProfileSaving(false);
    window.setTimeout(() => setNotice(""), 3000);
  }
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
  setProfile={(value) => {
    setProfile(value);
    setSaved(false);
  }}
  onSave={saveProfile}
  saved={saved}
  saving={profileSaving}
  loading={profileLoading}
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