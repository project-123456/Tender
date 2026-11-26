
import { useEffect, useMemo, useState } from "react";
import { Bell, ChevronRight, LogOut } from "lucide-react";

import { apiRequest } from "./api.js";
import {
  tenders as sampleTenders,
  emptyProfile,
} from "./data/tenders.js";

import Sidebar from "./components/Sidebar.jsx";
import Overview from "./components/Overview.jsx";
import DiscoverTenders from "./components/DiscoverTenders.jsx";
import BusinessProfile from "./components/BusinessProfile.jsx";
import TenderDetails from "./components/TenderDetails.jsx";
import BidChecklist from "./components/BidChecklist.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Auth from "./components/Auth.jsx";
import MyAccount from "./components/MyAccount.jsx";

function mapBusinessToProfile(user, fallback = emptyProfile) {
  const business = user?.business || {};

  return {
    ...emptyProfile,
    ...fallback,
    name: business.companyName || "",
    category: business.categories?.[0] || "Other",
    region: business.state || "All India",
    turnover: business.annualTurnover ?? "",
    experience: business.yearsOfExperience ?? "",
    documents: business.documents || "",
  };
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [page, setPage] = useState("Overview");
  const [selected, setSelected] = useState(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");

  const [profile, setProfile] = useState(emptyProfile);
  const [saved, setSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  const [checked, setChecked] = useState({});
  const [notice, setNotice] = useState("");

  // Restore the existing authenticated session.
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const token = localStorage.getItem("tenderbridge_token");

      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const data = await apiRequest("/profile");

        if (!active) return;

        const currentUser = data.user ?? data;

        setUser(currentUser);
        setProfile(mapBusinessToProfile(currentUser));
        setSaved(true);
      } catch {
        localStorage.removeItem("tenderbridge_token");
      } finally {
        if (active) setAuthReady(true);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Clear notifications after three seconds.
  useEffect(() => {
    if (!notice) return undefined;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  // Refresh profile data after login or account change.
  useEffect(() => {
    if (!user) return undefined;

    let active = true;

    async function loadProfile() {
      setProfileLoading(true);

      try {
        const data = await apiRequest("/profile");

        if (!active) return;

        const currentUser = data.user ?? data;

        setUser((previous) => ({
          ...previous,
          ...currentUser,
        }));

        setProfile(mapBusinessToProfile(currentUser));
        setSaved(true);
      } catch (error) {
        if (active) {
          setNotice(`Could not load profile: ${error.message}`);
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?._id, user?.id]);

  // Filter the existing demo tender data.
  // const filteredTenders = useMemo(() => {
  //   return sampleTenders.filter((tender) => {
  //     const searchText = [
  //       tender.title,
  //       tender.authority,
  //       tender.id,
  //     ]
  //       .join(" ")
  //       .toLowerCase();

  //     return (
  //       searchText.includes(query.toLowerCase()) &&
  //       (category === "All" || tender.category === category) &&
  //       (region === "All" || tender.region === region)
  //     );
  //   });
  // }, [query, category, region]);

  function navigate(nextPage) {
    setPage(nextPage);
    setSelected(null);
  }

  // Called after successful login or registration.
  function handleLogin(loggedInUser) {
    setUser(loggedInUser || null);
    setPage("Overview");
    setSelected(null);
    setNotice("Welcome to TenderBridge AI!");
  }

  // Save business details to MongoDB through the API.
  async function saveProfile(event) {
    event.preventDefault();
    setProfileSaving(true);
    setNotice("");

    try {
      const business = {
        companyName: profile.name,
        categories: profile.category ? [profile.category] : [],
        state: profile.region,
        annualTurnover:
          profile.turnover === "" ? null : Number(profile.turnover),
        yearsOfExperience:
          profile.experience === "" ? null : Number(profile.experience),
        documents: profile.documents || "",
      };

      const data = await apiRequest("/profile", {
        method: "PATCH",
        body: JSON.stringify({ business }),
      });

      const updatedUser = data.user ?? data;

      setUser((previous) => ({
        ...previous,
        ...updatedUser,
      }));

      setSaved(true);
      setNotice("Business profile saved successfully!");
    } catch (error) {
      setNotice(`Could not save profile: ${error.message}`);
    } finally {
      setProfileSaving(false);
    }
  }

  // Clear the local session and return to authentication.
  function logout() {
    localStorage.removeItem("tenderbridge_token");

    setUser(null);
    setPage("Overview");
    setSelected(null);
    setProfile(emptyProfile);
    setSaved(false);
    setChecked({});
    setQuery("");
    setCategory("All");
    setRegion("All");
    setNotice("");
  }

  // Show loading while checking the saved login session.
  if (!authReady) {
    return (
      <div className="auth-page">
        <div className="form-panel">
          <h2>TenderBridge AI</h2>
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Only authenticated users can access the dashboard.
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Render the selected page.
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
  } else if (page === "My account") {
    content = (
      <MyAccount
        user={user}
        profile={profile}
        onBack={(nextPage) => navigate(nextPage || "Overview")}
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
        // tenders={filteredTenders}
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

  const displayName =
    user.name ||
    user.business?.companyName ||
    user.email ||
    "User";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div className="app-shell">
      <Sidebar
        page={selected ? "" : page}
        onNavigate={navigate}
        user={user}
      />

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            Workspace <ChevronRight size={14} />
            <b>{selected ? "Tender details" : page}</b>
          </div>

          <div className="topbar-actions">
            <span className="demo-pill">
              <i /> DEMO TENDERS
            </span>

            <button
              type="button"
              className="icon-button"
              aria-label="Notifications"
              title="Notifications"
              onClick={() => setNotice("You are all caught up.")}
            >
              <Bell size={18} />
            </button>

            <button
              type="button"
              className="user-avatar"
              title={`Open account: ${displayName}`}
              aria-label={`Open account: ${displayName}`}
              onClick={() => navigate("My account")}
            >
              {initials || "U"}
            </button>

            <button
              type="button"
              className="icon-button"
              aria-label="Log out"
              title={`Log out (${displayName})`}
              onClick={logout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {notice && (
          <div className="toast" role="status">
            {notice}
          </div>
        )}

        {content}

        <footer className="footer">
          TenderBridge AI <span>·</span>
          Evidence-based tender decision support
        </footer>
      </main>
    </div>
  );
}
