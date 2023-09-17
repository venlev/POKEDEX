import Card from '@mui/material/Card';
import './stat-panel.component.css';
import PokeBadge from '../poke-badge/poke-badge.component';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, useMediaQuery, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { PokemonCard } from '../../typedefinitions/pokemon-typedefs';

export type StatPanelProps = {
    data?: PokemonCard
    open: boolean
    close: any,
}

const StatPanel = (props: StatPanelProps) => {
    const [open, setOpen] = useState(props.open || false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    useEffect(() => {
        setOpen(props.open);
    }, [props.open])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.close(true);
        setOpen(false);
    };

    return (
        <div>
            <Dialog
                id='#stat-dialog'
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    <div className="stat-panel-action-bar">
                        <div className="name-type">
                            <h1 className="name">Pikachu</h1>
                            <PokeBadge type='electric' />
                        </div>
                        <div className="action-buttons">
                            <IconButton>
                                <FavoriteBorderIcon />
                            </IconButton>
                            <IconButton>
                                <CancelIcon />
                            </IconButton>
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div id="stat-content">
                        <div id="left-side">
                            <div className="stats">
                                <table className='stat-panel-table'>
                                    <tbody>
                                        <tr>
                                            <td><Chip icon={<FavoriteIcon />} label={'HP ' + '35'} variant="outlined" /></td>
                                            <td><Chip icon={<WhatshotIcon />} label={'ATK ' + '40'} variant="outlined" /></td>
                                        </tr>
                                        <tr>
                                            <td><Chip icon={<ShieldIcon />} label={'DEF ' + '75'} variant="outlined" /></td>
                                            <td><Chip icon={<AutoFixHighIcon />} label={'SP ' + '24'} variant="outlined" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="male-female-selection-menu">
                                <IconButton >
                                    <FemaleIcon className='mf-selector' />
                                </IconButton>
                                <IconButton>
                                    <MaleIcon className='mf-selector' />
                                </IconButton>
                            </div>
                            <div className="front-back-selection-menu">
                                <ButtonGroup
                                    color='info'
                                    fullWidth
                                    variant="contained"
                                    aria-label="Disabled elevation buttons"
                                >
                                    <Button>Front</Button>
                                    <Button>Back</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        <div id="rigth-side">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png" alt="" className='pokemon-preview' />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default StatPanel;