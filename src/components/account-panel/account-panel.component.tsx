import React, { useEffect, useState } from 'react';
import './account-panel.component.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton/IconButton';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { getPokeCardDataList } from '../../services/pokemon-api.service';
import { db } from '../../firebase';
import { UserData } from '../../typedefinitions/user-data-typedefs';
import { getUser } from '../../services/user-store.service';
import heartPNG from '../../assets/heart.png';

type AccountPanelProps = {
    nickname: string,
    showFavourites?: any
}

const AccountPanel = (props: AccountPanelProps) => {

    const navigate = useNavigate();
    const [favourites, setFavourites] = useState([] as string[]);
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);

    const logout = () => {
        sessionStorage.clear();
        navigate("/");
    }

    const showFavouritesEvent = () => {
        props.showFavourites()
    }

    useEffect(() => {
        const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
        const qSnapshot = getDocs(userDocumentQuery);
        qSnapshot.then((QuerySnapshot) => {
            const QueryDocumentSnapshot = QuerySnapshot.docs[0];
            setLoggedInUser(QueryDocumentSnapshot.data() as UserData);
        }).catch(err => console.log(err));
    });

    useEffect(() => {
        if (loggedInUser.favouritePokemonList && loggedInUser.favouritePokemonList.length > 0) {
            getPokeCardDataList(loggedInUser.favouritePokemonList).then(pokemonCardResultList => {
                for (let PCR of pokemonCardResultList) { favourites.push(PCR.img) }
            });
        }
    }, [loggedInUser]);

    const getFavIcon = (index: number) => {
        if (favourites.length >= 3) {
            return favourites[index];
        } else {
            if (typeof favourites[index] !== 'undefined') {
                return favourites[index];
            } else {
                return heartPNG;
            }
        }
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <div className="action-bar">
                    <div id="image-wrapper">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="" />
                    </div>
                    <span id="username">{props.nickname}</span>
                    <div className="logout-action-wrapper">
                        <IconButton onClick={logout}>
                            <LogoutIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="favourite-link">
                    <Button size="large" onClick={showFavouritesEvent}>Favourite Pokemons <ArrowForwardIosIcon /></Button>
                </div>
                <div className="top-selection">
                    <i>This is your top 3</i>
                    <pre>
                        For all favourites, click
                        the link above
                    </pre>
                </div>
                <div className="top-three-favs">
                    <img src={getFavIcon(0)} alt="" className='favourite-pok-icon' id='first-favicon' />
                    <img src={getFavIcon(1)} alt="" className='favourite-pok-icon' id='second-favicon' />
                    <img src={getFavIcon(2)} alt="" className='favourite-pok-icon' id='third-favicon' />
                </div>
            </CardContent>
        </Card>
    )
}

export default AccountPanel;