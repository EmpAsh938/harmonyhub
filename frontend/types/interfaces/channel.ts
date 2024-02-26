import { ChannelsType } from "../types/channels";

export interface ChannelInterface {
    _id: string;
    name: string;
    serverId: string;
    ownerId: string;
    type: ChannelsType;
    isPrivate: boolean;
    members: string[];
}

export interface ChannelServerInterface {
    token: string;
    serverId: string;
}

export interface ChannelManageInterface {
    token: string;
    channelId: string;
}

export interface NewChannelInterface extends ChannelServerInterface {
    name: string;
    type: ChannelsType;
    isPrivate: boolean;
}

export interface UpdateChannelInterface {
    channelId: string;
    token: string;
    name: string;
    type: ChannelsType;
    isPrivate: boolean;
}

export interface ChannelUserInterface extends ChannelManageInterface {
    userId: string;
}

export interface ChannelBulkInterface extends ChannelManageInterface {
    users: string[];
}