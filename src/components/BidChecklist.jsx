
import { useEffect, useMemo, useState } from "react";
import { Check, Info, RefreshCw, ExternalLink } from "lucide-react";
import { apiRequest } from "../api.js";
import StatusBadge from "./StatusBadge.jsx";

const TASKS = [
  {
    id: "eligibility",
    title: "Confirm eligibility conditions",
    description: "Review eligibility criteria in the official tender notice.",
  },
  {
    id: "turnover",
    title: "Verify turnover and financial evidence",
    description: "Check financial thresholds and required proof.",
  },
  {
    id: "experience",
    title: "Check experience requirements",
    description: "Review experience criteria and completion certificates.",
  },
  {
    id: "documents",
    title: "Prepare required registration documents",
    description: "Collect only the documents requested by the tender authority.",
  },
  {
    id: "deadline",
    title: "Verify corrigenda and final deadline",
    description: "Check the latest notice and deadline on the official portal.",
  },
];

function normalizeTender(tender) {
  return {
    ...tender,
    id: tender._id || tender.id,
    authority: tender.department || tender.source || "Authority not verified",
    region: tender.state || "Not verified",
    deadline: tender.deadline
      ? new Date(tender.deadline).toLocaleDateString("en-IN")
      : "Verify deadline",
  };
}

export default function BidChecklist() {
  const [tenders, setTenders] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [checked, setChecked] = useState({});
  const [status, setStatus] = useState("Not Started");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedTender = useMemo(
    () => tenders.find((tender) => tender.id === selectedId),
    [tenders, selectedId]
  );

  const completed = TASKS.filter((task) => checked[task.id]).length;
  const progress = Math.round((completed / TASKS.length) * 100);

  useEffect(() => {
    let active = true;

    async function loadSavedTenders() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/tenders/saved");
        const items = (data.items || []).map(normalizeTender);

        if (!active) return;

        setTenders(items);
        setSelectedId((previous) =>
          items.some((item) => item.id === previous)
            ? previous
            : items[0]?.id || ""
        );
      } catch (err) {
        if (active) setError(err.message || "Could not load saved tenders.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSavedTenders();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setChecked({});
      setStatus("Not Started");
      return;
    }

    let active = true;

    async function loadChecklist() {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const data = await apiRequest(`/bid-checklists/${selectedId}`);
        if (!active) return;

        const tasks = data.checklist?.tasks || [];
        const nextChecked = {};

        for (const task of tasks) {
          nextChecked[task.taskId] = Boolean(task.completed);
        }

        setChecked(nextChecked);
        setStatus(data.checklist?.status || "Not Started");
      } catch (err) {
        if (active) setError(err.message || "Could not load checklist.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadChecklist();
    return () => {
      active = false;
    };
  }, [selectedId]);

  async function saveChecklist(nextChecked) {
    if (!selectedId) return;

    const completedCount = TASKS.filter(
      (task) => nextChecked[task.id]
    ).length;

    const nextStatus =
      completedCount === 0
        ? "Not Started"
        : completedCount === TASKS.length
          ? "Ready to Submit"
          : "In Progress";

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest(`/bid-checklists/${selectedId}`, {
        method: "PUT",
        body: JSON.stringify({
          status: nextStatus,
          tasks: TASKS.map((task) => ({
            taskId: task.id,
            completed: Boolean(nextChecked[task.id]),
          })),
        }),
      });

      setStatus(data.checklist?.status || nextStatus);
      setMessage("Checklist progress saved.");
    } catch (err) {
      setError(err.message || "Could not save checklist progress.");
    } finally {
      setSaving(false);
    }
  }

  function toggleTask(taskId, value) {
    const nextChecked = { ...checked, [taskId]: value };
    setChecked(nextChecked);
    saveChecklist(nextChecked);
  }

  if (loading && tenders.length === 0) {
    return (
      <section className="page">
        <h1>Bid checklist</h1>
        <p>Loading your saved tenders...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR NEXT STEPS</div>
          <h1>Bid-readiness checklist</h1>
          <p>Track preparation separately for each saved tender.</p>
        </div>

        <div className="progress-count">
          <b>{completed}/{TASKS.length}</b>
          <small>completed</small>
        </div>
      </div>

      {error && <div className="form-note" role="alert">{error}</div>}
      {message && <div className="form-note" role="status">{message}</div>}

      {tenders.length === 0 && !loading ? (
        <div className="empty-state">
          <h3>No saved tenders yet</h3>
          <p>Go to Discover Tenders and add an opportunity to your Bid List.</p>
        </div>
      ) : (
        <>
          <div className="panel" style={{ marginBottom: 20 }}>
            <label className="task-copy">
              <b>Select a saved tender</b>
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                style={{ width: "100%", marginTop: 10, padding: 12 }}
              >
                {tenders.map((tender) => (
                  <option key={tender.id} value={tender.id}>
                    {tender.title}
                  </option>
                ))}
              </select>
            </label>

            {selectedTender && (
              <div style={{ marginTop: 16 }}>
                <b>{selectedTender.title}</b>
                <p>{selectedTender.authority}</p>
                <p>Deadline: {selectedTender.deadline}</p>
                {selectedTender.officialUrl && (
                  <a
                    href={selectedTender.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open tender source <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="panel checklist-panel">
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="results-line">
              <b>{progress}% complete</b>
              <span>{saving ? "Saving..." : status}</span>
            </div>

            {TASKS.map((task) => (
              <label
                className={`checklist-row ${checked[task.id] ? "checked" : ""}`}
                key={task.id}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checked[task.id])}
                  disabled={loading || saving}
                  onChange={(event) =>
                    toggleTask(task.id, event.target.checked)
                  }
                />

                <span className="custom-checkbox">
                  {checked[task.id] && <Check size={13} />}
                </span>

                <span className="task-copy">
                  <b>{task.title}</b>
                  <small>{task.description}</small>
                </span>

                <StatusBadge
                  status={checked[task.id] ? "Completed" : "Review"}
                />
              </label>
            ))}

            <div className="form-note">
              <Info size={17} />
              <span>
                Completion records your preparation only. It does not verify
                eligibility, validate documents, or submit a bid.
              </span>
            </div>

            <button
              type="button"
              className="button secondary"
              disabled={saving || loading}
              onClick={() => saveChecklist(checked)}
            >
              <RefreshCw size={15} />
              {saving ? "Saving..." : "Save progress"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
