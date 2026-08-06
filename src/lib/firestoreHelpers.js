import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export { serverTimestamp };

export function docRef(...pathSegments) {
  return doc(db, ...pathSegments);
}

export function colRef(...pathSegments) {
  return collection(db, ...pathSegments);
}

export async function getDocData(...pathSegments) {
  const snap = await getDoc(docRef(...pathSegments));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function setDocData(pathSegments, data, { merge = true } = {}) {
  await setDoc(docRef(...pathSegments), data, { merge });
}

export async function listCollectionData(...pathSegments) {
  const snap = await getDocs(colRef(...pathSegments));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteDocData(...pathSegments) {
  await deleteDoc(docRef(...pathSegments));
}
