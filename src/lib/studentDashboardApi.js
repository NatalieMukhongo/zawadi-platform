import {
  getDocData,
  setDocData,
  listCollectionData,
  deleteDocData,
  serverTimestamp,
} from "./firestoreHelpers";

export async function getUserProfile(uid) {
  return getDocData("users", uid);
}

export async function updateUserProfile(uid, { displayName, bio }) {
  await setDocData(["users", uid], { displayName, bio }, { merge: true });
}

export async function getMentorProfile(mentorId) {
  if (!mentorId) return null;
  return getDocData("users", mentorId);
}

export async function listSchools(uid) {
  return listCollectionData("users", uid, "schools");
}

export async function getSchool(uid, schoolId) {
  return getDocData("users", uid, "schools", schoolId);
}

export async function addSchool(uid, { scorecardId, name, city, state }) {
  await setDocData(
    ["users", uid, "schools", scorecardId],
    {
      scorecardId,
      name,
      city,
      state,
      deadline: "",
      checklist: {
        essaysSubmitted: false,
        activitiesReviewed: false,
        personalStatementLinked: false,
        applicationSubmitted: false,
      },
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateSchoolChecklist(uid, schoolId, checklist) {
  await setDocData(["users", uid, "schools", schoolId], { checklist }, { merge: true });
}

export async function updateSchoolDeadline(uid, schoolId, deadline) {
  await setDocData(["users", uid, "schools", schoolId], { deadline }, { merge: true });
}

export async function removeSchool(uid, schoolId) {
  await deleteDocData("users", uid, "schools", schoolId);
}

export async function getCommonAppChecklist(uid) {
  return getDocData("users", uid, "commonApp", "checklist");
}

export async function updateCommonAppChecklistItem(uid, itemKey, status) {
  await setDocData(
    ["users", uid, "commonApp", "checklist"],
    { [itemKey]: status, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function getSatPrepSummary(uid) {
  return getDocData("users", uid, "satPrep", "summary");
}

export async function saveSatPrepSummary(uid, { latestScore, lecturesCompleted, lecturesTotal }) {
  await setDocData(
    ["users", uid, "satPrep", "summary"],
    { latestScore, lecturesCompleted, lecturesTotal, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
