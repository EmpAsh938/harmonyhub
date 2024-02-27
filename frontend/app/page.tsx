"use client";

import { ScrollArea } from "@/components/ui/scroll-area"
import Sidebar from "@/components/commons/home/sidebar";
import { FaCompass } from "react-icons/fa";
import { IoMdMenu, IoMdPerson } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { useState } from "react";
import Friends from "@/components/commons/home/friends";
import Profile from "@/components/commons/home/profile";
import Discover from "@/components/commons/home/discover";
import SideMenu from "@/components/commons/sidemenu";
import { Tabs } from "@/types/types/channels";
import { useAppDispatch } from "@/hooks/useReactRedux";
import { handleSidebar } from "@/store/reducers/sidebar/sidebarSlice";



export default function Home() {

    const [activeTab, setActiveTab] = useState<Tabs>("friends");


    const dispatch = useAppDispatch();

    const toggleTab = (param: Tabs) => {
        dispatch(handleSidebar({ status: false }));
        setActiveTab(param);
    }

    const manageSidebar = () => {
        dispatch(handleSidebar({ status: true }));
    }




    return (
        <main
            className="
       h-full
       w-full
       bg-slate-700
       "
        >
            <SideMenu />
            {/* servers */}
            <section className="
        fixed top-0 left-0 h-full w-[80px] hidden lg:flex flex-col justify-between items-center gap-3 py-8 px-2 bg-slate-800 
        ">
                <Sidebar />
            </section>
            {/* channels & other heads  */}

            <section className="fixed hidden lg:block
             top-0 left-[80px] bg-slate-600 w-[250px] h-full text-white p-1
            pt-3
            ">
                <div className="flex flex-col py-6">

                    <div className={`flex items-center gap-4 px-4 py-2 ${activeTab === "friends" && "bg-blue-500"} hover:bg-blue-500 cursor-pointer`} onClick={() => toggleTab("friends")} >
                        <FaPeopleGroup className="text-xl" />
                        <h3 className="text-sm font-semibold">Friends</h3>
                    </div>
                    <div className={`flex items-center gap-4 px-4 py-2 ${activeTab === "profile" && "bg-blue-500"} hover:bg-blue-500 cursor-pointer`} onClick={() => toggleTab("profile")} >
                        <IoMdPerson className="text-xl" />
                        <h3 className="text-sm font-semibold">Profile</h3>
                    </div>
                    <div className={`flex items-center gap-4 px-4 py-2 ${activeTab === "discover" && "bg-blue-500"} hover:bg-blue-500 cursor-pointer`} onClick={() => toggleTab("discover")}>
                        <FaCompass className="text-xl" />
                        <h3 className="text-sm font-semibold">Discover</h3>
                    </div>
                </div>

            </section>

            {/* header & messages & main content */}
            <ScrollArea className="fixed top-0 left-0 lg:left-[330px] w-screen lg:w-[calc(100vw-330px)] h-full p-2 px-4 text-white">
                <div className="flex gap-2 cursor-pointer items-center">
                    <IoMdMenu className="text-2xl text-white" onClick={manageSidebar} />
                    <h2 className="text-left font-bold text-lg capitalize p-4">{activeTab}</h2>
                </div>
                {activeTab === "friends" && <Friends />}
                {activeTab === "profile" && <Profile />}
                {activeTab === "discover" && <Discover />}
            </ScrollArea>
        </main>
    );
}
