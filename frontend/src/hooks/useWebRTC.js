// import { useCallback, useEffect } from "react";
// import { useStateWithCallback } from "./useStateWithCallback";
// import { useRef } from "react";
// import { socketInit } from '../socket';
// import { ACTIONS } from "../actions";

// export const useWebRTC = (roomId, user) => {
//     const [clients, setClients] = useStateWithCallback([]);

//     const audioElements = useRef({});
//     const connections = useRef({});
//     const localMediaStream = useRef(null);
//     const socket = useRef(null);

//     useEffect(() => {
//         socket.current = socketInit();
//     }, [])

//     const addNewClients = useCallback(
//         (newClient, cb) => {
//             const lookingFor = clients.find((client) => client.id === newClient.id);

//             if(lookingFor === undefined){
//                 setClients((existingClients) => [...existingClients, newClient], cb);
//             }
//         },
//         [clients, setClients],
//     )
//     useEffect(() => {
//         const startCapture = async() => {
//             localMediaStream.current = 
//             await navigator.mediaDevices.getUserMedia({
//                 audio: true,
//             })
//         };
//         startCapture().then(() => {
//             addNewClients(user, () => {
//                 const localElement = audioElements.current[user.Id];
//                 if(localElement){
//                     localElement.volume = 0;
//                     localElement.srcObject = localMediaStream.current;
//                 }

//                 // socket emit JOIN , socket io
//                 socket.current.emit(ACTIONS.JOIN, {roomId, user});
//             });
//             console.log('localMediaStream', localMediaStream.current);
//         });
//     }, []);

//     const provideRef = (instance, userId) => {
//         audioElements.current[userId] = instance;
//     };
//     return({clients, provideRef});
// };


import { useCallback, useEffect } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { useRef } from "react";
import { socketInit } from '../socket';
import { ACTIONS } from "../actions";

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([]);

    const audioElements = useRef({});
    const connections = useRef({});
    const localMediaStream = useRef(null);
    const socket = useRef(null);

    useEffect(() => {
        socket.current = socketInit();
    }, [])
    // useEffect(() => {
    //     socket.current = socketInit();

    //     return () => {
    //         if (socket.current) {
    //             socket.current.disconnect();
    //         }
    //     };
    // }, []);

    const addNewClients = useCallback(
        (newClient, cb) => {
            setClients((existingClients) => {
                const lookingFor = existingClients.find(client => client.id === newClient.id);
                if (!lookingFor) {
                    return [...existingClients, newClient];
                }
                return existingClients;
            }, cb);
        },
        [setClients],
    );

// Capture Media

    useEffect(() => {
        const startCapture = async () => {
            try {
                localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });

                addNewClients(user, () => {
                    const localElement = audioElements.current[user.id];
                    if (localElement) {
                        localElement.volume = 0;
                        localElement.srcObject = localMediaStream.current;
                    }

                    socket.current.emit(ACTIONS.JOIN, { roomId, user });
                });

                console.log('localMediaStream', localMediaStream.current);
            } catch (error) {
                console.error("Error capturing media: ", error);
            }
        };

        startCapture();

        return () => {
            if (localMediaStream.current) {
                localMediaStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [addNewClients, roomId, user]);

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };

    return { clients, provideRef };
};
