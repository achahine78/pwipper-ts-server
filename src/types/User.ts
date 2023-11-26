export type User = Partial<{
    id: string;
    username: string;
    image: string;
    handle: string;
    bio: string;
    followerCount: number;
    followingCount: number;
    createdAt: Date;
}>