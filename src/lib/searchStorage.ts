const STORAGE_KEY = "passeador_search";

export interface SavedSearch {
  destino: { id: string; name: string } | null;
  date: string | null;
  adults: number;
  kids: number;
}

export function loadSearch(): SavedSearch | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function saveSearch(data: SavedSearch) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
