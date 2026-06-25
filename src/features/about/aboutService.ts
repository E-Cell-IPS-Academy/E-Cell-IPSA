import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { EMPTY_ABOUT } from "./types";
import type { AboutData, AboutFormValues } from "./types";

const COLLECTION = "siteContent";
const DOC_ID = "about";

/** Data-access layer for the About page content. Pure Firestore — no UI, no upload concerns. */
export async function getAbout(): Promise<AboutFormValues> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (!snap.exists()) return { ...EMPTY_ABOUT };
  return { ...EMPTY_ABOUT, ...(snap.data() as AboutData) };
}

export async function saveAbout(values: AboutFormValues): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}
