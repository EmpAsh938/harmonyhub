import { useState, ChangeEvent, FormEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/useReactRedux";
import { UserInterface } from "@/types/interfaces/user";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate } from "@/utils/formatDate";
import { updateUser } from '@/store/reducers/user/userSlice';

const Profile = () => {
    const { token } = useAppSelector(state => state.auth);
    const { user } = useAppSelector(state => state.user);
    const [formData, setFormData] = useState<UserInterface>({
        ...user
    });

    const dispatch = useAppDispatch();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        const { username, bio } = formData;
        if (token && username) {
            dispatch(updateUser({ token, username, bio }))
        }
    };


    return (

        <div className="flex flex-col p-4 gap-4">
            <div className="flex gap-4 items-center">

                {/* Avatar */}
                <Avatar className="w-16 h-16">
                    {user.avatar ? (
                        <AvatarImage src={formData.avatar} alt={user.username} />
                    ) : (
                        <AvatarFallback className="bg-blue-500 flex items-center justify-center text-white uppercase font-semibold text-2xl">
                            {user.username.charAt(0)}
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="text-sm font-semibold text-slate-300">
                    <div className="flex gap-2">
                        <span>{formData.friends.length}</span>
                        <span>Friends</span>
                    </div>
                    <div className="flex gap-2">
                        <span>Joined At</span>
                        <span>{formatDate(formData.createdAt)}</span>
                    </div>

                </div>
            </div>

            {/* User Info or Edit Form */}

            <div className="flex flex-col gap-1 w-[400px]">

                <div className="space-y-1">
                    <Label htmlFor="username" className="text-lg font-semibold">Username</Label>
                    <Input name="username" onChange={handleChange} className="text-black" id="username" value={formData.username} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="bio" className="text-lg font-semibold">Bio</Label>
                    <Input name="bio" onChange={handleChange} className="text-black" id="bio" value={formData.bio} />
                </div>




                <Button onClick={handleSubmit} variant="primary" className="w-fit my-2">Save Changes</Button>
            </div>
        </div>
    );
}

export default Profile;
