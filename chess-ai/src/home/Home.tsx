import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { FormControl, FormHelperText, Input, InputLabel, TextField, InputAdornment } from '@mui/material';
import React, { useState, useMemo, FunctionComponent, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ColorDialog from './ColorDialog';
import { Socket } from 'socket.io-client';

type HomeProps = {
    playerName: string,
    roomID: string,
    playerSocket: Socket,
    setIsJoining: (value: boolean) => void,
    setRoomID: (roomID: string) => void,
    setPlayerColor: (color: 'white' | 'black') => void,
    setPlayerName: (name: string) => void
}

const Home: FunctionComponent<HomeProps> = ({ playerName, roomID, playerSocket, setIsJoining, setRoomID, setPlayerColor, setPlayerName }) => {
    const [openColorDialog, setOpenColorDialog] = React.useState(false);
    const [nameError, setNameError] = useState(!(playerName.length > 0))
    const [roomIDError, setRoomIDError] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        console.log(playerSocket)
        playerSocket.on("roomCreated", (data) => {
            console.log(data)
            setIsJoining(false)
            navigate(`room/${data.roomID}`, { replace: false })
        })
        playerSocket.on('customError', (data) => {
            console.log(data)
        })
    });

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
        (color: 'white' | 'black') => {
            setOpenColorDialog(false)
            setPlayerColor(color)
            let data = (color === 'white')? {white:playerName, black:''} : {white:'', black:playerName} 
            playerSocket.emit('creatingRoom', data)
        },
        [setOpenColorDialog, setPlayerColor, playerName, playerSocket],
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
        navigate(`room/${roomID}`, { replace: false })
        console.log(`joining room ${roomID}...`)
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