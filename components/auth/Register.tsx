'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Avatar,
  Button,
  Link,
  Input,
  addToast,
  InputOtp,
  Spinner,
  Form
} from '@heroui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import React from 'react';
import axios from 'axios';
import { sendOtp, verifyOtp } from '@/server-actions/auth';
import { cn } from '@/lib/utils';
import { parseAsBoolean, useQueryState } from 'nuqs';

export default function Register() {
  const [isOtpSent, setIsOtpSent] = useState(false);

  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [count, setCount] = useState(0);
  const [email, setEmail] = useQueryState('email', {
    defaultValue: ''
  });

  console.log(isOtpSent);

  useEffect(() => {
    const sp = searchParams.get('otp') ?? '';
    if (sp) {
      setIsOtpSent(true);
    } else {
      setIsOtpSent(false);
    }
  }, [searchParams.get('otp')]);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      id: email,
      otp: '',
      password: '',
      confirmPassword: '',
      isChecked: false,
      isResending: false
    },
    onSubmit: async (values) => {
      try {
        if (values.otp) {
          await verifyOtp({ email: values.id, otp: values.otp })
            .then(() => {
              setIsVerified(true);
            })
            .catch((e) => {
              formik.setFieldError('otp', e.message);
            });
        } else {
          await sendOtp({ email: values.id, type: 'register' }).then(() => {
            setIsOtpSent(true);
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  });

  useEffect(() => {
    if (count > 5) {
      addToast({
        title: 'Maximum attempts reached. Please try again later.',
        color: 'danger'
      });
      setIsOtpSent(false);
      setIsVerified(false);
      setCount(0);
      formik.setFieldValue('otp', '');
    }
  }, [count]);

  const resendOtp = async () => {
    formik.setFieldValue('isResending', true);
    try {
      await sendOtp({ email: formik.values.id, type: 'register' });
      setIsOtpSent(true);
      setCount(0);
      formik.setFieldValue('otp', '');
      addToast({
        title: 'OTP sent successfully',
        color: 'success'
      });
    } catch (error: any) {
      addToast({
        title: error.message,
        color: 'danger'
      });
      console.error(error);
    } finally {
      formik.setFieldValue('isResending', false);
    }
  };

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col justify-center gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-6">
            <Avatar src="/logo.png" className="p-2" size="lg" />
            <p className="text-xl font-medium">
              {isVerified
                ? 'Complete Profile'
                : isOtpSent
                  ? 'Enter OTP'
                  : 'Welcome'}
            </p>
            <p className="text-center text-small text-default-500">
              {isVerified
                ? 'Enter your details to continue'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.id}`
                  : 'Enter your email to register'}
            </p>
          </div>
          {isVerified ? (
            <DetailForm />
          ) : (
            <>
              {!isOtpSent && (
                <IdInput
                  onSubmit={() => {
                    setIsOtpSent(true);
                  }}
                />
              )}
              {isOtpSent && (
                <>
                  <div className="mb-2 flex flex-col items-center justify-center">
                    <InputOtp
                      length={4}
                      value={formik.values.otp}
                      autoFocus
                      onValueChange={(value) =>
                        formik.setFieldValue('otp', value)
                      }
                      onComplete={() => formik.handleSubmit()}
                      isInvalid={
                        formik.touched.otp && formik.errors.otp ? true : false
                      }
                      errorMessage={formik.errors.otp}
                    />

                    <div className="mt-4 flex flex-col items-center justify-between px-1 py-2 text-small text-default-500">
                      <p>Didn&apos;t receive the code?</p>
                      <span
                        className={cn(
                          'cursor-pointer select-none text-primary hover:underline',
                          {
                            'pointer-events-none opacity-50 hover:no-underline':
                              formik.values.isResending
                          }
                        )}
                        onClick={resendOtp}
                      >
                        Resend Code
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <p className="text-center text-small">
            Already have an account?&nbsp;
            <Link href="/auth/login" size="sm">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const IdInput = ({ onSubmit }: { onSubmit: () => void }) => {
  const [email, setEmail] = useQueryState('email', {
    defaultValue: ''
  });

  const formik = useFormik({
    initialValues: {
      email: email
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .min(3, 'Email must be at least 3 characters long')
        .max(50, 'Email must be less than 50 characters long')
        .required('Email is required')
    }),
    onSubmit: async (values) => {
      try {
        await sendOtp({ email: values.email, type: 'register' })
          .then(() => {
            addToast({
              title: 'OTP sent successfully',
              color: 'success'
            });
            onSubmit();
          })
          .catch((e) => {
            addToast({
              title: e.message,
              color: 'danger'
            });
          });
      } catch (error: any) {
        addToast({
          title: error.response.data.message,
          color: 'danger'
        });
        console.error(error);
      }
    }
  });

  return (
    <>
      <form className="flex flex-col gap-3">
        <Input
          isRequired
          label="Email"
          name="email"
          variant="bordered"
          value={formik.values.email}
          onChange={(e) => {
            formik.setFieldValue('email', e.target.value);
            setEmail(e.target.value);
          }}
          errorMessage={formik.errors.email}
          type="email"
          isInvalid={formik.touched.email && formik.errors.email ? true : false}
        />
        <Button
          color="primary"
          type="submit"
          fullWidth
          isLoading={formik.isSubmitting}
          onPress={() => formik.handleSubmit()}
        >
          Send OTP
        </Button>
      </form>
    </>
  );
};

const DetailForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
  const [email, setEmail] = useQueryState('email', {
    defaultValue: ''
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      id: email,
      password: '',
      confirmPassword: '',
      isChecked: false
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(3, "Name can't be less than 3 characters")
        .max(50, "Name can't be more than 50 characters"),
      id: Yup.string().required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    }),
    onSubmit: async (values) => {
      // call api /api/auth/register
      try {
        await axios.post('/api/auth/register', values);
        await signIn('credentials', {
          id: values.id,
          password: values.password,
          redirect: true,
          callbackUrl: '/'
        });
      } catch (error: any) {
        console.error(error);
        addToast({
          title: error.response.data.message,
          color: 'danger'
        });
      }
    }
  });
  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
        <Input
          label="Email"
          name="id"
          variant="bordered"
          onChange={(e) => {
            formik.setFieldValue('id', e.target.value);
          }}
          value={formik.values.id}
          isInvalid={formik.touched.id && formik.errors.id ? true : false}
          errorMessage={formik.errors.id}
          isReadOnly
          isDisabled
        />
        <Input
          label="Name"
          name="name"
          placeholder="Enter your name"
          type="text"
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.name}
          isInvalid={formik.touched.name && formik.errors.name ? true : false}
          errorMessage={formik.errors.name}
        />

        <Input
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-closed-linear"
                />
              ) : (
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-bold"
                />
              )}
            </button>
          }
          label="Password"
          name="password"
          placeholder="Enter your password"
          type={isVisible ? 'text' : 'password'}
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
          errorMessage={formik.errors.password}
        />
        <Input
          endContent={
            <button type="button" onClick={toggleConfirmVisibility}>
              {isConfirmVisible ? (
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-closed-linear"
                />
              ) : (
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon="solar:eye-bold"
                />
              )}
            </button>
          }
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          type={isConfirmVisible ? 'text' : 'password'}
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          isInvalid={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? true
              : false
          }
          errorMessage={formik.errors.confirmPassword}
        />
        <Button color="primary" type="submit" isLoading={formik.isSubmitting}>
          Register
        </Button>
      </form>
    </>
  );
};
