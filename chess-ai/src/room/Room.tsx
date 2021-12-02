import React, { FunctionComponent, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import Typography from '@mui/material/Typography'
import { LinearProgress, Stack, Button, Tooltip } from "@mui/material";
import { PlayerColor } from '../types/global'

const Game = React.lazy(() => import('./Game'));

type RoomProps = {
    playerColor: "white" | "black",
    playerName: string,
    playerSocket: Socket,
    isJoining: boolean,
    setPlayerColor: (color: PlayerColor) => void,
    setIsJoining: (value: boolean) => void,
    handlePlayerConnection: (room: string) => void,
    handlePlayerDisconnection: (room: string) => void,
    handleError: (err: string) => void
}

type RoomData = {
    white: string,
    black: string
}

type JoiningResponse = {
    status: number,
    playerColor?: PlayerColor,
    err?: string
}

const Room: FunctionComponent<RoomProps> = ({ isJoining, playerColor, playerSocket, playerName, setPlayerColor, setIsJoining, handlePlayerConnection, handlePlayerDisconnection, handleError }) => {

    const navigate = useNavigate()

    const params = useParams()
    const [roomID, setRoomID] = useState<string>('')
    const [tooltipText, setTooltipText] = useState<string>('Copy to clip-board')
    const [roomData, setRoomData] = useState<RoomData>({ white: '', black: '' })
    const [waitingOnPlayer, setWaitingOnPlayer] = useState(true)

    const handleGoBack = () => {
        navigate('/', { replace: true })
    }

    useEffect(() => {
        if(params.roomID) {
            setRoomID(params.roomID)
        } 
    }, [params])

    useEffect(() => {
        handlePlayerConnection('Room.tsx')
        return () => {
            handlePlayerDisconnection('Room.tsx')
        }
    }, [handlePlayerConnection, handlePlayerDisconnection]);

    useEffect(() => {
        if (isJoining && roomID !== '') {
            console.log('------------------------------------')
            console.log(`i'm trying to join the room ${roomID} in Room.tsx`)
            console.log('------------------------------------')
            let data = { roomID: roomID, playerName: playerName }
            playerSocket.emit('joiningRoom', data, (res: JoiningResponse) => {
                console.log(res)
                if (res.status === 200) {
                    console.log('joining okay !')
                    setIsJoining(false)
                    setPlayerColor(res.playerColor!)
                }
                else { handleError(res.err!) }
            })
        }
    }, [setPlayerColor, setIsJoining, handleError, roomID, playerName, playerSocket, isJoining])

    useEffect(() => {
        playerSocket.on('roomJoined', (data: { msg: string, roomData: RoomData }) => {
            console.log(data)
            setRoomData(data.roomData)
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
    }, [handleError, playerSocket]);

    const roomState = useMemo(() => {
        if (waitingOnPlayer) {
            const handleCopyToClipboard = () => {
                navigator.clipboard.writeText(roomID)
                setTooltipText('Copy success \u2713')
                setTimeout(() => {
                    setTooltipText('Copy to clip-board');
                }, 3000);
            }
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
                        Share your room's ID
                        <Tooltip title={tooltipText}>
                            <Button onClick={handleCopyToClipboard} variant="text" color="primary">
                                <Typography variant="h6" color="inherit">
                                    {roomID}
                                </Typography>
                            </Button>
                        </Tooltip>
                        or the url in your browser
                    </Typography>
                </>
            );
        }
        return (
            <>
                <Typography variant="h6" color="initial">
                    Your oponent is {(playerColor === 'white') ? roomData.black : roomData.white}
                    {console.log(roomData)}
                </Typography>
                <Suspense fallback={<div>Loading...</div>}>
                    <Game playerColor={playerColor} playerSocket={playerSocket} roomID={roomID}/>
                </Suspense>
            </>
        )
    }, [waitingOnPlayer, roomID, playerColor, playerSocket, roomData, tooltipText]);

    return (
        <>
            <Button onClick={handleGoBack} variant="text" color="primary">
                {'< Go back'}
            </Button>
            {roomState}
        </>
    );
}

export default Room;