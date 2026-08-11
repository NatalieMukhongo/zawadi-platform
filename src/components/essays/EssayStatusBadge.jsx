const STATUS_STYLES = {
  draft: { label: "Draft", color: "#4b5563", bg: "#f3f4f6", border: "#d1d5db" },
  submitted: { label: "Submitted", color: "#c2410c", bg: "#ffedd5", border: "#fdba74" },
  under_review: { label: "Under review", color: "#b45309", bg: "#fef3c7", border: "#fcd34d" },
  feedback_given: { label: "Feedback given", color: "#1d4ed8", bg: "#dbeafe", border: "#93c5fd" },
  revised: { label: "Revised", color: "#15803d", bg: "#dcfce7", border: "#86efac" },
};

export default function EssayStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold"
      style={{ color: style.color, backgroundColor: style.bg, borderColor: style.border }}
    >
      {style.label}
    </span>
  );
}
