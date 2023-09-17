import './poke-card.component.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ShieldIcon from '@mui/icons-material/Shield';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import Typography from '@mui/material/Typography';
import PokeBadge from '../poke-badge/poke-badge.component';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton/IconButton';
import { PokemonCard } from '../../typedefinitions/pokemon-typedefs';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from '@firebase/firestore';
import { getUser } from '../../services/user-store.service';

export type PokeCardProps = {
    data: PokemonCard,
    searchTerm?: string,
    updateFavourites?: any
};

const PokeCard = (props: PokeCardProps) => {
    const [nextFavourite, setNextFavourite] = useState('');
    const [unfavourite, setUnfavourite] = useState('');
    const [myFavouritePokemons, setMyFavouritePokemons] = useState([] as string[]);

    /* SET NEW FAVS */
    useEffect(() => {
        if (nextFavourite !== '' || unfavourite !== '') {
            const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
            const qSnapshot = getDocs(userDocumentQuery);
            qSnapshot.then((QuerySnapshot) => {
                let UserDocumentIdentifier: string = QuerySnapshot.docs[0].id;
                let favouritePokemonList: string[] = QuerySnapshot.docs[0].data().favouritePokemonList;
                /* UPDATE SECTION */
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

    /* GET INITIAL FAVS */
    useEffect(() => {
        const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
        const qSnapshot = getDocs(userDocumentQuery);
        qSnapshot.then((QuerySnapshot) => {
            setMyFavouritePokemons(QuerySnapshot.docs[0].data().favouritePokemonList);
        }).catch(err => { console.log(err) });

    }, []);

    const addToFavourites = (pokemonName: string) => {
        setNextFavourite(pokemonName);
    }

    const removeFromFavourites = (pokemonName: string) => {
        setUnfavourite(pokemonName);
    }

    const getHighlightedName = () => {
        if (props.searchTerm) {
            const searchTerm: string = props.searchTerm;
            const normalAndHighlightSeparation = props.data.name.split(new RegExp(`(${searchTerm})`, 'gi'));
            return (
                <span> {normalAndHighlightSeparation.map((text, i) =>
                    <span key={i} style={text.toLowerCase() === searchTerm.toLowerCase() ? { fontWeight: 'bold' } : {}}>
                        {text}
                    </span>)
                }
                </span>
            )
        }
        return props.data.name;
    }

    const getHeartIcon = (pokemonName: string) => {
        if (myFavouritePokemons.includes(pokemonName)) {
            return (
                <IconButton onClick={() => removeFromFavourites(props.data.name)}>
                    <FavoriteIcon />
                </IconButton>
            )
        } else {
            return (
                <IconButton onClick={() => addToFavourites(props.data.name)}>
                    <FavoriteBorderIcon />
                </IconButton>
            )
        }
    }

    return (
        <Card className='poke-card'>
            <CardContent>
                <div className="poke-image-wrapper">
                    <div className="icon-wrapper">
                        {getHeartIcon(props.data.name)}
                    </div>
                    <img src={props.data.img} alt="" className="src" />
                </div>
                <div className="info-panel">
                    <div className="topline">
                        <Typography variant="subtitle1" gutterBottom>
                            {getHighlightedName()}
                        </Typography>
                        <PokeBadge type={props.data.type} />
                    </div>
                    <div className="stats">
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <Chip icon={<FavoriteIcon />} label={'HP ' + props.data.stats.hp} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<WhatshotIcon />} label={'ATK ' + props.data.stats.atk} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<ShieldIcon />} label={'DEF ' + props.data.stats.def} variant="outlined" />
                            </Grid>
                            <Grid item xs={6}>
                                <Chip icon={<AutoFixHighIcon />} label={'SP ' + props.data.stats.sp} variant="outlined" />
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default PokeCard;