import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInterface } from "@/types/interfaces/message";
import { formatDate } from "@/utils/formatDate";
import Image from "next/image";



const MessageBox = ({ content, media, createdAt, userId }: MessageInterface) => {

    return (
        <div className="flex gap-4 mb-4 w-3/4">
            <div>
                {/* avatar  */}
                <Avatar className="w-10 h-10">
                    <AvatarImage src={userId.avatar} />
                    <AvatarFallback className=" bg-blue-500 text-lg capitalize">{userId.username.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {/* user  */}
                    <span className="text-sm font-bold">@{userId.username}</span>
                    {/* created at  */}
                    <span className="text-slate-400 text-sm">Sent at {formatDate(createdAt)}</span>
                </div>
                <div>
                    {/* text message  */}
                    <p className="text-sm text-justify">{content}</p>
                    {/* media  */}
                    {media && <Image src={media} width={300} height={200} alt={content || "lorem"} />}

                </div>

            </div>
        </div>
    );
}

export default MessageBox;