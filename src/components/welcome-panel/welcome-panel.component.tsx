import TextField from '@mui/material/TextField';
import './welcome-panel.component.css';
import Chip from '@mui/material/Chip';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import SpaIcon from '@mui/icons-material/Spa';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SaveIcon from '@mui/icons-material/Save';
import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from '@firebase/firestore';

const WelcomePanel = () => {

    const [nickname, setNickname] = useState('');
    const [favouritePokemonTypes, setFavouritePokemonTypes] = useState([]);

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const userDataCallSubscription = onSnapshot(collection(db, 'user-data'), (dbRecords) => {
            //gets data from db collection dbRecords.docs.map(document=>document.data())
        });

        return userDataCallSubscription;
    }, []);

    return (
        <div id='welcome-panel-container'>
            <div id="name-inquiry-wrapper">
                <h3 className='name-inquiry'>What is your name?</h3>
                <TextField label="Nickname" variant="outlined" color='secondary' placeholder='Mr. Raptor' value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            <div id="favourite-pokemon-wrapper">
                <h3 className='name-inquiry'>What are your favourite pokemon types?</h3>
                <div id="pokemon-type-selection">
                    <Chip icon={<WhatshotIcon />} label="Fire" color='warning' />
                    <Chip icon={<SpaIcon />} label="Grass" color='success' />
                    <Chip icon={<ElectricBoltIcon />} label="Electric" color='primary' />
                </div>
            </div>
            <Fab variant="extended">
                <SaveIcon sx={{ mr: 1 }} />
                Save my account
            </Fab>
        </div>
    )
}

export default WelcomePanel;