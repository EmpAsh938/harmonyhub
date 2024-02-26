import { useAppSelector } from "@/hooks/useReactRedux";
import UserAvatar from "./user";

const AudioSidebar = () => {
    const { activeChannel } = useAppSelector(state => state.channel);
    return (
        <div>
            <div className="flex gap-4 items-center">

                <h2 className="font-bold py-4 capitalize text-xl">{activeChannel.name}</h2>
                <span className="text-sm text-slate-400 font-medium">{activeChannel.members.length} members</span>
            </div>

            <div>
                <div>
                    <h2 className="font-semibold">Connected Users</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <UserAvatar />
                </div>
            </div>
        </div>
    );
}

export default AudioSidebar;