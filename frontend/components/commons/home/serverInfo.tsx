import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/useReactRedux";
import { formatDate } from "@/utils/formatDate";
import { AvatarFallback } from "@radix-ui/react-avatar";
import Loader from "../loader";

type Props = {
    serverId: string;
}

const ServerInfo = ({ serverId }: Props) => {
    const { servers, loading } = useAppSelector(state => state.server);

    const currentServer = servers.find(item => item._id === serverId);

    if (loading) {
        return <div className="h-screen w-full grid place-items-center">
            <Loader />
        </div>
    }

    return (
        <div className="flex flex-col items-center gap-4 p-6 w-[400px] mt-20 m-auto bg-slate-700 rounded-lg shadow-md">
            <Avatar className="w-16 h-16 bg-blue-500 text-white font-semibold grid place-items-center">
                <AvatarImage src={currentServer?.icon} />
                <AvatarFallback className="text-2xl uppercase">{currentServer?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-white capitalize">{currentServer?.name}</h2>
            <p className="text-sm text-gray-300">Total members: {currentServer?.members.length}</p>
            <p className="text-sm text-gray-300">{currentServer?.description}</p>
            <p className="text-sm text-gray-300">Created at {formatDate(currentServer?.createdAt || "")}</p>
        </div>
    );
}

export default ServerInfo;
