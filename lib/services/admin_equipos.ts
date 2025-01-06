import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { EquipmentRecord } from "@/lib/types";

export async function fetchEquipos() {
  try {
    const snapshot = await getDocs(collection(db, "admin_equipos"));
    const data = snapshot.docs.reduce(
      (acc, doc) => ({
        ...acc,
        [doc.id]: { id: doc.id, ...doc.data() } as EquipmentRecord,
      }),
      {},
    );
    console.log("Equipment loaded:", Object.keys(data).length);
    return data;
  } catch (error) {
    console.error("Error fetching equipment:", error);
    return {};
  }
}
