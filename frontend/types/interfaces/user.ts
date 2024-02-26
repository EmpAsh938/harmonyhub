export interface UserInterface {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    bio: string;
    friends: UserInterface[];
    createdAt: string;
    updatedAt: string;
}

export interface LoginUserInterface {
    email: string;
    password: string;
}
export interface RegisterUserInterface extends LoginUserInterface {
    username: string;
}

export interface SearchFriendsInterface {
    token: string;
    query: string;
}

export interface ManageFriendInterface {
    token: string;
    userId: string;
}

export interface UpdateUserInterface {
    token: string;
    username: string;
    bio?: string;
}