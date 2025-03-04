'use client';
import React, { createContext, useContext } from 'react';
import { useFormik } from 'formik';
import { SortDescriptor } from '@heroui/react';
import { loadTableConfig } from '@/lib/localstorage-util';

interface FormType {
  sortDescriptor: SortDescriptor;
  limit: number;
  page: number;
  pages: number;
}

interface FormContextType {
  formik: ReturnType<typeof useFormik<FormType>>;
}

const INITIAL_CONFIG = loadTableConfig('links-homepage') || {
  sortDescriptor: {
    column: 'title',
    direction: 'ascending'
  },
  limit: 36,
  page: 1,
  pages: 1
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const formik = useFormik<FormType>({
    initialValues: INITIAL_CONFIG,
    onSubmit: async (values) => {
      console.log(values);
    }
  });

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
