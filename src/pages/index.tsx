import Image from "next/image";
import Button from "@/components/button";
import { useRouter } from "next/router";
import Link from "next/link";
import LoginPageBackground from "../../public/LoginPageIMG.webp";
import { useState, ChangeEvent, FormEvent } from "react";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    console.log(`username is set to ${username}`);
    console.log(`password is set to ${password}`);
    router.push('/dashboard');
  };

  const handleCreateAccount = () =>
  {
    console.log(`Let user create an account`);
  };

  return (
    <>
      <div className="grid w-screen h-screen grid-cols-3 grid-flow-row">
       {/* <Button onClick={() => router.push("/dashboard")}>Sign in</Button>
       <Link href="/dashboard" className="underline">Go to dashboard</Link>
       <div className="relative"> */}
       <Image src={LoginPageBackground} className="col-span-2 h-screen object-cover" alt="Login page background"/>
       <div className="flex flex-col w-full justify-center h-full">
        <div className="border p-8 rounded-lg bg-amber-50 h-96 w-4/5 mx-auto space-y-4">
        <form onSubmit={handleSubmit}>
            <h1>I-漢字</h1>
            <h2>Login</h2>
            <div className="flex flex-col">
                <label htmlFor="username" className="text-sm">Username</label>
                <input 
                type="text" 
                id="username" 
                value = {username}
                onChange = {handleUsernameChange}
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="password" className="text-sm">Password</label>
                <input 
                type="password"
                 id="password"
                 value = {password}
                 onChange = {handlePasswordChange}
                 />
            </div>
            <Button onClick={handleSubmit}>Sign in</Button>
        </form>
        <Button onClick={handleCreateAccount}>Create account</Button>
        </div>
       </div>
       {/* </div> */}
      </div>
      </>
  );
}
