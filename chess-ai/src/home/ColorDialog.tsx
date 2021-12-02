import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import KingFillIcon from '../assets/king-fill'
import KingOutlineIcon from '../assets/king-outline';
import { PlayerColor } from '../types/global'

type ColorDialogProps = {
    open: boolean,
    onSelectColor: (color:PlayerColor) => void,
    onClose: () => void
}

const ColorDialog: FunctionComponent<ColorDialogProps> = ({ open, onSelectColor, onClose }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="color-dialog-title"
            aria-describedby="color-dialog-description"
        >
            <DialogTitle id="color-dialog-title">
                {"Choose your color"}
            </DialogTitle>
            <DialogContentText>
            </DialogContentText>
            <DialogActions>
                <Button onClick={() => onSelectColor('white')}>White <KingOutlineIcon viewBox='0 0 45 45' /></Button>
                <Button onClick={() => onSelectColor('black')}>Black <KingFillIcon viewBox='0 0 45 45' /></Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ColorDialog