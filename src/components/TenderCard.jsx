import {
  ArrowUpRight,
  Clock3,
  Building2,
  FileText,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function TenderCard({ tender, onOpen }) {
  const Icon =
    tender.type === "Goods" ? Building2 : FileText;

  return (
    <article className="tender-card">
      <div className="tender-card-head">
        <div className="tender-icon">
          <Icon size={20} />
        </div>

        <div className="tender-title">
          <h3>{tender.title}</h3>
          <p>{tender.authority}</p>
        </div>

        <StatusBadge status={tender.status} />
      </div>

      <p className="tender-description">
        {tender.description}
      </p>

      <div className="tender-meta">
        <span>{tender.category}</span>
        <span>{tender.region}</span>
        <span>
          <Clock3 size={14} />
          {tender.deadline}
        </span>
        <b>{tender.value}</b>
      </div>

      <div className="tender-card-footer">
        <span className="ref">REF: {tender.id}</span>

        <button
          className="button secondary small"
          onClick={() => onOpen(tender)}
        >
          View requirements <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  );
}