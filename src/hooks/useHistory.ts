import { useState, useEffect, useCallback } from 'react';
import type { ConversionHistoryItem, SupportedFormat } from '../types';
import { v4 as uuidv4 } from 'uuid';

const HISTORY_KEY = 'docconvert_history';
const MAX_HISTORY = 20;

export const useHistory = () => {
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  const addToHistory = useCallback((originalName: string, convertedName: string, fromFormat: SupportedFormat, toFormat: SupportedFormat) => {
    setHistory(prev => {
      const newItem: ConversionHistoryItem = {
        id: uuidv4(),
        originalName,
        convertedName,
        fromFormat,
        toFormat,
        date: Date.now()
      };

      const newHistory = [newItem, ...prev].slice(0, MAX_HISTORY);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save history', e);
      }

      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }, []);

  return { history, addToHistory, clearHistory };
};
