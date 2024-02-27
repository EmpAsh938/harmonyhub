import { FaCompass, FaPeopleGroup } from "react-icons/fa6";
import Sidebar from "./home/sidebar";
import { IoMdClose, IoMdPerson } from "react-icons/io";
import { useState } from "react";
import { Tabs } from "@/types/types/channels";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { handleSidebar } from "@/store/reducers/sidebar/sidebarSlice";
import { usePathname } from "next/navigation";
import ChannelSidebar from "./channel/sidebar";

const SideMenu = () => {

    const [activeTab, setActiveTab] = useState<Tabs>("friends");

    const { isSidebarOpen } = useAppSelector(state => state.sidebar);
    const { servers } = useAppSelector(state => state.server);

    const serverId = usePathname().split('/server/')[1];


    const dispatch = useAppDispatch();

    const toggleTab = (param: Tabs) => {
        dispatch(handleSidebar({ status: false }));
        setActiveTab(param);
    }


    const manageSidebar = () => {
        dispatch(handleSidebar({ status: false }));
    }


    return (
        <aside className={`fixed w-screen h-screen bg-[rgba(0,0,0,.4)] text-white z-50 flex transition-all ${isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"}`}>
            <section className="
        w-[80px] flex flex-col justify-between items-center gap-3 py-8 px-2 bg-slate-800 
        ">
                <Sidebar />
            </section>

            {/* channels & other heads  */}

            <section className="block bg-slate-600 w-[250px] text-white p-1
            pt-3
            ">
                {serverId ? (
                    <ChannelSidebar serverId={serverId} />
                ) : <div className="flex flex-col py-6">

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
                </div>}

            </section>
            <section className="p-2 flex-1 flex justify-end" onClick={manageSidebar}>
                <IoMdClose className="text-red-500 text-5xl font-bold cursor-pointer" />
            </section>
        </aside>
    );
}

export default SideMenu;