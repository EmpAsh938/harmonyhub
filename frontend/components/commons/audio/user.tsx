import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = () => {
    return (
        <div className="flex flex-col items-center">
            <Avatar className="w-14 h-14">
                <AvatarImage src="" />
                <AvatarFallback className="capitalize font-semibold bg-blue-500 text-lg">a</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">username</p>
        </div>
    );
}

export default UserAvatar;