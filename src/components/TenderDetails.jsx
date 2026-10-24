import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  Info,
} from "lucide-react";

import StatusBadge from "./StatusBadge.jsx";

export default function TenderDetails({
  tender,
  profile,
  onBack,
  onChecklist,
}) {
  const turnover = Number(profile.turnover);
  const experience = Number(profile.experience);

  const turnoverRequirement = Number(
    tender.requirements[0]?.value.match(/[\d.]+/)?.[0]
  );

  const experienceRequirement = Number(
    tender.requirements[1]?.value.match(/[\d.]+/)?.[0]
  );

  const checks = [
    {
      label: "Turnover",
      result:
        profile.turnover === "" || !turnoverRequirement
          ? "Unknown"
          : turnover >= turnoverRequirement
            ? "Potential match"
            : "Does not meet threshold",
    },
    {
      label: "Experience",
      result:
        profile.experience === "" || !experienceRequirement
          ? "Unknown"
          : experience >= experienceRequirement
            ? "Potential match"
            : "Does not meet threshold",
    },
    {
      label: "Region",
      result:
        !profile.region
          ? "Unknown"
          : profile.region === tender.region ||
              profile.region === "All India"
            ? "Potential match"
            : "Review",
    },
  ];

  const matched = checks.filter(
    (item) => item.result === "Potential match"
  ).length;

  return (
    <section className="page">
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to tenders
      </button>

      <div className="detail-head">
        <div className="tender-icon big">
          <Building2 size={24} />
        </div>

        <div>
          <div className="eyebrow">
            TENDER REFERENCE · {tender.id}
          </div>

          <h1>{tender.title}</h1>
          <p>{tender.authority}</p>
        </div>

        <StatusBadge status={tender.status} />
      </div>

      <div className="detail-stats">
        <div>
          <small>Estimated value</small>
          <b>{tender.value}</b>
        </div>

        <div>
          <small>Closing date</small>
          <b>
            <CalendarClock size={16} />
            {tender.deadline}
          </b>
        </div>

        <div>
          <small>Category</small>
          <b>{tender.category}</b>
        </div>

        <div>
          <small>Region</small>
          <b>{tender.region}</b>
        </div>
      </div>

      <div className="detail-columns">
        <div className="panel">
          <div className="panel-heading">
            <h2>Requirement breakdown</h2>
            <p>
              Review every condition against its evidence.
            </p>
          </div>

          {tender.requirements.map((requirement, index) => (
            <div className="requirement" key={requirement.name}>
              <span className="requirement-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="requirement-copy">
                <b>{requirement.name}</b>
                <strong>{requirement.value}</strong>
                <p>{requirement.note}</p>
              </div>

              <StatusBadge status={requirement.status} />
            </div>
          ))}

          <div className="form-note">
            <Info size={17} />
            <span>
              Illustrative data only. Verify original tender
              documents and the latest corrigenda.
            </span>
          </div>
        </div>

        <aside className="panel readiness">
          <div className="eyebrow">
            PRELIMINARY ASSESSMENT
          </div>

          <h2>Profile comparison</h2>

          <div className="readiness-number">
            {matched}
            <small> / 3 potential matches</small>
          </div>

          <p>
            Known profile fields compared with sample
            conditions. This is not a legal eligibility decision.
          </p>

          {checks.map((check) => (
            <div className="comparison-line" key={check.label}>
              <span>{check.label}</span>
              <StatusBadge status={check.result} />
            </div>
          ))}

          <button
            className="button primary full"
            onClick={onChecklist}
          >
            Open bid checklist <ArrowRight size={16} />
          </button>
        </aside>
      </div>
    </section>
  );
}