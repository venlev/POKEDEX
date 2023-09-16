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
import { collection, onSnapshot, addDoc, query, where, getDocs } from '@firebase/firestore';
import { FavouritePokemonTypeList, PokemonTypes } from '../../typedefinitions/pokemon-typedefs';
import { UserData } from '../../typedefinitions/user-data-typedefs';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/user-store.service';
import PokedexLoader from '../loader/loader.component';

const WelcomePanel = () => {

    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [favouritePokemonTypes, setFavouritePokemonTypes] = useState({
        fire: false,
        grass: false,
        electric: false
    } as FavouritePokemonTypeList);
    const [isUserDataSet, setIsUserDataSet] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);
    const [, refreshState] = useState({})

    useEffect(() => {
        const userDataCallSubscription = onSnapshot(collection(db, 'user-data'), (dbRecords) => {
            //gets data from db collection dbRecords.docs.map(document=>document.data())
        });

        const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
        const qSnapshot = getDocs(userDocumentQuery);
        qSnapshot.then((QuerySnapshot) => {
            const QueryDocumentSnapshot = QuerySnapshot.docs[0];
            setLoggedInUser(QueryDocumentSnapshot.data() as UserData);

            const fetchedUser: UserData = QueryDocumentSnapshot.data() as UserData;

            fetchedUser.nickname && fetchedUser.favouritePokemonTypes
                ? setIsUserDataSet(true)
                : setIsUserDataSet(false);

        }).catch(err => console.log(err));

        return userDataCallSubscription;
    }, []);

    const saveAccountSettings = () => {
        const _uid = getUser().user.uid;
        const data: UserData = {
            uid: _uid,
            nickname: nickname,
            favouritePokemonTypes: favouritePokemonTypes,
            favouritePokemonList: []
        }
        const _collectionReference = collection(db, 'user-data');
        addDoc(_collectionReference, data).then(() => {
            navigate("/search");
        }).catch(err => console.log(err));
    }

    const updateAccountSettings = () => {

    }

    const togglePokemonType = (label: PokemonTypes) => {
        switch (label) {
            case 'fire': favouritePokemonTypes.fire = !favouritePokemonTypes.fire;
                break;
            case 'grass': favouritePokemonTypes.grass = !favouritePokemonTypes.grass;
                break;
            case 'electric': favouritePokemonTypes.electric = !favouritePokemonTypes.electric;
                break;
        }
    }

    const getSelectedClassname = (poketype: PokemonTypes): string => {
        setTimeout(() => { refreshState({}) }, 0);
        return favouritePokemonTypes[poketype] ? 'selected' : '';
    }

    const WelcomeRegistrationPanel = () => {
        return (
            <div id='welcome-panel-container'>
                <div id="name-inquiry-wrapper">
                    <h3 className='name-inquiry'>What is your name?</h3>
                    <TextField label="Nickname" variant="outlined" color='primary' placeholder='Mr. Raptor' value={nickname} onChange={(e) => setNickname(e.target.value)} />
                </div>
                <div id="favourite-pokemon-wrapper">
                    <h3 className='name-inquiry'>What are your favourite pokemon types?</h3>
                    <div id="pokemon-type-selection">
                        <Chip icon={<WhatshotIcon />} className={getSelectedClassname('fire')} label="Fire" color='warning' onClick={() => togglePokemonType('fire')} />
                        <Chip icon={<SpaIcon />} className={getSelectedClassname('grass')} label="Grass" color='success' onClick={() => togglePokemonType('grass')} />
                        <Chip icon={<ElectricBoltIcon />} className={getSelectedClassname('electric')} label="Electric" color='primary' onClick={() => togglePokemonType('electric')} />
                    </div>
                </div>
                <Fab variant="extended" onClick={saveAccountSettings}>
                    <SaveIcon sx={{ mr: 1 }} />
                    Save my account
                </Fab>
            </div>
        )
    }

    const redirectToSearch = () => {
        //navigate("/search");
        return (
            <PokedexLoader next="/search"/>
        )
    }

    return (
        <> {isUserDataSet ? redirectToSearch() : WelcomeRegistrationPanel()} </>
    )
}

export default WelcomePanel;