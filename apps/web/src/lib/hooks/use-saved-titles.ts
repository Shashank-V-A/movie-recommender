'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'savedTitles';

export function useSavedTitles() {
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());

  // Load saved titles from localStorage
  const loadSavedTitles = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedTitles(new Set(Array.isArray(parsed) ? parsed : []));
      }
    } catch (error) {
      console.error('Error loading saved titles:', error);
      setSavedTitles(new Set());
    }
  }, []);

  useEffect(() => {
    loadSavedTitles();
  }, [loadSavedTitles]);

  // Listen for storage changes (when localStorage is updated from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadSavedTitles();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadSavedTitles]);

  const toggleSave = useCallback((titleId: string) => {
    setSavedTitles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(titleId)) {
        newSet.delete(titleId);
        console.log(`Removed ${titleId} from saved titles`);
      } else {
        newSet.add(titleId);
        console.log(`Added ${titleId} to saved titles`);
      }
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)));
        console.log('Updated localStorage:', Array.from(newSet));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      return newSet;
    });
  }, []);

  const isSaved = useCallback((titleId: string) => {
    const result = savedTitles.has(titleId);
    console.log(`Is ${titleId} saved?`, result);
    return result;
  }, [savedTitles]);

  const getSavedTitleIds = useCallback(() => {
    const ids = Array.from(savedTitles);
    console.log('Current saved title IDs:', ids);
    return ids;
  }, [savedTitles]);

  return { toggleSave, isSaved, getSavedTitleIds };
}

