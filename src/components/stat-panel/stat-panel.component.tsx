import './stat-panel.component.css';
import PokeBadge from '../poke-badge/poke-badge.component';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Chip, Dialog, DialogContent, DialogTitle } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { PokemonCard } from '../../typedefinitions/pokemon-typedefs';
import { UserData } from '../../typedefinitions/user-data-typedefs';
import { collection, query, where, getDocs, doc, updateDoc } from '@firebase/firestore';
import { db } from '../../firebase';
import { getUser } from '../../services/user-store.service';

export type StatPanelProps = {
    data: PokemonCard
    open: boolean
    close: any,
    updateFavourites?: any;
}

const StatPanel = (props: StatPanelProps) => {
    const [open, setOpen] = useState(props.open || false);
    const [pokemonGender, setPokemonGender] = useState<'male' | 'female'>('male');
    const [pokemonSide, setPokemonSide] = useState<'front' | 'back'>('front');
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);
    const [nextFavourite, setNextFavourite] = useState('');
    const [unfavourite, setUnfavourite] = useState('');
    const [myFavouritePokemons, setMyFavouritePokemons] = useState([] as string[]);

    useEffect(() => {
        if (props.open) handleClickOpen();
    }, [props]);

    /* GLUser */
    useEffect(() => {
        const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
        const qSnapshot = getDocs(userDocumentQuery);
        qSnapshot.then((QuerySnapshot) => {
            const QueryDocumentSnapshot = QuerySnapshot.docs[0];
            setLoggedInUser(QueryDocumentSnapshot.data() as UserData);
        }).catch(err => console.log(err));
    }, []);

    /* SET NEW FAVS */
    useEffect(() => {
        if (nextFavourite !== '' || unfavourite !== '') {
            const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
            const qSnapshot = getDocs(userDocumentQuery);
            qSnapshot.then((QuerySnapshot) => {
                let UserDocumentIdentifier: string = QuerySnapshot.docs[0].id;
                let favouritePokemonList: string[] = QuerySnapshot.docs[0].data().favouritePokemonList;

                let userDataDBRef = doc(db, 'user-data', UserDocumentIdentifier);
                (nextFavourite !== '')
                    ? favouritePokemonList.push(nextFavourite)
                    : favouritePokemonList = favouritePokemonList.filter(pokemon => pokemon !== unfavourite);

                setMyFavouritePokemons(favouritePokemonList);

                updateDoc(userDataDBRef, { favouritePokemonList: favouritePokemonList })
                    .then(() => {
                        setNextFavourite('');
                        props.updateFavourites(favouritePokemonList);
                    })
                    .catch(err => { console.log(err) });
            }).catch(err => { console.log(err) });
        }
    }, [nextFavourite, unfavourite]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.close(true);
        setPokemonGender('male'); setPokemonSide('front');
        setOpen(false);
    };

    const addToFavourites = (pokemonName: string) => {
        setNextFavourite(pokemonName);
    }

    const removeFromFavourites = (pokemonName: string) => {
        setUnfavourite(pokemonName);
    }

    const showPokemonSide = (side: 'front' | 'back'): string => {
        switch (side) {
            case 'front':
                return (
                    pokemonGender === 'male'
                        ? props.data.images.male.front
                        : props.data.images.female.front
                );

            case 'back':
                return (
                    pokemonGender === 'male'
                        ? props.data.images.male.back
                        : props.data.images.female.back
                );
        }
    }

    const getHeart = (pokemonName: string) => {
        let favourite: boolean = loggedInUser.favouritePokemonList.includes(pokemonName) || false;

        const showFavourite = () => {
            return (
                <IconButton onClick={(e) => { removeFromFavourites(props.data.name); e.stopPropagation(); }} >
                    <FavoriteIcon className='heart' />
                </IconButton>
            )
        }

        const showNonFavourite = () => {
            return (
                <IconButton onClick={(e) => { addToFavourites(props.data.name); e.stopPropagation(); }}>
                    <FavoriteBorderIcon className='heart' />
                </IconButton>
            )
        }

        return favourite ? showFavourite() : showNonFavourite();
    }

    const renderStatPanelDialog = () => {
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
                                <h1 className="name">{props.data.name}</h1>
                                <PokeBadge type={props.data.type} />
                            </div>
                            <div className="action-buttons">
                                {getHeart(props.data.name)}
                                <IconButton onClick={e => { handleClose(); e.stopPropagation(); }}>
                                    <CancelIcon className='closeIB' />
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
                                                <td><Chip icon={<FavoriteIcon />} label={'HP ' + props.data.stats.hp} variant="outlined" /></td>
                                                <td><Chip icon={<WhatshotIcon />} label={'ATK ' + props.data.stats.atk} variant="outlined" /></td>
                                            </tr>
                                            <tr>
                                                <td><Chip icon={<ShieldIcon />} label={'DEF ' + props.data.stats.def} variant="outlined" /></td>
                                                <td><Chip icon={<AutoFixHighIcon />} label={'SP ' + props.data.stats.sp} variant="outlined" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="male-female-selection-menu">
                                    <IconButton disabled={!props.data.images.female.isFemale} onClick={e => { setPokemonGender('female'); e.stopPropagation(); }}>
                                        <FemaleIcon className='mf-selector' />
                                    </IconButton>
                                    <IconButton onClick={e => { setPokemonGender('male'); e.stopPropagation(); }}>
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
                                        <Button onClick={e => { setPokemonSide('front'); e.stopPropagation(); }}>Front</Button>
                                        <Button onClick={e => { setPokemonSide('back'); e.stopPropagation(); }}>Back</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                            <div id="rigth-side">
                                <img src={showPokemonSide(pokemonSide)} alt="" className='pokemon-preview' />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    return (
        <>
            {props.data.name ? renderStatPanelDialog() : <></>}
        </>
    );
}

export default StatPanel;