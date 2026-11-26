
import {
  ArrowUpRight,
  Clock3,
  Building2,
  FileText,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function TenderCard({ tender, onOpen }) {
  const Icon = tender.type === "Goods" ? Building2 : FileText;

  return (
    <article className="tender-card">
      <div className="tender-card-head">
        <div className="tender-icon">
          <Icon size={20} />
        </div>

        <div className="tender-title">
          <h3>{tender.title}</h3>
          <p>{tender.authority || tender.department || tender.source}</p>
        </div>

        <StatusBadge status={tender.status || "Review"} />
      </div>

      <p className="tender-description">{tender.description}</p>

      <div className="tender-meta">
        <span>{tender.category || "Unclassified"}</span>
        <span>{tender.region || tender.state || "Not verified"}</span>
        <span>
          <Clock3 size={14} />
          {tender.deadline || "Deadline not verified"}
        </span>
        <b>{tender.value || "Value not disclosed"}</b>
      </div>

      <div className="tender-card-footer">
        <span className="ref">
          REF: {String(tender.id || tender.externalId || "N/A").slice(0, 16)}
        </span>

        <button
          type="button"
          className="button secondary small"
          onClick={() => onOpen(tender)}
        >
          View requirements <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  );
}
