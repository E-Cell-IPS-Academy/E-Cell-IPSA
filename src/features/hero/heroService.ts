import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { EMPTY_HERO } from "./types";
import type { HeroData, HeroFormValues } from "./types";

const COLLECTION = "siteContent";
const DOC_ID = "hero";

/** Data-access layer for the hero document. Pure Firestore — no UI, no upload. */
export async function getHero(): Promise<HeroData> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (snap.exists()) {
    return { ...EMPTY_HERO, ...(snap.data() as Partial<HeroData>) };
  }
  return { ...EMPTY_HERO };
}

export async function saveHero(values: HeroFormValues): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}
