import {
  Search,
  Clock3,
  CheckCircle2,
  FileSearch,
} from "lucide-react";

const icons = {
  search: Search,
  clock: Clock3,
  check: CheckCircle2,
  file: FileSearch,
};

export default function StatCard({
  icon = "search",
  label,
  value,
  detail,
}) {
  const Icon = icons[icon] || Search;

  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon">
          <Icon size={18} />
        </span>
      </div>

      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}