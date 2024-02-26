"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { loginUser, manageError } from "@/store/reducers/auth/authSlice";
import { LoginUserInterface } from "@/types/interfaces/user";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoMdRefresh } from "react-icons/io";


const Login = () => {
    const [userDetails, setUserDetails] = useState<LoginUserInterface>({
        email: "",
        password: ""
    });

    const { isLoading } = useAppSelector(state => state.auth);

    const dispatch = useAppDispatch();


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUserDetails(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        });
    }

    const handleLogin = (event: FormEvent) => {
        event.preventDefault();
        const { email, password } = userDetails;
        if (email && password) {
            dispatch(loginUser(userDetails));
            setUserDetails({
                email: "",
                password: "",
            });
        } else {
            dispatch(manageError({ status: true, message: "Some Fields are empty" }));
        }
    };


    return (
        <section className="
        bg-slate-700
        text-white
        rounded-sm
        p-6
        flex flex-col
        gap-4
        max-w-[400px]
        w-[100%]
        ">
            <div className="text-center">
                <h2 className="font-bold text-2xl">Welcome back!</h2>
                <p className="text-slate-400 text-xs mt-2">We&apos;re so excited to see you again!</p>
            </div>



            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="uppercase font-bold text-sm">Email or Phone Number</label>
                    <Input value={userDetails.email} className="text-black" onChange={handleChange} id="email" name="email" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="uppercase font-bold text-sm">Password</label>
                    <Input value={userDetails.password} className="text-black" onChange={handleChange} id="password" name="password" type="password" />
                </div>
                <Link href='/forgot-password' className="text-blue-400 text-sm ml-2 hover:underline">Forgot your password?</Link>
                <Button type="submit" disabled={isLoading} variant="primary">
                    {isLoading && <IoMdRefresh className="mr-2 h-4 w-4 animate-spin" />}
                    Login</Button>
                <div className="text-sm">
                    <span>Need an account?</span>
                    <Link href='/register' className="text-blue-400 ml-2 hover:underline">Register</Link>
                </div>
            </form>
        </section>
    );
}

export default Login;