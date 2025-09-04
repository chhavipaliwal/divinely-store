'use client';
import React, { createContext, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { DEFAULT_CONFIG } from '@/lib/config';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/lib/localstorage-util';

interface FormType {
  limit: number;
  globalSearch: boolean;
  sort: {
    column: string;
    direction: string;
  };
  page: number;
  pages: number;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<FormType>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({
  children,
  config
}: {
  children: React.ReactNode;
  config: any;
}) => {
  // Use localStorage to persist sort preferences
  const [storedSort, setStoredSort] = useLocalStorage(
    STORAGE_KEYS.LINK_SORT_PREFERENCE,
    DEFAULT_CONFIG.sort
  );

  const formik = useFormik<FormType>({
    initialValues: {
      ...DEFAULT_CONFIG,
      ...config,
      sort: storedSort, // Use stored sort preference
      page: 1,
      pages: 1
    },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  // Save sort changes to localStorage
  useEffect(() => {
    if (
      formik.values.sort.column !== storedSort.column ||
      formik.values.sort.direction !== storedSort.direction
    ) {
      setStoredSort(formik.values.sort);
    }
  }, [formik.values.sort, storedSort, setStoredSort]);

  return (
    <FormContext.Provider value={{ formik }}>{children}</FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};
