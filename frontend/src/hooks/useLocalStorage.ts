import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue] as const;
}

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<string[]>('statcheck_search_history', []);

  const addSearch = useCallback(
    (name: string) => {
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.toLowerCase() !== name.toLowerCase());
        return [name, ...filtered].slice(0, 10);
      });
    },
    [setHistory]
  );

  const removeSearch = useCallback(
    (name: string) => {
      setHistory((prev) => prev.filter((h) => h !== name));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => setHistory([]), [setHistory]);

  return { history, addSearch, removeSearch, clearHistory };
}

export function useFavoriteSummoners() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('statcheck_favorites', []);

  const toggleFavorite = useCallback(
    (name: string) => {
      setFavorites((prev) =>
        prev.includes(name) ? prev.filter((f) => f !== name) : [name, ...prev]
      );
    },
    [setFavorites]
  );

  const isFavorite = useCallback((name: string) => favorites.includes(name), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
