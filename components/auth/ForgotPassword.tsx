'use client';
import { addToast, Avatar, Button, InputOtp, Input } from '@heroui/react';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryState } from 'nuqs';
import { sendOtp, updatePassword, verifyOtp } from '@/server-actions/auth';

const ForgotPassword = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [count, setCount] = useState(0);
  const [email, setEmail] = useQueryState('email', {
    defaultValue: ''
  });

  const formik = useFormik({
    initialValues: {
      id: email,
      otp: ''
    },
    validationSchema: Yup.object({
      id: Yup.string().required('Email or Phone Number is required')
    }),
    onSubmit: async (values) => {
      try {
        if (values.otp) {
          await verifyOtp({ email: values.id, otp: values.otp }).then(() => {
            setIsVerified(true);
          });
        } else {
          await sendOtp({ email: values.id, type: 'forgot-password' }).then(
            () => {
              addToast({
                title: 'OTP sent successfully',
                color: 'success'
              });
              setIsOtpSent(true);
            }
          );
        }
      } catch (error: any) {
        console.log(error);
        addToast({
          title: error.response.data.message,
          color: 'danger'
        });
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
    try {
      const res = await axios.post('/api/auth/forgot-password', {
        id: formik.values.id
      });
      addToast({
        title: res.data.message,
        color: 'success'
      });
    } catch (error: any) {
      console.log(error);
      addToast({
        title: error.response.data.message,
        color: 'danger'
      });
    }
  };

  return (
    <>
      <div className="mt-12 flex h-full w-full flex-col items-center justify-center">
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <div className="flex flex-col items-center pb-6">
            <Avatar src="/logo.png" className="p-2" size="lg" />
            <p className="mb-4 text-xl font-medium">
              {isVerified
                ? 'Reset Password'
                : isOtpSent
                  ? 'Enter OTP'
                  : 'Forgot Password'}
            </p>
            <p className="text-center text-small text-default-500">
              {isVerified
                ? 'Password must be atleast 8 characters'
                : isOtpSent
                  ? `We have send a verification code to ${formik.values.id}`
                  : 'Enter your email / phone number to reset your password'}
            </p>
          </div>
          {isVerified ? (
            <UpdatePassword id={formik.values.id} />
          ) : (
            <form
              className="flex flex-col gap-3"
              onSubmit={formik.handleSubmit}
            >
              {!isOtpSent && (
                <Input
                  autoFocus
                  label="Email"
                  name="id"
                  variant="bordered"
                  onChange={(e) => {
                    formik.setFieldValue('id', e.target.value);
                    setEmail(e.target.value);
                  }}
                  value={formik.values.id}
                  isInvalid={
                    formik.touched.id && formik.errors.id ? true : false
                  }
                  errorMessage={formik.errors.id}
                  isDisabled={isOtpSent}
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
                        className="cursor-pointer select-none text-primary hover:underline"
                        onClick={resendOtp}
                      >
                        Resend Code
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Button
                color="primary"
                type="submit"
                isLoading={formik.isSubmitting}
                isDisabled={
                  !formik.isValid || (isOtpSent && formik.values.otp.length < 4)
                }
              >
                {isOtpSent ? 'Verify Otp' : 'Send Otp'}
              </Button>
              <Link
                href="/auth/login"
                className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

interface UpdatePasswordProps {
  id: string;
}

const UpdatePassword = ({ id }: UpdatePasswordProps) => {
  const [email, setEmail] = useQueryState('email', {
    defaultValue: ''
  });
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .required('Please retype your password.')
        .oneOf([Yup.ref('password')], 'Your passwords do not match.')
    }),
    onSubmit: async (values) => {
      try {
        await updatePassword({ email, password: values.password });
        addToast({
          title: 'Password updated successfully',
          color: 'success'
        });
        router.push('/auth/login');
      } catch (error: any) {
        console.log(error);
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
          label="New Password"
          name="password"
          type="password"
          variant="bordered"
          onChange={formik.handleChange}
          value={formik.values.password}
          isInvalid={
            formik.touched.password && formik.errors.password ? true : false
          }
          errorMessage={formik.errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
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
          Update Password
        </Button>
        <Link
          href="/auth/login"
          className="cursor-pointer select-none text-center text-sm text-primary hover:underline"
        >
          Back to login
        </Link>
      </form>
    </>
  );
};
