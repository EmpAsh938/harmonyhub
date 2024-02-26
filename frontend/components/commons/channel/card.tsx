import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { ChannelsType } from "@/types/types/channels";
import { FaHashtag } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdAdd, MdCall, MdVideoCall } from "react-icons/md";
import { deleteUserChannel, getAllMembers, joinToChannel, manageActiveChannel, removeFromChannel, updateUserChannel } from "@/store/reducers/channels/channelSlice";
import { ChannelInterface, UpdateChannelInterface } from "@/types/interfaces/channel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Loader from "../loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { manageFriendsList } from "@/store/reducers/user/userSlice";
import { ScrollArea } from "@/components/ui/scroll-area";



const ChannelCard = (props: ChannelInterface) => {

    const dispatch = useAppDispatch();

    const { token } = useAppSelector(state => state.auth);
    const { user: { _id: userId, friends } } = useAppSelector(state => state.user);
    const { members } = useAppSelector(state => state.channel);

    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [isMemberOpen, setIsMemberOpen] = useState<boolean>(false);
    const [isMembersFetching, setIsMembersFetching] = useState<boolean>(true);

    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");


    const [channelData, setChannelData] = useState<UpdateChannelInterface>({
        token: token,
        channelId: props._id,
        name: props.name,
        type: props.type,
        isPrivate: props.isPrivate,
    });
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChannelData(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value,
            }
        })
    }

    const fetchMember = () => {
        if (token && props._id) {
            dispatch(getAllMembers({ token, channelId: props._id }));
            setIsMemberOpen(true);
        }
        setIsMembersFetching(false);
    }

    const handleRadioChange = (value: ChannelsType) => {
        setChannelData({
            ...channelData,
            type: value
        })
    }

    const toggleVisibility = () => {
        setChannelData({
            ...channelData,
            isPrivate: !channelData.isPrivate
        })
    }


    const handleSubmit = () => {
        const { token, channelId, name, type } = channelData;
        if (token && channelId && name && type) {
            dispatch(updateUserChannel(channelData));
            setIsUpdateOpen(false);
        }
    }

    const handleDelete = () => {
        if (token && password && props._id) {
            dispatch(deleteUserChannel({ token: token, channelId: props._id }));
            setIsDeleteOpen(false);
            setPassword("");
        }
    }

    const handleRemoveChannel = (id: string) => {
        if (token && props._id && id) {
            dispatch(removeFromChannel({ token, channelId: props._id, userId: id }));
            setIsMemberOpen(false);
        }
    }

    const handleAddtoChannel = () => {
        if (token && props._id) {
            dispatch(joinToChannel({ token, channelId: props._id, users: [username] }));
            setIsMemberOpen(false);
        }
    }

    const handleAddFriend = (userId: string) => {
        if (token && userId) {
            dispatch(manageFriendsList({ token, userId }));
            setIsMemberOpen(false);
        }
    }


    const handleClick = () => {
        dispatch(manageActiveChannel(props));
    }


    return (
        <div className="flex items-center cursor-pointer justify-between text-sm p-1 text-slate-300 font-medium">
            <div onClick={handleClick} className="flex items-center gap-1 px-3">
                {props.type == 'text' && <FaHashtag className="text-base" />}
                {props.type == 'audio' && <MdCall className="text-base" />}
                {props.type == 'video' && <MdVideoCall className="text-base" />}
                <h3>{props.name}</h3>
            </div>
            <div className="">
                <DropdownMenu>
                    <DropdownMenuTrigger>

                        <IoMdSettings className="text-base" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-600 text-white border-none outline-none ring-0 ring-offset-none flex flex-col gap-2 items-start">
                        <Dialog open={isUpdateOpen}>
                            <DialogTrigger className="text-sm pl-2" onClick={() => setIsUpdateOpen(true)}>

                                Update Channel

                            </DialogTrigger>
                            <DialogContent className="bg-slate-700 border-none text-white">
                                <div>
                                    <h2 className="font-bold text-2xl text-center">Create Channel</h2>
                                    <p className="font-medium text-xs text-slate-400 text-center">Your Channel is where you and your friends can acutally start communicating. Make yours and start conversation.</p>


                                    <div className="mt-4">
                                        <label htmlFor="name" className="uppercase font-bold text-sm">Server name</label>
                                        <Input value={channelData.name} name="name" id="name" onChange={handleChange} className="text-black mt-1" />
                                    </div>

                                    <div>
                                        <h3 className="uppercase font-bold text-sm mb-2">Channel Type</h3>
                                        <RadioGroup name="type" value={channelData.type} onValueChange={handleRadioChange}>
                                            <div className="flex items-center text-white space-x-2">
                                                <RadioGroupItem value="text" id="text" />
                                                <Label htmlFor="text">Text</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="video" id="video" />
                                                <Label htmlFor="video">Video</Label>
                                            </div>
                                        </RadioGroup>

                                        <div className="my-2">

                                            <div className="flex items-center justify-between">
                                                <h3 className="uppercase font-bold text-sm">Private Channel</h3>
                                                <Switch checked={channelData.isPrivate} onCheckedChange={toggleVisibility} className="" />
                                            </div>
                                            <p className="font-medium text-xs text-slate-400 text-left">Choose channel type, insert channel name and toggle private channel options to create new channel.</p>
                                        </div>

                                    </div>



                                    <div className="flex items-center justify-between mt-4">
                                        <Button onClick={() => setIsUpdateOpen(false)} className="bg-slate-500 border-none">Cancel</Button>
                                        <Button onClick={handleSubmit} variant="primary">Create</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>



                        <Dialog open={isMemberOpen}>
                            <DialogTrigger className="text-sm pl-2" onClick={fetchMember}>

                                Manage Members

                            </DialogTrigger>
                            <DialogContent className="bg-slate-700 border-none text-white">
                                <div>
                                    <h2 className="font-bold text-2xl text-center mb-2">Manage Members</h2>
                                    <div className="flex gap-2 mb-2">
                                        <Input value={username} onChange={(e) => setUsername(e.target.value)} className="flex-1 bg-transparent border-none outline-none focus:border-none focus-visible:ring-0 ring-0 ring-offset-0" placeholder="Add user to channel" />
                                        <Button onClick={handleAddtoChannel} variant="primary">Add</Button>
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
                                                        <p className="font-semibold text-sm">{member._id == props.ownerId ? "Owner" : "Member"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button onClick={() => handleAddFriend(member._id)} disabled={isCurrentUser} variant="primary" className="inline-block">{isFriend ? "Remove" : "Add"} Friend</Button>
                                                    <Button onClick={() => handleRemoveChannel(member._id)} variant="destructive" disabled={isCurrentUser} className="inline-block ml-2">Remove From Channel</Button>
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
                        {/* <DropdownMenuItem className="hover:bg-transparent p-0 pl-2 focus:bg-transparent hover:text-white focus:text-white" onClick={handleViewDetails}>View Details</DropdownMenuItem> */}

                        <Dialog open={isDeleteOpen}>
                            <DialogTrigger className="text-sm pl-2" onClick={() => setIsDeleteOpen(true)}>

                                Delete Channel

                            </DialogTrigger>
                            <DialogContent className="bg-slate-700 border-none text-white">
                                <div>
                                    <h2 className="font-bold text-2xl text-center">Delete Channel</h2>
                                    <p className="font-medium text-xs text-slate-400 text-center">Your Channel is going to be deleted</p>


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
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

export default ChannelCard;