"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdAdd, MdCloudUpload, MdLogout, MdRefresh } from "react-icons/md";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getRandomColor } from "@/utils/colorGenerator";
import { ServerSliceInterface } from "@/types/interfaces/server";
import { logoutUser } from "@/store/reducers/auth/authSlice";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { getUser } from "@/store/reducers/user/userSlice";
import { createServerForUser, getAllServers } from "@/store/reducers/servers/serverSlice";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Loader from "../loader";
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";





const Sidebar = () => {
    const [serverData, setServerData] = useState<ServerSliceInterface>({} as ServerSliceInterface);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);

    const { servers, loading } = useAppSelector(state => state.server);
    const { token } = useAppSelector(state => state.auth);
    const { handleFileUpload, isLoading, error, imageUrl } = useFileUpload();


    const router = useRouter();
    const dispatch = useAppDispatch();



    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setServerData(prev => {
            return {
                ...prev,
                token,
                [event.target.name]: event.target.value,
            }
        });
    }

    const handleSubmit = () => {

        if (token) {
            setIsOpen(false);
            dispatch(createServerForUser(serverData));
            setServerData({} as ServerSliceInterface);
        }
    }

    const handleLogout = () => {
        if (token) {
            dispatch(logoutUser(token));
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            // Accessing the first file in the list
            const selectedFile = fileList[0];
            setFile(selectedFile);
        }
    };

    const handleUploadCloudinary = async () => {
        try {
            if (file) {
                await handleFileUpload(file);
            }

        } catch (err) {
            console.log(err);
        }
    }



    useEffect(() => {
        dispatch(getUser(token));
        dispatch(getAllServers(token));
        if (!token) {
            router.push('/login');
        }
    }, [token])

    useEffect(() => {
        if (file) {
            handleUploadCloudinary();
            setFile(null);
        }
    }, [file])

    useEffect(() => {
        if (imageUrl) {
            setServerData(prev => {
                return {
                    ...prev,
                    icon: imageUrl,
                }
            })
        }
    }, [imageUrl])


    return (
        <>

            <div className="flex flex-col items-center">

                {/* app logo  */}
                <Link href="/">
                    <Avatar className="rounded-md">
                        <AvatarImage src="/assets/images/logo.png" />
                        <AvatarFallback>HH</AvatarFallback>
                    </Avatar>
                </Link>

                <div className="bg-slate-500 w-full h-[1px] my-4"></div>

                <div className="flex flex-col gap-2 text-white">

                    {/* servers  */}
                    {loading ? <Loader /> :
                        servers.length > 0 && (
                            servers.map(item => {
                                const color = getRandomColor();
                                return <Link
                                    key={item._id}
                                    href={`/server/${item._id}`}
                                >
                                    <Avatar
                                        className="bg-blue-500">
                                        <AvatarImage src={item.icon} />
                                        <AvatarFallback className={`bg-[${color}] font-semibold uppercase`}>{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            })
                        )
                    }
                </div>


                {servers.length > 0 && <div className="bg-slate-500 w-full h-[1px] my-4"></div>}

                <AlertDialog open={isOpen}>
                    <AlertDialogTrigger onClick={() => setIsOpen(true)} className="rounded-full bg-slate-600 h-12 w-12 grid place-items-center text-white">
                        <MdAdd className="text-2xl" />

                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-700 border-none text-white">
                        <div>
                            <h2 className="font-bold text-2xl text-center">Create your own server</h2>
                            <p className="font-medium text-xs text-slate-400 text-center">Your server is where you and your friends hangout. Make yours and start hanging out.</p>

                            {/* upload image  */}
                            <div className="my-4 flex justify-center">

                                <div className="w-[150px] flex justify-center items-center border border-slate-400 border-dashed py-3">
                                    <label htmlFor="image">
                                        {isLoading ? <MdRefresh className="text-white- text-4xl animate-spin" /> : serverData.icon ? <Image src={serverData.icon} height={200} width={300} alt="upload media" /> : <MdCloudUpload className="text-5xl m-auto" />}
                                        <p className="text-sm text-center text-slate-400 font-medium">Click to upload</p>
                                    </label>
                                    <Input onChange={handleFileChange} className="hidden" id="image" type="file" accept="image/*" />
                                </div>

                            </div>


                            <div className="mt-4">
                                <label htmlFor="name" className="uppercase font-bold text-sm">Server name</label>
                                <Input name="name" id="name" onChange={handleChange} className="text-black mt-1" />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="description" className="uppercase font-bold text-sm">Description</label>
                                <Input name="description" id="description" onChange={handleChange} className="text-black mt-1" />
                            </div>


                            <div className="flex items-center justify-between mt-4">
                                <AlertDialogCancel onClick={() => setIsOpen(false)} className="bg-slate-500 border-none">Cancel</AlertDialogCancel>
                                <Button disabled={isLoading} onClick={handleSubmit} variant="primary">{isLoading ? <MdRefresh /> : "Create"}</Button>
                            </div>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>


            <div>
                <Button onClick={handleLogout} className="bg-transparent hover:bg-transparent">
                    <MdLogout className="text-2xl" />
                </Button>
            </div>

        </>
    );
}

export default Sidebar;