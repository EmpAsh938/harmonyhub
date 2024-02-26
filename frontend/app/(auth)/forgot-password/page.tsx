import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const ForgotPassword = () => {
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
                <h2 className="font-bold text-2xl">Forgot Your Password</h2>
                <p className="text-slate-400 text-xs mt-2">Enter your registered email. We&apos;ll send you reset password link.</p>
            </div>

            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="" className="uppercase font-bold text-sm">Enter your email</label>
                    <Input />
                </div>


                <Button variant='primary'>Send</Button>
                <div className="text-sm">
                    <span>Already have credentials</span>
                    <Link href='/login' className="text-blue-400 text-sm ml-2 hover:underline">Login</Link>
                </div>
            </form>
        </section>
    );
}

export default ForgotPassword;