import Category from "@/components/commons/category";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { getAllChannels, manageActiveChannel } from "@/store/reducers/channels/channelSlice";
import { ChangeEvent, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Loader from "../loader";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChannelInterface } from "@/types/interfaces/channel";
import { clearLastMessage, clearMessages } from "@/store/reducers/messages/messageSlice";
import { MdCloudUpload, MdRefresh } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServerUpdateInterface } from "@/types/interfaces/server";
import { deleteServerForUser, getAllMembers, joinToServer, removeFromServer, updateServerForUser } from "@/store/reducers/servers/serverSlice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { manageFriendsList } from "@/store/reducers/user/userSlice";
import useFileUpload from "@/hooks/useFileUpload";
import Image from "next/image";


type Props = {
    serverId: string;
}

const ChannelSidebar = ({ serverId }: Props) => {
    const { token } = useAppSelector(state => state.auth);
    const { user: { _id: userId, friends } } = useAppSelector(state => state.user);
    const { servers, loading: serverLoading, members } = useAppSelector(state => state.server);
    const { channels, loading: channelLoading } = useAppSelector(state => state.channel);


    const currentServer = servers.find(item => item._id == serverId);

    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isMemberOpen, setIsMemberOpen] = useState<boolean>(false);
    const [isMembersFetching, setIsMembersFetching] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [serverData, setServerData] = useState<ServerUpdateInterface>({


    } as ServerUpdateInterface);
    const [file, setFile] = useState<File | null>(null);


    const { handleFileUpload, isLoading, error, imageUrl } = useFileUpload();




    const dispatch = useAppDispatch();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setServerData(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        })
    }

    const fetchMember = () => {
        if (token && serverId) {
            dispatch(getAllMembers({ token, serverId }));
            setIsMembersFetching(false);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            // Accessing the first file in the list
            const selectedFile = fileList[0];
            setFile(selectedFile);
        }
    };

    const handleSubmit = () => {
        const { token, name, serverId } = serverData;

        if (token && name && serverId) {
            console.log(serverData)
            dispatch(updateServerForUser(serverData));
            setIsUpdateOpen(false);
        }
    }

    const handleDelete = () => {
        if (password && token && currentServer?._id) {
            dispatch(deleteServerForUser({ token: token, serverId: currentServer._id }));
            setPassword("");
            setIsDeleteOpen(false);
        }
    }


    const handleViewDetails = () => {
        dispatch(manageActiveChannel({} as ChannelInterface));
        dispatch(clearMessages());
        dispatch(clearLastMessage());
    }

    const handleAddFriend = (id: string) => {
        if (token && id) {
            dispatch(manageFriendsList({ token, userId: id }));
            setIsMemberOpen(false);

        }
    }

    const handleRemoveFromServer = (id: string) => {
        if (token && serverId && id) {
            dispatch(removeFromServer({ token, serverId, userId: id }));
            // setIsMemberOpen(false);

        }
    }
    const handleAddToServer = () => {
        if (token && serverId) {
            dispatch(joinToServer({ token, serverId, users: [username] }));
            // setIsMemberOpen(true);
            setUsername("");
        }
    }

    const handleUploadCloudinary = async () => {
        try {
            if (file) {
                await handleFileUpload(file);
            }

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {


        if (token && serverId && channels.length == 0) {
            dispatch(getAllChannels({ token, serverId }));
        }

    }, [dispatch, token, serverId])

    useEffect(() => {
        if (imageUrl) {
            setServerData(prev => {
                return {
                    ...prev,
                    icon: imageUrl,
                }
            })
        }
    }, [imageUrl])

    useEffect(() => {
        if (isMemberOpen) {
            fetchMember();
        }
    }, [isMemberOpen])

    useEffect(() => {
        if (token && currentServer && currentServer._id) {

            setServerData({
                token,
                name: currentServer?.name || "",
                icon: currentServer?.icon || "",
                description: currentServer?.description || "",
                serverId: currentServer?._id || "",
            })
        }
    }, [token, currentServer])

    useEffect(() => {
        if (file) {
            handleUploadCloudinary();
            setFile(null);
        }
    }, [file])


    if (channelLoading || serverLoading) {
        return <div className="flex items-center justify-center pt-8">
            <Loader />
        </div>
    }

    const isOwner = currentServer?.ownerId === userId;

    return (
        <>
            <div className="flex items-center justify-between text-sm font-semibold pl-2">
                <h3 className="capitalize">{currentServer?.name}&apos;s Server</h3>
                <DropdownMenu>
                    <DropdownMenuTrigger>

                        <IoIosArrowDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-600 text-white border-none outline-none ring-0 ring-offset-none flex flex-col items-start gap-2">
                        {isOwner && <Dialog open={isUpdateOpen}>
                            <DialogTrigger className="text-sm pl-2" onClick={() => setIsUpdateOpen(true)}>

                                Update Server

                            </DialogTrigger>
                            <DialogContent className="bg-slate-700 border-none text-white">
                                <div>
                                    <h2 className="font-bold text-2xl text-center">Create your own server</h2>
                                    <p className="font-medium text-xs text-slate-400 text-center">Your server is where you and your friends hangout. Make yours and start hanging out.</p>

                                    {/* upload image  */}
                                    <div className="my-4 flex justify-center">

                                        <div className="w-[150px] flex justify-center items-center border border-slate-400 border-dashed py-3">
                                            <label htmlFor="image">
                                                {isLoading ? <MdRefresh className="text-white- text-4xl animate-spin" /> : serverData.icon ? <Image src={serverData.icon} width={150} height={200} alt="Upload Media" /> : <MdCloudUpload className="text-5xl m-auto" />}
                                                <p className="text-sm text-center text-slate-400 font-medium">Click to upload</p>
                                            </label>
                                            <Input onChange={handleFileChange} className="hidden" id="image" type="file" />
                                        </div>

                                    </div>


                                    <div className="mt-4">
                                        <label htmlFor="name" className="uppercase font-bold text-sm">Server name</label>
                                        <Input value={serverData.name} name="name" id="name" onChange={handleChange} className="text-black mt-1" />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="description" className="uppercase font-bold text-sm">Description</label>
                                        <Input value={serverData.description} name="description" id="description" onChange={handleChange} className="text-black mt-1" />
                                    </div>


                                    <div className="flex items-center justify-between mt-4">
                                        <Button onClick={() => setIsUpdateOpen(false)} className="bg-slate-500 border-none">Cancel</Button>
                                        <Button disabled={isLoading} onClick={handleSubmit} variant="primary">Create</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>}

                        <Dialog open={isMemberOpen}>
                            <DialogTrigger className="text-sm pl-2" onClick={() => setIsMemberOpen(true)}>

                                Manage Members

                            </DialogTrigger>
                            <DialogContent className="bg-slate-700 border-none text-white">
                                <div>
                                    <h2 className="font-bold text-2xl text-center mb-2">Manage Members</h2>
                                    <div className="flex gap-2 mb-2">
                                        <Input value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 bg-transparent border-none outline-none focus:border-none focus-visible:ring-0 ring-0 ring-offset-0" placeholder="Add user to server" />
                                        <Button disabled={!isOwner} onClick={handleAddToServer} variant="primary">Add</Button>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-scroll flex flex-col gap-2">

                                        {isMembersFetching ? <Loader /> : members.length > 0 ? members.map(member => {
                                            const isCurrentUser = member._id == userId;
                                            const isFriend = friends.some(friend => friend._id === member._id);

                                            return <div key={member._id} className="flex flex-col gap-1">
                                                <div className="flex justify-between items-center">

                                                    <div className="flex gap-1 justify-start">
                                                        <div>
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage src={member.avatar} />
                                                                <AvatarFallback className="bg-blue-500 uppercase font-bold">{member.username.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className="flex flex-col">

                                                            <p className="font-semibold text-sm">@{member.username}</p>
                                                            <p className="text-sm font-medium text-slate-400">{member.email}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{member._id == currentServer?.ownerId ? "Owner" : "Member"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button onClick={() => handleAddFriend(member._id)} disabled={isCurrentUser} variant="primary" className="inline-block">{isFriend ? "Remove" : "Add"} Friend</Button>
                                                    <Button onClick={() => handleRemoveFromServer(member._id)} variant="destructive" disabled={isCurrentUser || !isOwner} className="inline-block ml-2">Remove From Server</Button>
                                                </div>
                                            </div>
                                        }) : null}

                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <Button onClick={() => setIsMemberOpen(false)} className="bg-slate-500 border-none">Cancel</Button>
                                        {/* <Button onClick={handleDelete} variant="destructive">Delete</Button> */}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <DropdownMenuItem className="hover:bg-transparent p-0 pl-2 focus:bg-transparent hover:text-white focus:text-white" onClick={handleViewDetails}>View Details</DropdownMenuItem>

                        {isOwner && <Dialog open={isDeleteOpen}>
                            <DialogTrigger className="text-sm pl-2" onClick={() => setIsDeleteOpen(true)}>

                                Delete Server

                            </DialogTrigger>
                            <DialogContent className="bg-slate-700 border-none text-white">
                                <div>
                                    <h2 className="font-bold text-2xl text-center">Delete server</h2>
                                    <p className="font-medium text-xs text-slate-400 text-center">Your server is going to be deleted</p>


                                    <div className="mt-4">
                                        <label htmlFor="password" className="uppercase font-bold text-sm">Password</label>
                                        <Input value={password} name="password" id="password" onChange={handleChange} type="password" className="text-black mt-1" />
                                    </div>



                                    <div className="flex items-center justify-between mt-4">
                                        <Button onClick={() => setIsDeleteOpen(false)} className="bg-slate-500 border-none">Cancel</Button>
                                        <Button onClick={handleDelete} variant="destructive">Delete</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="my-4 bg-slate-500 w-full h-[1px]"></div>
            {/* list of category with channels  */}
            <Category categoryName="Text Channel" channels={channels.filter(item => item.type === "text")} />
            {/* <Category categoryName="Audio Channel" channels={channels.filter(item => item.type === "audio")} /> */}
            <Category categoryName="Video Channel" channels={channels.filter(item => item.type === "video")} />
        </>

    );
}

export default ChannelSidebar;