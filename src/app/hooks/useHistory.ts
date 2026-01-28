/**
 * History from localStorage. Append newest first; update exports; delete; clear.
 */

import { useCallback, useState } from "react";
import {
  addHistoryItem,
  clearHistory as clearStorage,
  deleteHistoryItem,
  getHistory,
  updateHistoryExports,
  type HistoryItem,
} from "../lib/storage";

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>(() => getHistory());

  const refresh = useCallback(() => setItems(getHistory()), []);

  const add = useCallback((item: Omit<HistoryItem, "id">) => {
    const entry = addHistoryItem(item);
    setItems(getHistory());
    return entry;
  }, []);

  const markExport = useCallback((id: string, format: "word" | "pdf") => {
    updateHistoryExports(id, format);
    setItems(getHistory());
  }, []);

  const remove = useCallback((id: string) => {
    deleteHistoryItem(id);
    setItems(getHistory());
  }, []);

  const clear = useCallback(() => {
    clearStorage();
    setItems([]);
  }, []);

  return { items, add, markExport, remove, clear, refresh };
}
