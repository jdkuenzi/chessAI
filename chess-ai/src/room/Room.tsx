import React, { FunctionComponent, Suspense, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import Typography from '@mui/material/Typography'
import { LinearProgress, Stack, Button, Tooltip } from "@mui/material";

const Board = React.lazy(() => import('../board/Board'));

type RoomProps = {
    playerColor: "white" | "black",
    playerName: string,
    playerSocket: Socket,
    isJoining: boolean,
    setPlayerColor: (color: 'white' | 'black') => void,
    setIsJoining: (value: boolean) => void,
    handlePlayerConnection: (room: string) => void,
    handlePlayerDisconnection: (room: string) => void,
    handleError: (err: string) => void
}

type RoomData = {
    white: string,
    black: string
}

type GameData = {
    isWhiteTurn: boolean
}

type JoiningResponse = {
    status: number,
    playerColor?: 'white' | 'black',
    err?: string
}

const Room: FunctionComponent<RoomProps> = ({ isJoining, playerColor, playerSocket, playerName, setPlayerColor, setIsJoining, handlePlayerConnection, handlePlayerDisconnection, handleError }) => {

    const navigate = useNavigate()

    const params = useParams()

    const [tooltipText, setTooltipText] = useState<string>('Copy to clip-board')
    const [roomData, setRoomData] = useState<RoomData>({ white: '', black: '' })
    const [waitingOnPlayer, setWaitingOnPlayer] = useState(true)

    const handleGoBack = () => {
        navigate('/', { replace: false })
    }

    useEffect(() => {
        handlePlayerConnection('Room.tsx')
        return () => {
            handlePlayerDisconnection('Room.tsx')
        }
    }, [handlePlayerConnection, handlePlayerDisconnection]);

    useEffect(() => {
        if (isJoining) {
            console.log('------------------------------------')
            console.log('i\'m trying to join the room in Room.tsx')
            console.log('------------------------------------')
            let data = { roomID: params.roomID, playerName: playerName }
            playerSocket.emit('joiningRoom', data, (res: JoiningResponse) => {
                console.log(res)
                if (res.status === 200) {
                    setIsJoining(false)
                    setPlayerColor(res.playerColor!)
                }
                else { handleError(res.err!) }
            })
        }
    }, [setPlayerColor, setIsJoining, handleError, params, playerName, playerSocket, isJoining])

    useEffect(() => {
        playerSocket.on('roomJoined', (data: { msg: string, roomData: RoomData }) => {
            console.log(data)
            setWaitingOnPlayer(false)
            setRoomData(data.roomData)
        })
        playerSocket.on('userLeaved', (data) => {
            console.log(data)
            handleError(data.msg)
        })
        playerSocket.on('customError', (data) => {
            console.log(data)
            handleError(data.msg)
        })
    }, [handleError, setWaitingOnPlayer, setRoomData, playerSocket]);

    const roomState = useMemo(() => {
        if (waitingOnPlayer) {
            const handleCopyToClipboard = () => {
                if (params.roomID) {
                    navigator.clipboard.writeText(params.roomID)
                    setTooltipText('Copy success \u2713')
                }
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
                                    {params.roomID}
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
                    <Board orientation={playerColor} />
                </Suspense>
            </>
        )
    }, [waitingOnPlayer, params, playerColor, roomData, tooltipText]);

    return (
        <>
            <Button onClick={handleGoBack} variant="text" color="primary">
                Back
            </Button>
            {roomState}
        </>
    );
}

export default Room;