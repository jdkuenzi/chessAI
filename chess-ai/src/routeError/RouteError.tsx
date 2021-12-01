import React, { FunctionComponent, Suspense, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import Typography from '@mui/material/Typography'
import { LinearProgress, Stack, Button } from "@mui/material";

type RouteErrorProps = {
    err: string
}

const RouteError: FunctionComponent<RouteErrorProps> = ({ err }) => {

    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/', {replace: false})
    }

    return (
        <>
            <Button onClick={handleClick} variant="text" color="primary">
                Back
            </Button>
            <Typography variant="h6" color="error">
                {err}
            </Typography>
        </>
    );
}

export default RouteError;