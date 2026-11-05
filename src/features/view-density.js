export const DENSITY_STORAGE_KEY = "local-lens-view-density";

export function normalizeDensity(value) {
  return value === "compact" ? "compact" : "comfortable";
}

export function readDensity(storage) {
  try {
    return normalizeDensity(storage?.getItem(DENSITY_STORAGE_KEY));
  } catch {
    return "comfortable";
  }
}

export function writeDensity(storage, density) {
  try {
    storage?.setItem(DENSITY_STORAGE_KEY, normalizeDensity(density));
  } catch {
    // The preference is optional when browser storage is unavailable.
  }
}

export function nextDensity(current) {
  return normalizeDensity(current) === "compact" ? "comfortable" : "compact";
}
