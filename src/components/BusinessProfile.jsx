import { Save, Info, ShieldCheck } from "lucide-react";

export default function BusinessProfile({
  profile,
  setProfile,
  onSave,
  saved,
}) {
  const update = (key, value) => {
    setProfile((old) => ({
      ...old,
      [key]: value,
    }));
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            PERSONALIZE YOUR MATCHES
          </div>

          <h1>Business profile</h1>

          <p>
            Compare known business capabilities with stated
            tender conditions.
          </p>
        </div>

        <span className="profile-note">
          <ShieldCheck size={16} />
          Self-reported details
        </span>
      </div>

      <form className="form-panel" onSubmit={onSave}>
        <div className="form-title">
          <div className="section-number">01</div>

          <div>
            <h2>Business information</h2>
            <p>Details help assess potential matches.</p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Business / company name
            <input
              value={profile.name}
              onChange={(e) =>
                update("name", e.target.value)
              }
              placeholder="e.g. Sharma Furniture Works"
            />
          </label>

          <label>
            Business category
            <select
              value={profile.category}
              onChange={(e) =>
                update("category", e.target.value)
              }
            >
              {[
                "Furniture & Fixtures",
                "IT Services",
                "Laboratory Supplies",
                "Facility Services",
                "Construction",
                "Other",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Operating region
            <select
              value={profile.region}
              onChange={(e) =>
                update("region", e.target.value)
              }
            >
              {[
                "Uttar Pradesh",
                "Delhi",
                "Rajasthan",
                "Haryana",
                "Maharashtra",
                "All India",
                "Other",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Annual turnover (₹ lakh)
            <input
              type="number"
              min="0"
              step="0.1"
              value={profile.turnover}
              onChange={(e) =>
                update("turnover", e.target.value)
              }
              placeholder="e.g. 25"
            />
          </label>

          <label>
            Relevant experience (years)
            <input
              type="number"
              min="0"
              step="1"
              value={profile.experience}
              onChange={(e) =>
                update("experience", e.target.value)
              }
              placeholder="e.g. 3"
            />
          </label>

          <label className="full-field">
            Available documents
            <textarea
              rows="3"
              value={profile.documents}
              onChange={(e) =>
                update("documents", e.target.value)
              }
              placeholder="Registration certificate, GST, audited statements..."
            />
          </label>
        </div>

        <div className="form-note">
          <Info size={17} />
          <span>
            Profile details are self-reported and are not
            independently verified documents.
          </span>
        </div>

        <div className="form-actions">
          <span>
            {saved
              ? "Saved for this browser session"
              : "You can update these details anytime."}
          </span>

          <button className="button primary" type="submit">
            <Save size={16} /> Save profile
          </button>
        </div>
      </form>
    </section>
  );
}