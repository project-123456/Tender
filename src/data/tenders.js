export const tenders = [
  {
    id: "DEMO-001",
    title: "Supply of Office Furniture for Government Schools",
    authority: "Example Directorate of Education",
    category: "Furniture & Fixtures",
    region: "Uttar Pradesh",
    value: "₹18–24 lakh",
    deadline: "12 Nov 2026",
    status: "Review",
    type: "Goods",
    description:
      "Illustrative supply and installation of desks, chairs and storage units.",
    requirements: [
      {
        name: "Minimum annual turnover",
        value: "₹20 lakh",
        status: "Review",
        note: "Example threshold only. Verify the official tender document.",
      },
      {
        name: "Relevant past experience",
        value: "5 years",
        status: "Review",
        note: "Review the complete experience clause.",
      },
      {
        name: "Business registration",
        value: "Required",
        status: "Unknown",
        note: "Supporting documents have not been verified.",
      },
    ],
  },
  {
    id: "DEMO-002",
    title: "IT Hardware Maintenance Services",
    authority: "Example Public Authority",
    category: "IT Services",
    region: "Delhi",
    value: "₹8–12 lakh",
    deadline: "18 Nov 2026",
    status: "Unknown",
    type: "Services",
    description:
      "Illustrative maintenance and support for computers and networking equipment.",
    requirements: [
      {
        name: "Minimum annual turnover",
        value: "₹10 lakh",
        status: "Review",
        note: "Example condition; confirm against source documents.",
      },
      {
        name: "Relevant past experience",
        value: "3 similar contracts",
        status: "Unknown",
        note: "Exact criteria are not verified.",
      },
      {
        name: "Business registration",
        value: "Required",
        status: "Review",
        note: "Review the official document list.",
      },
    ],
  },
  {
    id: "DEMO-003",
    title: "Supply of Laboratory Consumables",
    authority: "Example Technical Institute",
    category: "Laboratory Supplies",
    region: "Rajasthan",
    value: "₹5–8 lakh",
    deadline: "21 Nov 2026",
    status: "Review",
    type: "Goods",
    description:
      "Illustrative supply of laboratory consumables and safety equipment.",
    requirements: [
      {
        name: "Minimum annual turnover",
        value: "₹5 lakh",
        status: "Review",
        note: "Example threshold only.",
      },
      {
        name: "Relevant past experience",
        value: "2 years",
        status: "Review",
        note: "Experience wording needs human review.",
      },
      {
        name: "Business registration",
        value: "Required",
        status: "Unknown",
        note: "Supporting documents are not confirmed.",
      },
    ],
  },
  {
    id: "DEMO-004",
    title: "Facility Management and Housekeeping",
    authority: "Example Municipal Body",
    category: "Facility Services",
    region: "Delhi",
    value: "₹30–40 lakh",
    deadline: "28 Nov 2026",
    status: "Unknown",
    type: "Services",
    description:
      "Illustrative housekeeping and facility support for designated buildings.",
    requirements: [
      {
        name: "Minimum annual turnover",
        value: "₹30 lakh",
        status: "Unknown",
        note: "Financial clause is not verified.",
      },
      {
        name: "Relevant past experience",
        value: "3 years",
        status: "Review",
        note: "Review the official eligibility criteria.",
      },
      {
        name: "Business registration",
        value: "Required",
        status: "Unknown",
        note: "Document list is incomplete.",
      },
    ],
  },
];

export const emptyProfile = {
  name: "",
  category: "Furniture & Fixtures",
  region: "Uttar Pradesh",
  turnover: "",
  experience: "",
  documents: "",
};