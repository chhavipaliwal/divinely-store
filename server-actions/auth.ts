'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { generateOtp } from '@/lib/functions';
import { sendMail } from '@/lib/functions';
import { otpEmail } from '@/utils/emails/otp';
import bcrypt from 'bcryptjs';

export async function sendOtp({
  email,
  type
}: {
  email: string;
  type: 'register' | 'forgot-password';
}) {
  await connectDB();
  if (type === 'register') {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('User already exists');
    }
  } else if (type === 'forgot-password') {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
  }
  const otp = generateOtp();

  // maximum otpCount = 3
  const isOtp = await Otp.findOne({ id: email });
  if (isOtp) {
    if (isOtp.otpCount >= 3) {
      throw new Error('Maximum OTP count reached');
    }
    await Otp.updateOne(
      { id: email },
      { $set: { otpCount: isOtp.otpCount + 1 } }
    );
  } else {
    await Otp.create({ id: email, otp: otp, otpCount: 1 });
  }

  const emails = [
    sendMail({
      to: email,
      subject: 'OTP for Registration',
      message: otpEmail({ otp }),
      title: 'Divinely Store'
    })
  ];
  Promise.all(emails);

  return { message: 'OTP sent successfully' };
}

export async function verifyOtp({
  email,
  otp
}: {
  email: string;
  otp: string;
}) {
  await connectDB();
  const isOtp = await Otp.findOne({ id: email });
  if (!isOtp) {
    throw new Error('Invalid OTP');
  }
  if (isOtp.otp != otp) {
    throw new Error('Invalid OTP');
  }
  await Otp.deleteOne({ id: email });
  return { message: 'OTP verified successfully' };
}

export async function updatePassword({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.updateOne({ email }, { $set: { password: hashedPassword } });
  return { message: 'Password updated successfully' };
}
