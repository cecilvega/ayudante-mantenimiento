import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { JustDoItTask } from "@/lib/types/maintenance";

export async function fetchJustDoIts(equipmentName?: string) {
  // Build query conditions
  const conditions = [];

  // Add equipment filter if provided
  if (equipmentName) {
    conditions.push(where("equipmentName", "==", equipmentName));
  }

  // Only get tasks from the last 7 days or pending tasks
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  conditions.push(where("createdAt", ">=", Timestamp.fromDate(sevenDaysAgo)));

  const q = query(collection(db, "just_do_its"), ...conditions);

  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    return {
      ...acc,
      [doc.id]: {
        id: doc.id,
        ...data,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        completedAt:
          data.completedAt instanceof Timestamp
            ? data.completedAt.toDate().toISOString()
            : data.completedAt,
      },
    };
  }, {});
}

export async function updateJustDoIt(
  id: string,
  updates: Partial<JustDoItTask>,
) {
  console.log("Attempting to update just do it task:", id);
  const docRef = doc(db, "just_do_its", id);

  // If status is being updated to completed, add completedAt timestamp
  if (updates.status === "completed" && !updates.completedAt) {
    updates.completedAt = new Date().toISOString();
  }

  await updateDoc(docRef, updates);
}

export async function removeJustDoIt(id: string): Promise<void> {
  const docRef = doc(db, "just_do_its", id);
  await deleteDoc(docRef);
}
