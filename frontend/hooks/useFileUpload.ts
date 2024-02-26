import { useState } from 'react';
import axios from 'axios';

const cloudName = 'dhcvubbbm';
const uploadPreset = 'nclapw9o';

const useFileUpload = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
            const uploadedImageUrl = response.data.secure_url;

            setImageUrl(uploadedImageUrl);
            setIsLoading(false);
        } catch (error) {
            setError('File upload failed.');
            setIsLoading(false);
        }
    };

    return { imageUrl, isLoading, error, handleFileUpload };
};

export default useFileUpload;
