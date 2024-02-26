export interface ServerInterface {
    _id: string;
    name: string;
    ownerId: string;
    description: string;
    icon: string;
    members: string[];
    createdAt: string;
}

export interface ServerSliceInterface {
    token: string;
    name: string;
    description: string;
    icon: string;
}

export interface ServerUpdateInterface extends ServerSliceInterface {
    serverId: string;
}

export interface ServerManageInterface {
    token: string;
    serverId: string;
}

export interface ServerUserInterface extends ServerManageInterface {
    userId: string;
}

export interface ServerBulkInterface extends ServerManageInterface {
    users: string[];
}