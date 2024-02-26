import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import DiscoverCard from "../discoverCard";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { useEffect, useState } from "react";
import { getDiscoverServers, getSearch } from "@/store/reducers/servers/serverSlice";

const Discover = () => {

    const [searchInput, setSearchInput] = useState<string>("");

    const { discoverServers } = useAppSelector(state => state.server);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (searchInput) {
            dispatch(getSearch(searchInput));
        }
    }, [dispatch, searchInput])

    useEffect(() => {
        dispatch(getDiscoverServers(""));
    }, [dispatch])

    return (
        <div>
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
                    placeholder="Search Servers"
                />

                <FaSearch />
            </div>
            <div className="flex flex-wrap gap-8 justify-center">
                {discoverServers.length > 0 ? discoverServers.map(item => {
                    return <DiscoverCard key={item._id} {...item} />
                }) : (
                    <p className="text-center text-sm text-slate-400 w-full">No servers to show. Create servers and you can view them here.</p>

                )}

            </div>
        </div>
    );
}

export default Discover;