import { FunctionComponent } from "react";
import {useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import { Button } from "@mui/material";

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