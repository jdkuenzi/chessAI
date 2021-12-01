import React, { FunctionComponent, Suspense, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import Typography from '@mui/material/Typography'
import { LinearProgress, Stack, Button } from "@mui/material";

const Board = React.lazy(() => import('../board/Board'));

type RoomProps = {
    playerColor: "white" | "black",
    playerName: string,
    playerSocket: Socket,
    isJoining: boolean,
    setRouteError: (err:string) => void
}

const Room: FunctionComponent<RoomProps> = ({ isJoining, playerColor, playerSocket, playerName, setRouteError }) => {

    let location = useLocation();
    const navigate = useNavigate()

    const params = useParams()

    const [waitingOnPlayer, setWaitingOnPlayer] = useState(true)

    const handleClick = () => {
        navigate('/', {replace: false})
    }

    const handleError = (err:string) => {
        setRouteError(err)
        navigate('/error')
    }

    useEffect(() => {
        console.log(params)
        if (isJoining) {
            let data = { roomID: params.roomID, playerName: playerName }
            playerSocket.emit('joiningRoom', data)
        }
        playerSocket.on('roomJoined', (data) => {
            console.log(data)
            setWaitingOnPlayer(false)
        })
        playerSocket.on('userLeaved', (data) => {
            console.log(data)
            handleError(data.msg)
        })
        playerSocket.on('customError', (data) => {
            console.log(data)
            handleError(data.msg)
        })
        return () => {
            console.log('i\'m disconnecting')
            playerSocket.disconnect()
            // Disconnect client's socket
          }
    }, [location]);

    const roomState = useMemo(() => {
        if (waitingOnPlayer) {
            return (
                <>
                    <Typography variant="h6" color="initial">
                        Waiting on an oponent
                    </Typography>
                    <Stack sx={{ width: '50%' }} spacing={2}>
                        <LinearProgress color="primary" />
                        <LinearProgress color="primary" />
                        <LinearProgress color="primary" />
                    </Stack>
                    <Typography variant="h6" color="initial">
                        Share your room's ID {params.roomID} or the url in your browser
                    </Typography>
                </>
            );
        }
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Board orientation={playerColor} />
            </Suspense>
        )
    }, [waitingOnPlayer, params, playerColor]);

    return (
        <>
            <Button onClick={handleClick} variant="text" color="primary">
                Back
            </Button>
            {roomState}
        </>
    );
}

export default Room;