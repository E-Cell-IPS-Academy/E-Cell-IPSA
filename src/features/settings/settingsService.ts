import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { EMPTY_SETTINGS } from "./types";
import type { SiteSettings } from "./types";

const COLLECTION = "siteContent";
const DOC_ID = "settings";

/** Data-access layer for site settings. Pure Firestore — no UI, no upload concerns. */
export async function getSettings(): Promise<SiteSettings> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  if (!snap.exists()) return { ...EMPTY_SETTINGS };
  const data = snap.data() as Partial<SiteSettings>;
  return {
    ...EMPTY_SETTINGS,
    ...data,
    socialLinks: {
      ...EMPTY_SETTINGS.socialLinks,
      ...(data.socialLinks ?? {}),
    },
    announcementBar: {
      ...EMPTY_SETTINGS.announcementBar,
      ...(data.announcementBar ?? {}),
    },
  };
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), {
    ...settings,
    updatedAt: serverTimestamp(),
  });
}
