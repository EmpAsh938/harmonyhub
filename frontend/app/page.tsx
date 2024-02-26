"use client";

import { ScrollArea } from "@/components/ui/scroll-area"
import Sidebar from "@/components/commons/home/sidebar";
import { FaCompass } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { useState } from "react";
import Friends from "@/components/commons/home/friends";
import Profile from "@/components/commons/home/profile";
import Discover from "@/components/commons/home/discover";

type Tabs = "friends" | "profile" | "discover";


export default function Home() {

    const [activeTab, setActiveTab] = useState<Tabs>("friends");



    const toggleTab = (param: Tabs) => {
        setActiveTab(param);
    }




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
            <ScrollArea className="fixed top-0 left-[330px] w-[calc(100vw-330px)] h-full p-2 px-4 text-white">
                <div>
                    <h2 className="text-left font-bold text-lg capitalize p-4">{activeTab}</h2>
                </div>
                {activeTab === "friends" && <Friends />}
                {activeTab === "profile" && <Profile />}
                {activeTab === "discover" && <Discover />}
            </ScrollArea>
        </main>
    );
}
