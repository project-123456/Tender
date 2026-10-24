import {
  Search,
  FileText,
  GitCompareArrows,
  ListChecks,
  Info,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Search selected public sources for tenders matching the business category and region.",
    Icon: Search,
  },
  {
    number: "02",
    title: "Understand",
    description:
      "Organize stated requirements, deadlines, documents, and source references.",
    Icon: FileText,
  },
  {
    number: "03",
    title: "Compare",
    description:
      "Compare known business details with tender conditions and flag missing information.",
    Icon: GitCompareArrows,
  },
  {
    number: "04",
    title: "Prepare",
    description:
      "Generate a preliminary checklist of items to verify before deciding to bid.",
    Icon: ListChecks,
  },
];

export default function HowItWorks() {
  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            A TRANSPARENT WORKFLOW
          </div>

          <h1>How TenderBridge works</h1>

          <p>
            From scattered tender notices to evidence-based
            bidding decisions.
          </p>
        </div>
      </div>

      <div className="steps-grid">
        {steps.map(({ number, title, description, Icon }) => (
          <article className="panel step-card" key={number}>
            <span className="step-number">{number}</span>

            <div className="step-icon">
              <Icon size={23} />
            </div>

            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <div className="disclaimer">
        <Info size={16} />
        <span>
          TenderBridge AI is decision support, not legal advice
          or a guarantee of eligibility. Verify requirements
          against official tender sources.
        </span>
      </div>
    </section>
  );
}