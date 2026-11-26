
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { apiRequest } from "../api.js";
import TenderCard from "./TenderCard.jsx";

function normalizeTender(item) {
  const deadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString("en-IN")
    : "Not verified";

  const value =
    item.estimatedValue != null
      ? `₹${Number(item.estimatedValue).toLocaleString("en-IN")}`
      : "Not disclosed";

  return {
    ...item,
    id: item._id || item.id || item.externalId,
    title: item.title || "Untitled tender",
    authority: item.department || item.source || "Source not identified",
    description: item.description || "Open the source link to review the tender details.",
    category: item.category || "Unclassified",
    region: item.state || "Not verified",
    deadline,
    value,
    status: item.deadline
      ? new Date(item.deadline) < new Date()
        ? "Deadline passed"
        : "Review"
      : "Verify deadline",
    officialUrl: item.officialUrl || "",
    discoveryMode: item.discoveryMode || "manual",
  };
}

export default function DiscoverTenders({
  query,
  setQuery,
  category,
  setCategory,
  region,
  setRegion,
  onOpen,
}) {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");

  const categories = useMemo(
    () => [...new Set(tenders.map((t) => t.category).filter(Boolean))],
    [tenders]
  );

  const regions = useMemo(
    () => [...new Set(tenders.map((t) => t.region).filter(Boolean))],
    [tenders]
  );

  async function searchTenders(event) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        category,
        state: region,
      });

      const data = await apiRequest(
        `/tenders/discover?${params.toString()}`
      );

      setTenders((data.items || []).map(normalizeTender));
    } catch (err) {
      setTenders([]);
      setError(err.message || "Unable to discover tenders.");
    } finally {
      setLoading(false);
    }
  }

  async function saveTender(tender) {
    if (!tender.id) {
      setError("This tender has no database ID yet.");
      return;
    }

    setSavingId(tender.id);
    setError("");

    try {
      await apiRequest(`/tenders/${tender.id}/save`, {
        method: "PUT",
      });
      setError("");
      window.alert("Tender added to your saved Bid List.");
    } catch (err) {
      setError(err.message || "Could not save this tender.");
    } finally {
      setSavingId("");
    }
  }

  useEffect(() => {
    // Do not automatically call the search API on every render.
    // The user starts discovery with the Search button.
  }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">PUBLIC PROCUREMENT INTELLIGENCE</div>
          <h1>Discover tenders</h1>
          <p>
            Search live web results, review the source, and save
            opportunities for your bid preparation.
          </p>
        </div>

        <span className="demo-label">LIVE SEARCH</span>
      </div>

      <form className="filters" onSubmit={searchTenders}>
        <label className="search-input">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. road construction, IT services, equipment"
          />
        </label>

        <label className="filter-select">
          <SlidersHorizontal size={16} />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="filter-select">
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          >
            <option value="All">All regions</option>
            {regions.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <button className="button primary" type="submit" disabled={loading}>
          <RefreshCw size={16} />
          {loading ? "Searching..." : "Search live tenders"}
        </button>
      </form>

      {error && (
        <div className="form-note" role="alert">
          {error}
        </div>
      )}

      <div className="results-line">
        <b>{tenders.length} results</b>
        <span>
          Search results require verification on the official tender portal.
        </span>
      </div>

      {loading && (
        <div className="empty-state">
          <p>Searching the web and saving discovered records...</p>
        </div>
      )}

      {!loading && tenders.length > 0 && (
        <div className="tender-list">
          {tenders.map((tender) => (
            <div key={tender.id}>
              <TenderCard
                tender={tender}
                onOpen={onOpen}
              />
              <div className="tender-card-footer">
                <button
                  className="button secondary small"
                  type="button"
                  onClick={() => saveTender(tender)}
                  disabled={savingId === tender.id}
                >
                  {savingId === tender.id ? "Saving..." : "Add to Bid List"}
                </button>

                {tender.officialUrl && (
                  <a
                    href={tender.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open source ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && searched && tenders.length === 0 && !error && (
        <div className="empty-state">
          <Search size={28} />
          <h3>No results found</h3>
          <p>Try a different search term or region.</p>
        </div>
      )}

      {!loading && !searched && (
        <div className="empty-state">
          <Search size={28} />
          <h3>Discover current opportunities</h3>
          <p>Enter a keyword and click Search live tenders.</p>
        </div>
      )}
    </section>
  );
}
