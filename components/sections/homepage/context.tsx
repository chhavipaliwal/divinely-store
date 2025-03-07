'use client';
import React, { createContext, useContext } from 'react';
import { useFormik } from 'formik';
import { SortDescriptor } from '@heroui/react';
import { DEFAULT_CONFIG } from '@/lib/config';

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
  const formik = useFormik<FormType>({
    initialValues: {
      ...DEFAULT_CONFIG,
      ...config,
      page: 1,
      pages: 1
    },
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
