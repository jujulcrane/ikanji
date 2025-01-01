import Image from 'next/image';
import { useRouter } from 'next/router';
import LoginPageBackground from '../../public/LoginPageIMG.webp';
import { useState, ChangeEvent } from 'react';
import 'firebaseui/dist/firebaseui.css';
import {
  signInWithGoogle,
  signInWithEmail,
  createAccountWithEmail,
} from '../utils/firebase';
import { FirebaseError } from 'firebase/app';
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');

  const handleDisplayNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSignInWithEmail = async () => {
    try {
      await signInWithEmail(email, password);
      console.log('User signed in successfully');
      router.push('/dashboard');
    } catch (error) {
      alert('Incorrect password or email.');
      console.error('Sign-in failed:', error);
    }
  };

  const handleCreateAccount = async () => {
    try {
      await createAccountWithEmail(email, password, displayName);
      console.log('account created successfully');
      router.push('/dashboard');
    } catch (error) {
      const firebaseError = error as FirebaseError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        alert('You already have an account. Please sign in.');
        return;
      } else {
        console.error('Account creation failed:', error);
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      console.log('signed in with Google');
      router.push('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <>
      <div className="grid w-screen h-screen md:grid-cols-3 grid-flow-row">
        <Image
          src={LoginPageBackground}
          className="md:col-span-2 md:h-screen object-cover"
          alt="Login page background"
        />
        <div className="flex flex-col w-full justify-center h-full">
          <div className="border p-8 rounded-lg bg-amber-50 h-auto w-4/5 mx-auto md:space-y-4 space-y-2">
            <h1>I-漢字</h1>
            <h2>Login</h2>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={handleSignInWithEmail}
                className="w-full py-2 px-2 font-medium rounded-md bg-black text-white hover:bg-gray-800"
              >
                Sign in with Email
              </button>
              <button
                type="button"
                onClick={handleSignInWithGoogle}
                className="flex items-center justify-center w-full py-2 px-2 font-medium rounded-md bg-black text-white hover:bg-gray-800"
              >
                <FcGoogle size={24} className="mr-2" />Continue with Google
              </button>
              <Dialog>
                <DialogTrigger className="hover:underline">New to I-Kanji? Create an Account</DialogTrigger>
                <DialogContent className="bg-customCream">
                  <DialogHeader>
                    <DialogTitle>Create an Account</DialogTitle>
                    <DialogDescription>
                      <div className="flex flex-col">
                        <label htmlFor="displayName" className="text-sm mt-2">
                          Username
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          value={displayName}
                          onChange={handleDisplayNameChange}
                          className="border p-2 rounded mb-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm mt-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
                          className="border p-2 rounded mb-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={handlePasswordChange}
                          className="border p-2 rounded mb-2"
                        />
                      </div>
                    </DialogDescription>
                    <button
                      type="button"
                      onClick={handleCreateAccount}
                      className="w-full py-2 px-2 font-medium rounded-md bg-customBrownDark text-customCream hover:opacity-50"
                    >
                      Create Account
                    </button>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
