import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { manageFriendsList } from "@/store/reducers/user/userSlice";
import { UserInterface } from "@/types/interfaces/user";


const FriendsCard = ({ avatar, username, _id }: UserInterface) => {

    const { token } = useAppSelector(state => state.auth);

    const dispatch = useAppDispatch();

    const handleRemoveFriend = () => {
        if (token && _id) {
            dispatch(manageFriendsList({ token, userId: _id }));
        }
    }
    return (
        <div className="flex flex-col gap-1 items-center w-36 py-2">

            <Avatar className="w-16 h-16 text-2xl">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-blue-500 uppercase font-semibold">{username.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold capitalize">@{username}</h3>
            <Button onClick={handleRemoveFriend} className="bg-slate-500 hover:bg-slate-600">Remove Friend</Button>
        </div>
    );
}

export default FriendsCard;