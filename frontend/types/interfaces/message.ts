import { UserInterface } from "./user";

export interface MessageInterface {
    _id: string;
    channelId: string;
    userId: UserInterface;
    content?: string;
    media?: string;
    createdAt: string;
}

export interface MessageSliceInterface {
    token: string;
    channelId: string;
    content?: string;
    media?: string;
}