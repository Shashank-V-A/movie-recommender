'use client';

import { useState, useEffect } from 'react';

export function useSavedTitles() {
  const [savedTitles, setSavedTitles] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load saved titles from localStorage
    const saved = localStorage.getItem('savedTitles');
    if (saved) {
      setSavedTitles(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleSave = (titleId: string) => {
    setSavedTitles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(titleId)) {
        newSet.delete(titleId);
      } else {
        newSet.add(titleId);
      }
      // Save to localStorage
      localStorage.setItem('savedTitles', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const isSaved = (titleId: string) => savedTitles.has(titleId);

  const getSavedTitleIds = () => Array.from(savedTitles);

  return { toggleSave, isSaved, getSavedTitleIds };
}

