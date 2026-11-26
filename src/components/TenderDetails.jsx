
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  ExternalLink,
  Info,
} from "lucide-react";

import StatusBadge from "./StatusBadge.jsx";

function readNumber(value = "") {
  const match = String(value).match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not disclosed";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  return `₹${number.toLocaleString("en-IN")}`;
}

function formatDeadline(value) {
  if (!value) return "Verify deadline";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TenderDetails({
  tender = {},
  profile = {},
  onBack,
  onChecklist,
}) {
  const requirements = Array.isArray(tender.requirements)
    ? tender.requirements
    : [];

  const turnover = Number(profile.turnover);
  const experience = Number(profile.experience);

  const turnoverRequirement = readNumber(
    requirements.find((item) =>
      /turnover/i.test(item.name || "")
    )?.value
  );

  const experienceRequirement = readNumber(
    requirements.find((item) =>
      /experience/i.test(item.name || "")
    )?.value
  );

  const tenderRegion = tender.region || tender.state || "";
  const profileRegion = profile.region || "";

  const checks = [
    {
      label: "Turnover",
      result:
        profile.turnover === "" ||
        profile.turnover === null ||
        profile.turnover === undefined ||
        !Number.isFinite(turnover) ||
        !turnoverRequirement
          ? "Unknown"
          : turnover >= turnoverRequirement
            ? "Potential match"
            : "Does not meet threshold",
    },
    {
      label: "Experience",
      result:
        profile.experience === "" ||
        profile.experience === null ||
        profile.experience === undefined ||
        !Number.isFinite(experience) ||
        !experienceRequirement
          ? "Unknown"
          : experience >= experienceRequirement
            ? "Potential match"
            : "Does not meet threshold",
    },
    {
      label: "Region",
      result:
        !profileRegion ||
        !tenderRegion ||
        /not verified|all india/i.test(tenderRegion)
          ? "Unknown"
          : profileRegion.toLowerCase() === tenderRegion.toLowerCase() ||
              /all india/i.test(profileRegion)
            ? "Potential match"
            : "Review",
    },
  ];

  const matched = checks.filter(
    (item) => item.result === "Potential match"
  ).length;

  const title = tender.title || "Untitled tender";
  const authority =
    tender.authority ||
    tender.department ||
    tender.source ||
    "Authority not verified";

  const reference =
    tender.id || tender._id || tender.externalId || "Not available";

  const value =
    tender.value !== undefined
      ? tender.value
      : formatValue(tender.estimatedValue);

  const deadline =
    tender.deadline &&
    !/verify deadline|not verified/i.test(String(tender.deadline))
      ? formatDeadline(tender.deadline)
      : "Verify deadline";

  const category = tender.category || "Not classified";
  const region = tenderRegion || "Not verified";

  const officialUrl = tender.officialUrl || "";

  function openOfficialSource() {
    if (!officialUrl) return;

    try {
      const url = new URL(officialUrl);

      if (url.protocol === "https:" || url.protocol === "http:") {
        window.open(url.href, "_blank", "noopener,noreferrer");
      }
    } catch {
      // Ignore malformed source URLs.
    }
  }

  return (
    <section className="page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back to tenders
      </button>

      <div className="detail-head">
        <div className="tender-icon big">
          <Building2 size={24} />
        </div>

        <div>
          <div className="eyebrow">
            TENDER REFERENCE · {String(reference).slice(0, 24)}
          </div>

          <h1>{title}</h1>
          <p>{authority}</p>
        </div>

        <StatusBadge status={tender.status || "Review"} />
      </div>

      <div className="detail-stats">
        <div>
          <small>Estimated value</small>
          <b>{value}</b>
        </div>

        <div>
          <small>Closing date</small>
          <b>
            <CalendarClock size={16} />
            {deadline}
          </b>
        </div>

        <div>
          <small>Category</small>
          <b>{category}</b>
        </div>

        <div>
          <small>Region</small>
          <b>{region}</b>
        </div>
      </div>

      {officialUrl && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <div className="panel-heading">
            <h2>Source notice</h2>
            <p>
              Open the source and verify the original tender details.
            </p>
          </div>

          <button
            type="button"
            className="button secondary"
            onClick={openOfficialSource}
          >
            Open source website <ExternalLink size={16} />
          </button>
        </div>
      )}

      <div className="detail-columns">
        <div className="panel">
          <div className="panel-heading">
            <h2>Requirement breakdown</h2>
            <p>
              Review each condition against the original tender documents.
            </p>
          </div>

          {requirements.length > 0 ? (
            requirements.map((requirement, index) => (
              <div
                className="requirement"
                key={requirement.name || index}
              >
                <span className="requirement-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="requirement-copy">
                  <b>{requirement.name || "Requirement"}</b>
                  <strong>{requirement.value || "Not specified"}</strong>
                  <p>{requirement.note || "Verify details in the official notice."}</p>
                </div>

                <StatusBadge status={requirement.status || "Review"} />
              </div>
            ))
          ) : (
            <div className="form-note">
              <Info size={17} />
              <span>
                Detailed requirements have not been extracted for this
                search result. Open the source notice and verify the
                eligibility criteria, financial requirements and deadline.
              </span>
            </div>
          )}

          <div className="form-note">
            <Info size={17} />
            <span>
              Search results are not proof of current tender availability.
              Verify the original notice and latest corrigenda before bidding.
            </span>
          </div>
        </div>

        <aside className="panel readiness">
          <div className="eyebrow">PRELIMINARY ASSESSMENT</div>

          <h2>Profile comparison</h2>

          <div className="readiness-number">
            {matched}
            <small> / 3 potential matches</small>
          </div>

          <p>
            This comparison uses available profile data and any extracted
            requirements. Missing information remains unknown; this is not
            an official eligibility decision.
          </p>

          {checks.map((check) => (
            <div className="comparison-line" key={check.label}>
              <span>{check.label}</span>
              <StatusBadge status={check.result} />
            </div>
          ))}

          <button
            type="button"
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
