import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import EssayEditor, { essayWordCount } from "../components/essays/EssayEditor";
import EssayStatusBadge from "../components/essays/EssayStatusBadge";
import { PERSONAL_STATEMENT_PROMPTS } from "../lib/personalStatementPrompts";
import {
  ESSAY_STATUS,
  PERSONAL_STATEMENT_ID,
  createEssay,
  getEssay,
  saveEssayContent,
  setEssayPrompt,
  submitEssay,
} from "../lib/essaysApi";

const MIN_WORDS = 250;
const MAX_WORDS = 650;
const AUTOSAVE_DELAY_MS = 1500;

function nextStatusAfterEdit(currentStatus) {
  return currentStatus === ESSAY_STATUS.FEEDBACK_GIVEN ? ESSAY_STATUS.REVISED : currentStatus;
}

export default function EssayPersonalStatementTab() {
  const { currentUser } = useAuth();
  const [essay, setEssay] = useState(null);
  const [content, setContent] = useState("");
  const [promptIndex, setPromptIndex] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingDraft, setSavingDraft] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    getEssay(currentUser.uid, PERSONAL_STATEMENT_ID)
      .then(async (data) => {
        if (!data) {
          await createEssay(currentUser.uid, PERSONAL_STATEMENT_ID, {
            type: "personal_statement",
            title: "Personal Statement",
          });
          data = await getEssay(currentUser.uid, PERSONAL_STATEMENT_ID);
        }
        if (!ignore) {
          setEssay(data);
          setContent(data.content || "");
          setPromptIndex(typeof data.promptIndex === "number" ? String(data.promptIndex) : "");
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
  }, [currentUser.uid]);

  useEffect(() => () => saveTimer.current && clearTimeout(saveTimer.current), []);

  function handleContentChange(html) {
    setContent(html);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const status = nextStatusAfterEdit(essay.status);
        await saveEssayContent(currentUser.uid, PERSONAL_STATEMENT_ID, { title: essay.title, content: html, status });
        setEssay((prev) => ({ ...prev, content: html, status }));
      } catch (err) {
        setError(err.message);
      }
    }, AUTOSAVE_DELAY_MS);
  }

  async function handleSelectPrompt(e) {
    const value = e.target.value;
    setPromptIndex(value);
    if (value === "") return;
    const index = Number(value);
    try {
      await setEssayPrompt(currentUser.uid, PERSONAL_STATEMENT_ID, {
        promptIndex: index,
        prompt: PERSONAL_STATEMENT_PROMPTS[index],
      });
      setEssay((prev) => ({ ...prev, promptIndex: index, prompt: PERSONAL_STATEMENT_PROMPTS[index] }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSaveDraft() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSavingDraft(true);
    try {
      await saveEssayContent(currentUser.uid, PERSONAL_STATEMENT_ID, { title: essay.title, content, status: essay.status });
      setEssay((prev) => ({ ...prev, content }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingDraft(false);
    }
  }

  async function handleSubmit() {
    try {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      await saveEssayContent(currentUser.uid, PERSONAL_STATEMENT_ID, { title: essay.title, content, status: essay.status });
      await submitEssay(currentUser.uid, PERSONAL_STATEMENT_ID);
      setEssay((prev) => ({ ...prev, content, status: ESSAY_STATUS.SUBMITTED }));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const isLocked = [ESSAY_STATUS.SUBMITTED, ESSAY_STATUS.UNDER_REVIEW].includes(essay.status);
  const canSubmit = [ESSAY_STATUS.DRAFT, ESSAY_STATUS.REVISED].includes(essay.status);
  const wordCount = essayWordCount(content);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-green-800">Prompts</h3>
        <EssayStatusBadge status={essay.status} />
      </div>

      {isLocked && (
        <p className="mt-3 rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-800">
          This essay has been submitted and is waiting for mentor feedback.
        </p>
      )}

      <ol className="mt-3 list-decimal space-y-3 pl-5">
        {PERSONAL_STATEMENT_PROMPTS.map((text, i) => (
          <li
            key={i}
            className={`text-sm ${promptIndex === String(i) ? "font-semibold text-green-800" : "text-gray-700"}`}
          >
            {text}
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <label htmlFor="personal-statement-prompt" className="text-sm font-medium text-gray-700">
            Select a prompt
          </label>
          <select
            id="personal-statement-prompt"
            value={promptIndex}
            onChange={handleSelectPrompt}
            disabled={isLocked}
            className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="" disabled>
              –
            </option>
            {PERSONAL_STATEMENT_PROMPTS.map((_, i) => (
              <option key={i} value={i}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <EssayEditor content={content} onChange={handleContentChange} editable={!isLocked} />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            Min: {MIN_WORDS} Max: {MAX_WORDS}
          </span>
          <span>{wordCount} words</span>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit for review
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={isLocked || savingDraft}
            className="rounded-lg border border-green-700 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingDraft ? "Saving..." : "Save draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
