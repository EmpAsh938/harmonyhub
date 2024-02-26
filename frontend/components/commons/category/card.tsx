import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdAdd } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { createNewChannel } from "@/store/reducers/channels/channelSlice";
import { useState } from "react";
import { ChannelsType } from "@/types/types/channels";
import { usePathname } from "next/navigation";

type Props = {
    categoryName: string;
    isCollapsed: boolean;
    toggleCollapse: Function;
}

const CategoryCard = (props: Props) => {

    const [name, setName] = useState<string>("");
    const [type, setType] = useState<ChannelsType>("text");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

    const { token } = useAppSelector(state => state.auth);
    const serverId = usePathname().split('/server/')[1];
    const dispatch = useAppDispatch();

    const handleRadioChange = (value: ChannelsType) => {
        setType(value);
    }

    const handleClick = () => {
        if (token && serverId && name && type) {
            setIsAlertOpen(false);
            dispatch(createNewChannel({ token, serverId, name, type, isPrivate }));
        }
    }
    return (
        <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <div className="flex items-center uppercase font-semibold gap-1" onClick={() => props.toggleCollapse(!props.isCollapsed)}>
                {props.isCollapsed ? (<IoIosArrowUp className="text-base" />) :
                    (<IoIosArrowDown className="text-base" />)}
                <h3 className="cursor-pointer">{props.categoryName}</h3>
            </div>

            <AlertDialog open={isAlertOpen}>
                <AlertDialogTrigger onClick={() => setIsAlertOpen(true)} className=" bg-slate-600 text-white">
                    <MdAdd className="text-base" />

                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-700 border-none text-white">
                    <div>
                        <h2 className="font-bold text-2xl text-center">Create Channel</h2>
                        <p className="font-medium text-xs text-slate-400 text-center">Choose channel type, insert channel name and toggle private channel options to create new channel.</p>

                        <div>
                            <h3 className="uppercase font-bold text-sm mb-2">Channel Type</h3>
                            <RadioGroup value={type} onValueChange={handleRadioChange}>
                                <div className="flex items-center text-white space-x-2">
                                    <RadioGroupItem value="text" id="text" />
                                    <Label htmlFor="text">Text</Label>
                                </div>
                                {/* <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="audio" id="audio" />
                                    <Label htmlFor="audio">Audio</Label>
                                </div> */}
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="video" id="video" />
                                    <Label htmlFor="video">Video</Label>
                                </div>
                            </RadioGroup>

                        </div>


                        <div className="mt-4">
                            <label htmlFor="" className="uppercase font-bold text-sm">Channel name</label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} className="text-black mt-1" />
                        </div>

                        <div className="my-2">

                            <div className="flex items-center justify-between">
                                <h3 className="uppercase font-bold text-sm">Private Channel</h3>
                                <Switch checked={isPrivate} onCheckedChange={() => setIsPrivate(!isPrivate)} className="" />
                            </div>
                            <p className="font-medium text-xs text-slate-400 text-left">Choose channel type, insert channel name and toggle private channel options to create new channel.</p>
                        </div>



                        <div className="flex items-center justify-between mt-4">
                            <AlertDialogCancel onClick={() => setIsAlertOpen(false)} className="bg-slate-500 border-none">Cancel</AlertDialogCancel>
                            <Button onClick={handleClick} variant="primary">Create</Button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default CategoryCard;