export default function StatusBadge({ status }) {
  const key =
    status === "Verified" || status === "Potential match"
      ? "verified"
      : status === "Review" ||
          status === "Does not meet threshold"
        ? "review"
        : "unknown";

  return (
    <span className={`status-badge ${key}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}