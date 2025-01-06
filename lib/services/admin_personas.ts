import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/config/firebase";
import { PersonaRecord } from "@/lib/types";

// Standalone fetch functions

export async function fetchPersonas() {
  try {
    const snapshot = await getDocs(collection(db, "admin_personas"));
    const data = snapshot.docs.reduce(
      (acc, doc) => ({
        ...acc,
        [doc.id]: { id: doc.id, ...doc.data() } as PersonaRecord,
      }),
      {},
    );
    console.log("Personas loaded:", Object.keys(data).length);
    return data;
  } catch (error) {
    console.error("Error fetching personas:", error);
    return {};
  }
}
