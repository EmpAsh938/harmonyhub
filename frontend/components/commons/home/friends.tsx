import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import FriendsCard from "../friendsCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { useEffect, useState } from "react";
import { getFriendsList, getSearchFriendList } from "@/store/reducers/user/userSlice";

const Friends = () => {

    const [searchInput, setSearchInput] = useState<string>("");

    const { token } = useAppSelector(state => state.auth);
    const { user } = useAppSelector(state => state.user);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (token && searchInput) {
            dispatch(getSearchFriendList({ token, query: searchInput }));
        }
    }, [dispatch, token, searchInput])

    useEffect(() => {
        if (token) {
            dispatch(getFriendsList(token));
        }
    }, [dispatch, token])

    return (
        <div className="flex flex-col gap-4">
            <div className="my-8 w-[400px] bg-slate-600 m-auto flex items-center rounded pr-3">
                <Input
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                    className="flex-1 bg-transparent outline-none border-none ring-0 
                focus:outline-none focus:border-transparent
                focus-visible:outline-none focus-visible:border-transparent 
                focus-visible:ring-0
                focus-visible:ring-offset-0
                placeholder:text-slate-400"
                    placeholder="Search Friends"
                />

                <FaSearch />
            </div>
            <div className="flex flex-wrap gap-2">
                {user.friends && user.friends.length > 0 ?
                    (user.friends.map(friend => {
                        return <FriendsCard key={friend._id} {...friend} />
                    })) : (
                        <p className="text-center text-sm text-slate-400 w-full">No friends to show. Add friends and you can view them here.</p>
                    )}
            </div>
        </div>
    );
}

export default Friends;