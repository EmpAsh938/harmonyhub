import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { joinToServer, removeFromServer } from "@/store/reducers/servers/serverSlice";
import { ServerInterface } from "@/types/interfaces/server";

const DiscoverCard = (props: ServerInterface) => {

    const { token } = useAppSelector(state => state.auth);
    const { user } = useAppSelector(state => state.user);

    const dispatch = useAppDispatch();

    const handleClick = (serverId: string, joined: boolean) => {
        if (!joined) {
            dispatch(joinToServer({
                token, serverId,
                users: []
            }));
        } else {
            dispatch(removeFromServer({
                token, userId: user._id,
                serverId
            }))
        }
    }
    const alreadyMember = props.members.includes(user._id);
    return (
        <div className="w-[250px] p-4 flex flex-col gap-2 items-center bg-slate-600 rounded">
            <Avatar className="w-16 h-16 text-2xl">
                <AvatarImage src={props.icon} />
                <AvatarFallback className="bg-blue-500 uppercase">{props.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-medium text-sm">{props.members.length} Members</p>
            <h3 className="font-semibold capitalize">#{props.name}</h3>
            <h3 className="font-semibold text-xs text-slate-400 capitalize text-justify">{props.description}</h3>
            {/* <p className="text-sm font-medium">Created At {formatDate(props.)}</p> */}
            <Button onClick={() => handleClick(props._id, alreadyMember)} variant="primary">{alreadyMember ? "Joined" : "Join"}</Button>
        </div>
    );
}

export default DiscoverCard;