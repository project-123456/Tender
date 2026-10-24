import {
  ArrowRight,
  Search,
  Building2,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

import StatCard from "./StatCard.jsx";
import TenderCard from "./TenderCard.jsx";

export default function Overview({
  tenders,
  profile,
  onNavigate,
  onOpen,
}) {
  const reviewCount = tenders.filter(
    (t) => t.status === "Review"
  ).length;

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            ✦ YOUR PROCUREMENT INTELLIGENCE HUB
          </div>

          <h1>
            Find the right tenders.
            <br />
            <span>Bid with confidence.</span>
          </h1>

          <p>
            Discover opportunities, understand requirements,
            and know where you stand — all in one place.
          </p>

          <div className="hero-actions">
            <button
              className="button primary"
              onClick={() => onNavigate("Discover tenders")}
            >
              Discover tenders <ArrowRight size={16} />
            </button>

            <button
              className="button secondary"
              onClick={() => onNavigate("Business profile")}
            >
              <Building2 size={16} />
              Set up business profile
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit" />

          <div className="visual-document">
            <FileCheck2 size={42} />
            <div className="fake-line long" />
            <div className="fake-line" />
            <div className="evidence-pill">
              <ShieldCheck size={14} />
              Evidence-linked workflow
            </div>
          </div>

          <div className="float-note note-one">
            <ShieldCheck size={17} />
            <span>
              <b>Evidence first</b>
              <small>Source-linked findings</small>
            </span>
          </div>

          <div className="float-note note-two">
            <Search size={17} />
            <span>
              <b>Smart discovery</b>
              <small>Relevant opportunities</small>
            </span>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Workspace overview</h2>
          <p>A quick look at your tender pipeline.</p>
        </div>

        <span className="demo-label">
          ILLUSTRATIVE DEMO DATA
        </span>
      </div>

      <div className="stats-grid">
        <StatCard
          icon="search"
          label="Tender opportunities"
          value={String(tenders.length).padStart(2, "0")}
          detail="Across sample categories"
        />

        <StatCard
          icon="clock"
          label="Need review"
          value={reviewCount}
          detail="Verify source documents"
        />

        <StatCard
          icon="check"
          label="Profile status"
          value={profile.name ? "Saved" : "Not set"}
          detail={
            profile.name
              ? "Profile entered"
              : "Add business details"
          }
        />

        <StatCard
          icon="file"
          label="Checklist items"
          value="05"
          detail="Preliminary next steps"
        />
      </div>

      <div className="section-heading list-heading">
        <div>
          <h2>Recently discovered</h2>
          <p>
            Open a tender to review requirements and evidence.
          </p>
        </div>

        <button
          className="text-button"
          onClick={() => onNavigate("Discover tenders")}
        >
          View all tenders <ArrowRight size={15} />
        </button>
      </div>

      <div className="tender-list">
        {tenders.slice(0, 3).map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            onOpen={onOpen}
          />
        ))}
      </div>

      <div className="disclaimer">
        <ShieldCheck size={16} />
        <span>
          Demo records are illustrative, not live government
          notices. Verify eligibility and deadlines using
          official sources.
        </span>
      </div>
    </section>
  );
}