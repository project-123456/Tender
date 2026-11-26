
import {
  UserRound,
  Mail,
  Building2,
  MapPin,
  BriefcaseBusiness,
  ArrowLeft,
} from "lucide-react";

export default function MyAccount({ user, profile, onBack }) {
  const name = user?.name || "User";
  const email = user?.email || "Email not available";
  const company = profile?.name || "Not added yet";

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR ACCOUNT</div>
          <h1>My account</h1>
          <p>View your personal account and business information.</p>
        </div>

        <button className="button" type="button" onClick={onBack}>
          <ArrowLeft size={16} /> Back to dashboard
        </button>
      </div>

      <div className="form-panel">
        <div className="form-title">
          <div className="section-number">
            <UserRound size={20} />
          </div>
          <div>
            <h2>Personal information</h2>
            <p>Your registered account details.</p>
          </div>
        </div>

        <div className="account-identity">
          <div className="account-avatar">{initials || "U"}</div>
          <div>
            <h2>{name}</h2>
            <p>Registered TenderBridge AI user</p>
          </div>
        </div>

        <div className="account-details">
          <div className="account-detail">
            <Mail size={18} />
            <div>
              <small>Email address</small>
              <strong>{email}</strong>
            </div>
          </div>

          <div className="account-detail">
            <Building2 size={18} />
            <div>
              <small>Business / company</small>
              <strong>{company}</strong>
            </div>
          </div>

          <div className="account-detail">
            <BriefcaseBusiness size={18} />
            <div>
              <small>Business category</small>
              <strong>{profile?.category || "Not added yet"}</strong>
            </div>
          </div>

          <div className="account-detail">
            <MapPin size={18} />
            <div>
              <small>Operating region</small>
              <strong>{profile?.region || "Not added yet"}</strong>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <span>Want to update your business information?</span>
          <button
            type="button"
            className="button primary"
            onClick={() => onBack("Business profile")}
          >
            Edit business profile
          </button>
        </div>
      </div>
    </section>
  );
}
