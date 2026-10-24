import { Check, Info } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

const tasks = [
  [
    "Confirm all eligibility conditions",
    "Read the complete official notice and supporting documents.",
    "Review",
  ],
  [
    "Verify turnover and financial evidence",
    "Confirm the threshold, financial year, and acceptable proof.",
    "Review",
  ],
  [
    "Check experience requirements",
    "Validate project types, duration, and completion certificates.",
    "Review",
  ],
  [
    "Prepare required registration documents",
    "Check which certificates are explicitly requested.",
    "Unknown",
  ],
  [
    "Check corrigenda and final deadline",
    "Revisit the official source before submitting.",
    "Review",
  ],
];

export default function BidChecklist({ checked, setChecked }) {
  const completed = tasks.filter(
    (_, index) => checked[index]
  ).length;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR NEXT STEPS</div>
          <h1>Bid-readiness checklist</h1>
          <p>
            Organize your review before making a bidding decision.
          </p>
        </div>

        <div className="progress-count">
          <b>
            {completed}/{tasks.length}
          </b>
          <small>completed</small>
        </div>
      </div>

      <div className="panel checklist-panel">
        <div className="progress-track">
          <span
            style={{
              width: `${(completed / tasks.length) * 100}%`,
            }}
          />
        </div>

        {tasks.map(([title, description, status], index) => (
          <label
            className={`checklist-row ${
              checked[index] ? "checked" : ""
            }`}
            key={title}
          >
            <input
              type="checkbox"
              checked={Boolean(checked[index])}
              onChange={(event) =>
                setChecked((previous) => ({
                  ...previous,
                  [index]: event.target.checked,
                }))
              }
            />

            <span className="custom-checkbox">
              {checked[index] && <Check size={13} />}
            </span>

            <span className="task-copy">
              <b>{title}</b>
              <small>{description}</small>
            </span>

            <StatusBadge
              status={checked[index] ? "Verified" : status}
            />
          </label>
        ))}

        <div className="form-note">
          <Info size={17} />
          <span>
            Checking an item tracks your progress only. It does
            not independently verify eligibility or submit a bid.
          </span>
        </div>
      </div>
    </section>
  );
}