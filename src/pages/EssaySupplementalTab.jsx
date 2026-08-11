import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EssayStatusBadge from "../components/essays/EssayStatusBadge";
import { createEssay, listEssays, newSupplementalEssayId } from "../lib/essaysApi";

export default function EssaySupplementalTab() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [essays, setEssays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  useEffect(() => {
    listEssays(currentUser.uid)
      .then(setEssays)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [currentUser.uid]);

  const supplementalEssays = essays.filter((e) => e.type === "supplemental");

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const essayId = newSupplementalEssayId();
    try {
      await createEssay(currentUser.uid, essayId, {
        type: "supplemental",
        title: newTitle.trim(),
        prompt: newPrompt.trim(),
      });
      navigate(`/essays/${essayId}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 border-l-4 border-l-green-600 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-end">
        <button onClick={() => setAdding((prev) => !prev)} className="text-sm font-semibold text-green-800 underline">
          {adding ? "Cancel" : "+ Add essay"}
        </button>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {adding && (
        <form onSubmit={handleAdd} className="mt-3 space-y-2 rounded-lg border border-gray-200 p-3">
          <input
            type="text"
            placeholder="Title (e.g. Why This School)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
          <textarea
            placeholder="Prompt (optional)"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            rows={2}
          />
          <button
            type="submit"
            className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-800"
          >
            Create essay
          </button>
        </form>
      )}

      <div className="mt-3 space-y-2">
        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : supplementalEssays.length === 0 ? (
          <p className="text-sm text-gray-500">No supplemental essays yet.</p>
        ) : (
          supplementalEssays.map((essay) => (
            <Link
              key={essay.id}
              to={`/essays/${essay.id}`}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{essay.title}</span>
              <EssayStatusBadge status={essay.status} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
