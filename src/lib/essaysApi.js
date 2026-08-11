import {
  getDocData,
  setDocData,
  listCollectionData,
  deleteDocData,
  serverTimestamp,
} from "./firestoreHelpers";

export const ESSAY_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  FEEDBACK_GIVEN: "feedback_given",
  REVISED: "revised",
};

export const PERSONAL_STATEMENT_ID = "personal-statement";
export const DIAGNOSTIC_ESSAY_ID = "diagnostic";
export const CONTEXT_GAP_ESSAY_ID = "context-gap-essay";
export const ADDITIONAL_INFO_ESSAY_ID = "additional-info-essay";

export async function listEssays(uid) {
  return listCollectionData("users", uid, "essays");
}

export async function getEssay(uid, essayId) {
  return getDocData("users", uid, "essays", essayId);
}

export async function createEssay(uid, essayId, { type, title, prompt = "" }) {
  await setDocData(
    ["users", uid, "essays", essayId],
    {
      type,
      title,
      prompt,
      content: "",
      status: ESSAY_STATUS.DRAFT,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function saveEssayContent(uid, essayId, { title, content, status }) {
  await setDocData(
    ["users", uid, "essays", essayId],
    { title, content, status, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function setEssayPrompt(uid, essayId, { promptIndex, prompt }) {
  await setDocData(
    ["users", uid, "essays", essayId],
    { promptIndex, prompt, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function submitEssay(uid, essayId) {
  await setDocData(
    ["users", uid, "essays", essayId],
    { status: ESSAY_STATUS.SUBMITTED, submittedAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function deleteEssay(uid, essayId) {
  await deleteDocData("users", uid, "essays", essayId);
}

export function newSupplementalEssayId() {
  return crypto.randomUUID();
}
