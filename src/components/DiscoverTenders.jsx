import { Search, SlidersHorizontal } from "lucide-react";
import TenderCard from "./TenderCard.jsx";

export default function DiscoverTenders({
  tenders,
  query,
  setQuery,
  category,
  setCategory,
  region,
  setRegion,
  onOpen,
}) {
  const categories = [
    ...new Set(tenders.map((t) => t.category)),
  ];

  const regions = [
    ...new Set(tenders.map((t) => t.region)),
  ];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            PUBLIC PROCUREMENT INTELLIGENCE
          </div>

          <h1>Discover tenders</h1>

          <p>
            Search illustrative opportunities and review
            their requirements.
          </p>
        </div>

        <span className="demo-label">DEMO DATA</span>
      </div>

      <div className="filters">
        <label className="search-input">
          <Search size={18} />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, authority, reference..."
          />
        </label>

        <label className="filter-select">
          <SlidersHorizontal size={16} />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-select">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="All">All regions</option>

            {regions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="results-line">
        <b>{tenders.length} opportunities</b>
        <span>Source-backed review required</span>
      </div>

      <div className="tender-list">
        {tenders.map((tender) => (
          <TenderCard
            key={tender.id}
            tender={tender}
            onOpen={onOpen}
          />
        ))}
      </div>

      {tenders.length === 0 && (
        <div className="empty-state">
          <Search size={28} />
          <h3>No tenders found</h3>
          <p>Try another keyword or filter.</p>
        </div>
      )}
    </section>
  );
}