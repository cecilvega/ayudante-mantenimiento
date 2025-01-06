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
import { subDays } from "date-fns";
import { BacklogTask } from "@/lib/types/maintenance";

export async function fetchBacklogs(date: Date, equipmentName?: string) {
  const startOfDay = new Date(subDays(date, 120));
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Start with required date conditions
  const conditions = [
    where("startDate", ">=", Timestamp.fromDate(startOfDay)),
    where("startDate", "<=", Timestamp.fromDate(endOfDay)),
  ];

  // Add equipment filter if provided
  if (equipmentName) {
    conditions.push(where("equipmentName", "==", equipmentName));
  }

  const q = query(collection(db, "backlogs"), ...conditions);

  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    return {
      ...acc,
      [doc.id]: {
        id: doc.id,
        ...data,
      },
    };
  }, {});
}

export async function updateBacklog(id: string, updates: Partial<BacklogTask>) {
  console.log("Attempting to update backlog:", id);
  const docRef = doc(db, "backlogs", id);
  await updateDoc(docRef, updates);
}

export async function removeBacklog(id: string): Promise<void> {
  const docRef = doc(db, "backlogs", id);
  await deleteDoc(docRef);
}
