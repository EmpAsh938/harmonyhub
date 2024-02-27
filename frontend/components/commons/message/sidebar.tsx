"use client";

import { IoMdCloudUpload, IoMdSend } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import MessageBox from "./messageBox";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { clearLastMessage, clearMessages, createNewMessage, saveMessage } from "@/store/reducers/messages/messageSlice";
import io, { Socket } from 'socket.io-client';
import { MessageInterface } from "@/types/interfaces/message";
import Loader from "../loader";
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";
import { MdEmojiSymbols, MdRefresh } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';




const MessageSidebar = () => {

    const [message, setMessage] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [mediaUrl, setMediaUrl] = useState<string>("");
    // const [emojiOpener, setEmojiOpener] = useState<boolean>(false);



    const { handleFileUpload, isLoading, error, imageUrl } = useFileUpload();

    const { token } = useAppSelector(state => state.auth);
    const { activeChannel } = useAppSelector(state => state.channel);
    const { messages, lastMessage, loading } = useAppSelector(state => state.message);

    const socket = useRef<Socket | null>(null);

    const messageContainerRef = useRef<HTMLDivElement>(null);


    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };
    const handleClick = (event: FormEvent) => {
        event.preventDefault(); // Add parentheses to call preventDefault

        if (message.trim() == "" && !imageUrl) {
            console.log("Atleast content/message or media is needed");
            return;
        }

        if (token && activeChannel._id) {
            dispatch(createNewMessage({ token, channelId: activeChannel._id, content: message, media: imageUrl || "" }));
            setMediaUrl("");
            setMessage(""); // Clear content after sending message
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
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            socket.current = io(process.env.API_ENDPOINT || "https://harmonyhub-jj6z.onrender.com");
            return () => {
                dispatch(clearLastMessage());
                dispatch(clearMessages());
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, []);

    useEffect(() => {
        if (socket.current && activeChannel._id) {
            socket.current.emit("join channel", activeChannel._id);
            socket.current.on("chat", (message: MessageInterface) => {
                if (Object.keys(message).length > 0) {
                    dispatch(saveMessage(message));

                }
            });
        }
    }, [activeChannel._id]);

    useEffect(() => {


        // Scroll to the bottom of the message container
        if (messages.length > 0 && messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }

        if (socket.current && lastMessage._id) {
            socket.current.emit("chat", activeChannel._id, lastMessage);
            dispatch(clearLastMessage());
        }


    }, [messages.length, lastMessage._id]);

    useEffect(() => {
        if (file) {
            handleUploadCloudinary();
            setFile(null);
        }
    }, [file])

    useEffect(() => {
        if (imageUrl) {
            setMediaUrl(imageUrl);
        }
    }, [imageUrl])


    if (loading) {
        return <div className="h-screen w-full grid place-items-center">
            <Loader />
        </div>
    }
    return (
        <>
            {/* top bar  */}
            <div className="">
                <h2 className="capitalize font-semibold">{activeChannel.name}</h2>
                <p className="text-xs text-slate-400">{activeChannel.members.length} members</p>
            </div>
            {/* main content & message  */}

            <div ref={messageContainerRef} className="flex flex-col py-4 h-[calc(100vh-100px)] pb-[70px] overflow-auto">
                {messages && messages.length > 0 ? messages.map(item => <MessageBox key={item._id} {...item} />) : <div className="text-center">
                    <h2 className="text-2xl font-bold">Welcome to {activeChannel.name}</h2>
                    <p className="text-sm text-slate-400 font-semibold">Be the first to start conversation</p>
                </div>}
            </div>

            {/* message  */}
            <div className="fixed bottom-0 left-0 lg:left-[330px] w-screen lg:w-[calc(100vw-330px)] h-[100px] bg-slate-800 flex flex-col justify-center px-4">
                <form onSubmit={handleClick} className="flex p-3 rounded bg-slate-500 items-center">
                    <div>
                        <label htmlFor="media">
                            {isLoading ? <MdRefresh className="text-white animate-spin" /> : (mediaUrl ? <Image src={mediaUrl} height={50} width={50} alt="Upload Media" /> : <IoMdCloudUpload className="text-2xl" />)}
                        </label>
                        <Input onChange={handleFileChange} id="media" type="file" accept="image/*" className="hidden" />
                    </div>
                    {/* <MdEmojiSymbols onClick={() => setEmojiOpener(true)} className="mx-1 text-2xl cursor-pointer" /> */}
                    {/* <EmojiPicker className="fixed bottom-0 left-[330px]" open={emojiOpener} /> */}
                    <Input value={message} name="content" onChange={handleChange} className="mx-1 bg-transparent border-none outline-none focus:border-none focus-visible:ring-0 ring-0 ring-offset-0 flex-1 placeholder:text-slate-300" placeholder="Message" />
                    <IoMdSend onClick={handleClick} className="text-2xl cursor-pointer" />
                </form>
            </div>
        </>
    );
}

export default MessageSidebar;