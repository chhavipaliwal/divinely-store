'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export const sortTypes = [
  {
    value: 'name',
    label: 'Name'
  },
  {
    value: 'date',
    label: 'Date'
  },
  {
    value: 'relevance',
    label: 'Relevance'
  }
];

export interface SettingsProps {
  globalSearch: boolean;
  sortType: 'name' | 'date' | 'relevance';
  limit: number;
}

type Action =
  | { type: 'TOGGLE'; field: keyof SettingsProps }
  | { type: 'RESET'; defaultSettings: SettingsProps }
  | { type: 'UPDATE_SORT_TYPE'; sortType: 'name' | 'date' | 'relevance' }
  | { type: 'UPDATE_LIMIT'; limit: number };

export const defaultSettings: SettingsProps = {
  globalSearch: false,
  sortType: 'name',
  limit: 12
};

function settingsReducer(state: SettingsProps, action: Action): SettingsProps {
  switch (action.type) {
    case 'TOGGLE':
      return { ...state, [action.field]: !state[action.field] };
    case 'RESET':
      return action.defaultSettings;
    case 'UPDATE_SORT_TYPE':
      return { ...state, sortType: action.sortType };
    case 'UPDATE_LIMIT':
      return { ...state, limit: action.limit };
    default:
      return state;
  }
}

const SettingsContext = createContext<{
  settings: SettingsProps;
  dispatch: React.Dispatch<Action>;
}>({ settings: defaultSettings, dispatch: () => null });

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    defaultSettings,
    () => {
      if (typeof window !== 'undefined') {
        const savedSettings = localStorage.getItem('settings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
      }
      return defaultSettings;
    }
  );

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
