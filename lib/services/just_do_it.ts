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

  // Get tasks from the last month
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  conditions.push(where("startDate", ">=", Timestamp.fromDate(monthAgo)));

  const q = query(collection(db, "just_do_its"), ...conditions);

  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    return {
      ...acc,
      [doc.id]: {
        id: doc.id,
        ...data,
        startDate: data.startDate, // Keep as Timestamp
        endDate: data.endDate, // Keep as Timestamp
      },
    };
  }, {});
}

export async function updateJustDoIt(
  id: string,
  updates: Partial<JustDoItTask> & { duration?: number },
) {
  console.log("Attempting to update just do it task:", id);
  const docRef = doc(db, "just_do_its", id);

  // Handle duration-based updates
  const processedUpdates = { ...updates };

  // If we have both startDate and duration, calculate endDate
  if (updates.startDate && "duration" in updates) {
    const duration = updates.duration as number;
    const startDate = updates.startDate;
    const endDate = Timestamp.fromDate(
      new Date(startDate.toMillis() + duration * 60 * 60 * 1000),
    );

    delete processedUpdates.duration; // Remove duration from updates
    processedUpdates.endDate = endDate; // Add calculated endDate
  }

  await updateDoc(docRef, processedUpdates);
}

export async function removeJustDoIt(id: string): Promise<void> {
  const docRef = doc(db, "just_do_its", id);
  await deleteDoc(docRef);
}
