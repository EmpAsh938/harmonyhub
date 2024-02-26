"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"
import { manageError } from "@/store/reducers/auth/authSlice";


const AuthLayout = ({ children }: { children: React.ReactNode }) => {

    const { token, isError, errorMessage } = useAppSelector(state => state.auth);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { toast } = useToast()


    useEffect(() => {
        if (token) {
            router.push('/');
        }
    }, [token])

    useEffect(() => {
        if (isError && errorMessage) {
            toast({
                title: "Auth Error",
                description: errorMessage,
                variant: "destructive"
            });
        }
    }, [isError, errorMessage])



    useEffect(() => {
        const timer = setTimeout(() => {
            if (isError) {

                dispatch(manageError({ status: false, message: "" }));
            }
        }, 2000)

        return () => clearTimeout(timer);
    }, [])

    return (
        <main className="h-full w-full grid place-items-center bg-cover bg-center" style={{ backgroundImage: 'url(/assets/images/bg.jpg)' }}>
            {children}
        </main>

    );
}

export default AuthLayout;