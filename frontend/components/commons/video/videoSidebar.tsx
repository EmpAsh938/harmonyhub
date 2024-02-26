import { useRef, useEffect } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAppSelector } from '@/hooks/useReactRedux';

const VideoSidebar = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const zegoInstanceRef = useRef<any>(null);

    const { activeChannel } = useAppSelector(state => state.channel);

    useEffect(() => {

        const roomId = activeChannel._id;
        const appID = 153419371;
        const serverSecret = "7e2158b9ff636cb9ee3363fc934ad8ff";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), roomId);

        // Create instance object from Kit Token.
        zegoInstanceRef.current = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zegoInstanceRef.current.joinRoom({
            container: containerRef.current,

            scenario: {
                mode: ZegoUIKitPrebuilt.GroupCall,
            },
        });


    }, [activeChannel._id]);

    return (
        <div className="h-screen py-4">
            {/* <div className="flex gap-4 items-center">
                <h2 className="font-bold py-4 capitalize text-xl">{activeChannel?.name}</h2>
                <span className="text-sm text-slate-400 font-medium">{activeChannel?.members.length} members</span>
            </div> */}
            <div className="h-full" ref={containerRef}></div>
        </div>
    );
}

export default VideoSidebar;
