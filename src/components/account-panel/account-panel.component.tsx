import React from 'react';
import './account-panel.component.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton/IconButton';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const AccountPanel = () => {
    return (
        <Card variant="outlined">
            <CardContent>
                <div className="action-bar">
                    <div id="image-wrapper">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="" />
                    </div>
                    <span id="username">Mr. Raptor</span>
                    <div className="logout-action-wrapper">
                        <IconButton>
                            <LogoutIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="favourite-link">
                    <Button size="large">Favourite Pokemons <ArrowForwardIosIcon/></Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountPanel;