"use client";

import Sidebar from "@/components/commons/home/sidebar";
import ChannelSidebar from "@/components/commons/channel/sidebar";
import MessageSidebar from "@/components/commons/message/sidebar";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import ServerInfo from "@/components/commons/home/serverInfo";
import { ReactNode, useEffect, useState } from "react";
import { clearMessages, getAllMessages } from "@/store/reducers/messages/messageSlice";
import { text } from "stream/consumers";
import VideoSidebar from "@/components/commons/video/videoSidebar";
import AudioSidebar from "@/components/commons/audio/audioSidebar";
import Loader from "@/components/commons/loader";


const ServerPage = () => {
    const pathname = usePathname().split("/server/")[1];

    const [activeComponent, setActiveComponent] = useState<ReactNode>();

    const { token } = useAppSelector(state => state.auth);
    const { activeChannel } = useAppSelector(state => state.channel);

    const dispatch = useAppDispatch();

    const chooseActiveComponent = (): ReactNode => {
        if (activeChannel.type === "text") {
            return <MessageSidebar />
        } else if (activeChannel.type === "audio") {
            return <AudioSidebar />
        } else if (activeChannel.type === "video") {
            return <VideoSidebar />
        } else {
            return <Loader />
        }
    }

    useEffect(() => {
        if (token && activeChannel) {
            setActiveComponent(chooseActiveComponent());
            dispatch(getAllMessages({ token, channelId: activeChannel._id }));
        }

        return () => {
            dispatch(clearMessages());
        }
    }, [dispatch, token, activeChannel])

    return (
        <main
            className="
       h-full
       w-full
       bg-slate-700
       "
        >
            {/* servers */}
            <section className="
        fixed top-0 left-0 h-full w-[80px] flex flex-col justify-between items-center gap-3 py-8 px-2 bg-slate-800
        ">
                <Sidebar />
            </section>
            {/* channels & other heads  */}

            <section className="fixed top-0 left-[80px] bg-slate-600 w-[250px] h-full text-white p-1
            pt-3
            ">
                <ChannelSidebar serverId={pathname} />

            </section>

            {/* header & messages & main content */}
            <section className="fixed top-0 left-[330px] w-[calc(100vw-330px)] h-full p-2 px-4 text-white">
                {(Object.keys(activeChannel).length === 0) ?
                    <ServerInfo serverId={pathname} /> : (activeComponent)}
            </section>
        </main>
    );
}

export default ServerPage;