import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FormControl, FormHelperText, Input, InputLabel, TextField, InputAdornment } from '@mui/material';
import React, { useState, useMemo, FunctionComponent, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ColorDialog from './ColorDialog';
import { Socket } from 'socket.io-client';
import { PlayerColor } from '../types/global'

type HomeProps = {
    playerName: string,
    playerSocket: Socket,
    setIsJoining: (value: boolean) => void,
    setPlayerColor: (color: PlayerColor) => void,
    setPlayerName: (name: string) => void,
    handlePlayerConnection: (room:string) => void,
    handleError: (err:string) => void
}

type CreateRoomResponse = {
    status: number,
    roomID?: string,
    err?: string
}

const Home: FunctionComponent<HomeProps> = ({ playerName, playerSocket, setIsJoining, setPlayerColor, setPlayerName, handleError, handlePlayerConnection }) => {
    const [roomID, setRoomID] = useState<string>('')
    const [openColorDialog, setOpenColorDialog] = React.useState(false);
    const [nameError, setNameError] = useState(!(playerName.length > 0))
    const [roomIDError, setRoomIDError] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        handlePlayerConnection('Home.tsx')
      }, [handlePlayerConnection]);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.value.trim()
        setNameError(!(name.length > 0))
        setPlayerName(name);
    };

    const handleRoomIDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let roomID = event.target.value.trim()
        setRoomID(roomID);
        setRoomIDError(false)
    }

    const handleColorDialogClose = useCallback(
        () => {
            setOpenColorDialog(false)
        },
        [setOpenColorDialog],
    )

    const handleColorDialogSelect = useCallback(
        (color: PlayerColor) => {
            setOpenColorDialog(false)
            setPlayerColor(color)
            let data = (color === 'white')? {white:playerName, black:''} : {white:'', black:playerName} 
            playerSocket.emit('creatingRoom', data, (res: CreateRoomResponse) => {
                if (res.status === 200) { 
                    setIsJoining(false)
                    navigate(`/room/${res.roomID!}`, { replace: true })
                }
                else {
                    handleError(res.err!)
                }
            })
        },
        [setOpenColorDialog, setPlayerColor, setIsJoining, navigate, handleError, playerName, playerSocket],
    )

    const handleCreateRoom = () => {
        if (nameError) {
            return;
        }
        console.log('creating room...')
        setOpenColorDialog(true)
    }

    const handleJoinRoom = () => {
        if (roomID === '') {
            setRoomIDError(true)
            return;
        }
        if (nameError) {
            return;
        }
        console.log(`joining room ${roomID}...`)
        setIsJoining(true)
        navigate(`/room/${roomID}`, { replace: true })
    }

    const nameHelperText = useMemo(() => {
        if (nameError) {
            return 'Please enter at least one char !';
        }

        return 'Click on your name to change it';
    }, [nameError]);

    const roomIDHelperText = useMemo(() => {
        if (roomIDError) {
            return 'Please enter a room ID !';
        }

        return '';
    }, [roomIDError]);

    return (
        <>
            <Typography variant="body1" color="primary">
                Welcome
            </Typography>
            <FormControl error={nameError} variant="standard">
                <InputLabel htmlFor="component-helper">Your name</InputLabel>
                <Input
                    id="component-helper"
                    value={playerName}
                    onChange={handleNameChange}
                    aria-describedby="component-helper-text"
                />
                <FormHelperText>{nameHelperText}</FormHelperText>
            </FormControl>
            <Button onClick={handleCreateRoom} variant="text" color="primary">
                Create a room
            </Button>
            <FormControl error={roomIDError} variant="standard">
                <TextField
                    id="outlined-basic"
                    label="Room's ID"
                    variant="outlined"
                    value={roomID}
                    onChange={handleRoomIDChange}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">#</InputAdornment>,
                    }}
                />
                <FormHelperText>{roomIDHelperText}</FormHelperText>
            </FormControl>
            <Button onClick={handleJoinRoom} variant="text" color="primary">
                Join a room
            </Button>
            <Button variant="text" color="primary">
                Try to defeat AI
            </Button>
            <ColorDialog
                open={openColorDialog}
                onClose={handleColorDialogClose}
                onSelectColor={handleColorDialogSelect}
            />
        </>
    )
}

export default Home