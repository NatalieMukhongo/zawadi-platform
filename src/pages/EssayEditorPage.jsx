import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EssayEditor, { essayWordCount } from "../components/essays/EssayEditor";
import EssayStatusBadge from "../components/essays/EssayStatusBadge";
import {
  ADDITIONAL_INFO_ESSAY_ID,
  CONTEXT_GAP_ESSAY_ID,
  DIAGNOSTIC_ESSAY_ID,
  ESSAY_STATUS,
  createEssay,
  getEssay,
  saveEssayContent,
  submitEssay,
} from "../lib/essaysApi";

const SINGLETON_DEFAULTS = {
  [DIAGNOSTIC_ESSAY_ID]: { type: "diagnostic", title: "Diagnostic Essay" },
  [CONTEXT_GAP_ESSAY_ID]: { type: "context_gap", title: "Context/Gap Essay" },
  [ADDITIONAL_INFO_ESSAY_ID]: { type: "additional_info", title: "Additional Info Essay" },
};

const AUTOSAVE_DELAY_MS = 1500;

function nextStatusAfterEdit(currentStatus) {
  return currentStatus === ESSAY_STATUS.FEEDBACK_GIVEN ? ESSAY_STATUS.REVISED : currentStatus;
}

export default function EssayEditorPage() {
  const { currentUser } = useAuth();
  const { essayId } = useParams();
  const [essay, setEssay] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const saveTimer = useRef(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setNotFound(false);

    getEssay(currentUser.uid, essayId)
      .then(async (data) => {
        if (data) {
          if (!ignore) {
            setEssay(data);
            setContent(data.content || "");
          }
          return;
        }
        const fallback = SINGLETON_DEFAULTS[essayId];
        if (!fallback) {
          if (!ignore) setNotFound(true);
          return;
        }
        await createEssay(currentUser.uid, essayId, fallback);
        const created = await getEssay(currentUser.uid, essayId);
        if (!ignore) {
          setEssay(created);
          setContent(created.content || "");
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [currentUser.uid, essayId]);

  useEffect(() => () => saveTimer.current && clearTimeout(saveTimer.current), []);

  function handleContentChange(html) {
    setContent(html);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const status = nextStatusAfterEdit(essay.status);
        await saveEssayContent(currentUser.uid, essayId, { title: essay.title, content: html, status });
        setEssay((prev) => ({ ...prev, content: html, status }));
        setSaveState("saved");
      } catch (err) {
        setError(err.message);
        setSaveState("idle");
      }
    }, AUTOSAVE_DELAY_MS);
  }

  async function handleSubmit() {
    try {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      await saveEssayContent(currentUser.uid, essayId, { title: essay.title, content, status: essay.status });
      await submitEssay(currentUser.uid, essayId);
      setEssay((prev) => ({ ...prev, content, status: ESSAY_STATUS.SUBMITTED }));
      setSaveState("saved");
    } catch (err) {
      setError(err.message);
    }
  }

  const isLocked = essay && [ESSAY_STATUS.SUBMITTED, ESSAY_STATUS.UNDER_REVIEW].includes(essay.status);
  const canSubmit = essay && [ESSAY_STATUS.DRAFT, ESSAY_STATUS.REVISED].includes(essay.status);
  const isPanelTab = essayId === CONTEXT_GAP_ESSAY_ID || essayId === ADDITIONAL_INFO_ESSAY_ID;

  return (
    <div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : notFound ? (
        <p className="text-red-600">Essay not found.</p>
      ) : (
        <div className="max-w-3xl">
          <div className={`flex flex-wrap items-center gap-2 ${isPanelTab ? "justify-end" : "justify-between"}`}>
            {!isPanelTab && <h2 className="text-2xl font-bold text-green-800">{essay.title}</h2>}
            <EssayStatusBadge status={essay.status} />
          </div>

          {essay.prompt && <p className="mt-2 text-sm italic text-gray-600">{essay.prompt}</p>}

          {isLocked && (
            <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-800">
              This essay has been submitted and is waiting for mentor feedback.
            </p>
          )}

          <div className="mt-4">
            <EssayEditor content={content} onChange={handleContentChange} editable={!isLocked} />
          </div>

          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <span>{essayWordCount(content)} words</span>
            <span>{saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : ""}</span>
          </div>

          {canSubmit && (
            <button
              onClick={handleSubmit}
              className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              Submit for review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
