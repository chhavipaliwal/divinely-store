/**
 * Utility functions for managing localStorage preferences
 */

export const STORAGE_KEYS = {
  LINK_SORT_PREFERENCE: 'linkSortPreference',
  DASHBOARD_SORT_PREFERENCE: 'dashboardSortPreference',
  DASHBOARD_VISIBLE_COLUMNS: 'dashboardVisibleColumns'
} as const;

/**
 * Clear all stored preferences
 */
export const clearAllPreferences = () => {
  if (typeof window === 'undefined') return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

/**
 * Clear specific preference
 */
export const clearPreference = (key: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

/**
 * Get all stored preferences
 */
export const getAllPreferences = () => {
  if (typeof window === 'undefined') return {};

  const preferences: Record<string, any> = {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        preferences[key] = JSON.parse(value);
      } catch {
        preferences[key] = value;
      }
    }
  });

  return preferences;
};
