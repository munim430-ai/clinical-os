import { getItem, setItem } from "@/lib/storage";

const KEY = "drug_bookmarks";
const MAX = 50;

export type BookmarkEntry = {
  id: number;
  brandName: string;
  genericName: string | null;
  strength: string | null;
};

export function getBookmarks(): BookmarkEntry[] {
  return getItem<BookmarkEntry[]>(KEY) ?? [];
}

export function isBookmarked(id: number): boolean {
  return getBookmarks().some((b) => b.id === id);
}

/** Returns new bookmarked state (true = added, false = removed). */
export function toggleBookmark(entry: BookmarkEntry): boolean {
  const current = getBookmarks();
  const idx = current.findIndex((b) => b.id === entry.id);
  if (idx >= 0) {
    setItem(
      KEY,
      current.filter((_, i) => i !== idx),
    );
    return false;
  }
  setItem(KEY, [entry, ...current].slice(0, MAX));
  return true;
}
