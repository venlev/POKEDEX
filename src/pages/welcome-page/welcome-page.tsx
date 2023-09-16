import React from 'react';
import './welcome-page.css';
import Paper from '@mui/material/Paper';
import { getUser } from '../../services/user-store.service';
import LoginManager from '../../components/login-panel/login-panel.component';
import WelcomePanel from '../../components/welcome-panel/welcome-panel.component';

const WelcomePage = () => {

    const showLoginOrWelcomePanel = () => {
        return sessionStorage.length > 0 && getUser().user ? <WelcomePanel /> : <LoginManager />
    }

    return (
        <Paper elevation={3} id='welcome-field'>
            <h1>Welcome to our Pokedex</h1>
            {showLoginOrWelcomePanel()}
        </Paper>
    )
}

export default WelcomePage;