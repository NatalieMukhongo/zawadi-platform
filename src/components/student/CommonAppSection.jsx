import { useEffect, useState } from "react";
import { getCommonAppChecklist, updateCommonAppChecklistItem } from "../../lib/studentDashboardApi";

const ITEMS = [
  { key: "personalStatement", label: "Personal statement" },
  { key: "supplementalEssays", label: "Supplemental essays" },
  { key: "otherEssays", label: "Other essays" },
  { key: "activitiesHonors", label: "Activities/honors" },
  { key: "recommendation", label: "Recommendation" },
];

const STATUSES = [
  { key: "not_started", label: "Not started", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
  { key: "in_progress", label: "In progress", color: "#c2410c", bg: "#ffedd5", border: "#fdba74" },
  { key: "completed", label: "Completed", color: "#15803d", bg: "#dcfce7", border: "#86efac" },
];

const STATUS_BY_KEY = Object.fromEntries(STATUSES.map((s) => [s.key, s]));

export default function CommonAppSection({ uid }) {
  const [checklist, setChecklist] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCommonAppChecklist(uid)
      .then((data) => setChecklist(data || {}))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [uid]);

  async function handleSetStatus(itemKey, status) {
    setChecklist((prev) => ({ ...prev, [itemKey]: status }));
    try {
      await updateCommonAppChecklistItem(uid, itemKey, status);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 border-l-4 border-l-green-600 bg-white p-5 shadow-sm">
      <h2 className="text-center text-xl font-bold text-green-800">Common App Progress</h2>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-3 text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="mt-4 space-y-3">
          {ITEMS.map((item) => {
            const currentStatus = checklist[item.key] || "not_started";
            const statusInfo = STATUS_BY_KEY[currentStatus];
            return (
              <div
                key={item.key}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2"
              >
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
                <select
                  value={currentStatus}
                  onChange={(e) => handleSetStatus(item.key, e.target.value)}
                  className="rounded-lg border px-2 py-1 text-sm font-semibold"
                  style={{
                    color: statusInfo.color,
                    backgroundColor: statusInfo.bg,
                    borderColor: statusInfo.border,
                  }}
                >
                  {STATUSES.map((status) => (
                    <option key={status.key} value={status.key} style={{ color: status.color }}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
