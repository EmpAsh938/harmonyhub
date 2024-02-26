"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { manageError, registerUser } from "@/store/reducers/auth/authSlice";
import { RegisterUserInterface } from "@/types/interfaces/user";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

const Register = () => {

    const [userDetails, setUserDetails] = useState<RegisterUserInterface>({} as RegisterUserInterface);

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

    const handleRegister = (event: FormEvent) => {
        event.preventDefault();
        const { email, password, username } = userDetails;

        if (email && password && username) {
            dispatch(registerUser(userDetails));
            setUserDetails({
                username: "",
                email: "",
                password: ""
            });
        } else {
            dispatch(manageError({ status: true, message: "Some Fields are empty" }));
        }
    }
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
                <h2 className="font-bold text-2xl">Create an account</h2>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="uppercase font-semibold text-sm">Email</label>
                    <Input value={userDetails.email} onChange={handleChange} id="email" name="email" className="text-black" />
                </div>
                {/* <div className="flex flex-col gap-1">
                    <label htmlFor="" className="uppercase font-semibold text-sm">Display Name</label>
                    <Input />
                </div> */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="uppercase font-semibold text-sm">Username</label>
                    <Input value={userDetails.username} onChange={handleChange} id="username" name="username" className="text-black" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="uppercase font-semibold text-sm">Password</label>
                    <Input value={userDetails.password} onChange={handleChange} id="password" name="password" className="text-black" type="password" />
                </div>

                <Button disabled={isLoading} variant='primary'>
                    {isLoading && <IoMdRefresh className="mr-2 h-4 w-4 animate-spin" />}
                    Register</Button>
                <div className="text-sm">
                    <span>Have an account?</span>
                    <Link href='/login' className="text-blue-400 text-sm ml-2 hover:underline">Login</Link>
                </div>
            </form>
        </section>
    );
}

export default Register;