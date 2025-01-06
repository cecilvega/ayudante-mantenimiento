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
import { ComponentChangeoutTask } from "@/lib/types/maintenance";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/config/firebase";

export async function fetchComponentChangeouts(
  date: Date,
  componentName?: string,
  positionName?: string,
  equipmentName?: string,
) {
  const startOfDay = new Date(subDays(date, 120));

  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  console.log("Query parameters:", {
    startDate: startOfDay,
    componentName,
    positionName,
    equipmentName,
  });
  // Start with required date conditions
  const conditions = [
    where("startDate", ">=", Timestamp.fromDate(startOfDay)),
    where("startDate", "<=", Timestamp.fromDate(endOfDay)),
  ];

  // Add optional conditions if parameters are provided
  if (componentName) {
    conditions.push(where("componentName", "==", componentName));
  }
  if (positionName) {
    conditions.push(where("positionName", "==", positionName));
  }
  if (equipmentName) {
    conditions.push(where("equipmentName", "==", equipmentName));
  }

  const q = query(collection(db, "component_changeouts"), ...conditions);

  const snapshot = await getDocs(q);
  return snapshot.docs.reduce((acc, doc) => {
    const data = doc.data();
    return {
      ...acc,
      [doc.id]: {
        id: doc.id,
        ...data,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
      },
    };
  }, {});
}

export async function updateComponentChangeout(
  id: string,
  updates: Partial<ComponentChangeoutTask>,
) {
  console.log("Attempting to update component changeout:", id);
  const docRef = doc(db, "component_changeouts", id);
  await updateDoc(docRef, updates);
}
export async function uploadComponentImages(
  componentName: string,
  positionName: string,
  componentId: string,
  subComponent: string,
  files: FileList,
): Promise<string[]> {
  if (!navigator.onLine) {
    throw new Error("Internet connection required for image upload");
  }

  const uploadPromises = Array.from(files).map(async (file) => {
    const imageRef = ref(
      storage,
      `component-changeouts/${componentName}/${positionName}/${componentId}/${subComponent}/${file.name}`,
    );
    const snapshot = await uploadBytes(imageRef, file);
    return getDownloadURL(snapshot.ref);
  });

  return Promise.all(uploadPromises);
}

// Add this to your existing useComponentTasks hook:
export async function removeComponentChangeout(id: string): Promise<void> {
  const docRef = doc(db, "component_changeouts", id);
  await deleteDoc(docRef);
}
