import { useEffect } from "react";
import socket from "@/utils/socket";

export default function Notification() {
    useEffect(() => {
        socket.on('new_notifiacation', (data) => {
            console.log('Notification recived:', data);
    });

    return () => {
        socket.off('new_notification');
    };
    }, []);

    return <div>Notificaciones en tiempo real</div>;
}