import { FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SvgIcon, SvgIconProps } from '@mui/material';
import {ReactComponent as KingFillSVG} from './assets/king-fill.svg';
import {ReactComponent as KingOutlineSVG} from './assets/king-outline.svg';

type ColorDialogProps = {
    open: boolean,
    onSelectColor: (color:'white' | 'black') => void,
    onClose: () => void
}

function KingFillIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <KingFillSVG />
        </SvgIcon>
    )
}

function KingOutlineIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <KingOutlineSVG />
        </SvgIcon>
    )
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