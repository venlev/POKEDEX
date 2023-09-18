import React from 'react';
import './search-page.css';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import AccountPanel from '../../components/account-panel/account-panel.component';
import PokeCard from '../../components/poke-card/poke-card.component';
import { useEffect, useState } from 'react';
import { getAllPokemonNames, getPokeCardDataList } from '../../services/pokemon-api.service';
import { UserData } from '../../typedefinitions/user-data-typedefs';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { db } from '../../firebase';
import { getUser } from '../../services/user-store.service';
import PokedexLoader from '../../components/loader/loader.component';
import { searchInList } from '../../services/search.service';
import { PokemonCard } from '../../typedefinitions/pokemon-typedefs';
import StatPanel from '../../components/stat-panel/stat-panel.component';

const SearchPage = () => {

    const [pokemonName, setPokemonName] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);
    const [pokemons, setPokemons] = useState(['']);
    const [timeoutContext, setTimeoutContext] = useState(setTimeout(() => { }, 0));
    const [pokemonCardResultList, setPokemonCardResultList] = useState([] as PokemonCard[]);
    const [, setNewState] = useState({});
    const [statPanelData, setStatPanelData] = useState({ data: {} as PokemonCard, open: false });

    useEffect(() => {

        /* TIMER TO WAIT USER TO FINISH TYPING BEFORE SENDING OUT TOO MANY REQS*/
        const pauseMillis = 2000; /* WAIT THIS AMOUNT OF TIME AFTER LAST KS*/
        if (timeoutContext) clearTimeout(timeoutContext);
        let isFavouritesAvailable: boolean = (loggedInUser.favouritePokemonList && loggedInUser.favouritePokemonList.length > 0);

        if (pokemonName && pokemonName.length > 0 && pokemonName !== 'favourites') {
            let typePauseTimer = setTimeout(() => {
                let suggestionList: string[] = searchInList(pokemonName, pokemons);
                getPokeCardDataList(suggestionList).then(pokemonCardResultList => {
                    setPokemonCardResultList(pokemonCardResultList);
                });
            }, pauseMillis);

            setTimeoutContext(typePauseTimer);
        }


        if (pokemonName === 'favourites' && isFavouritesAvailable) {
            getPokeCardDataList(loggedInUser.favouritePokemonList).then(pokemonCardResultList => {
                setPokemonCardResultList(pokemonCardResultList);
            });
        }

        //console.log(`search: ${pokemonName} results: `, suggestionList);
    }, [pokemonName]);

    useEffect(() => {
        /* GET USER DATA */
        const userDocumentQuery = query(collection(db, "user-data"), where("uid", "==", getUser().user.uid));
        const qSnapshot = getDocs(userDocumentQuery);
        qSnapshot.then((QuerySnapshot) => {
            const QueryDocumentSnapshot = QuerySnapshot.docs[0];
            setLoggedInUser(QueryDocumentSnapshot.data() as UserData);
        }).catch(err => console.log(err));

        /* GET POKEMONS LIST */
        getAllPokemonNames().then(pokemons => setPokemons(pokemons as string[]));
    }, []);

    const makeSearch = (e: any) => {
        setPokemonName(e.target.value);
    }

    const clearSearch = () => {
        setPokemonName('');
    }

    const updateFavourites = (updatedFavourites: string[]) => {
        loggedInUser.favouritePokemonList = updatedFavourites;
        setNewState({});
    }

    const pokemonCardOnClick = (cardData: PokemonCard) => {
        setStatPanelData({ data: cardData, open: true });
    }

    const renderPokeCards = () => {
        let PokeCardList = [];
        if (pokemonCardResultList.length > 0) {
            for (let pokemonResultCard of pokemonCardResultList) {
                PokeCardList.push(
                    <div onClick={e => { pokemonCardOnClick(pokemonResultCard); e.stopPropagation(); }}>
                        <PokeCard
                            data={pokemonResultCard}
                            searchTerm={pokemonName}
                            updateFavourites={(v: string[]) => { updateFavourites(v); setNewState({}) }}
                        />
                    </div>);
            }
        }

        return PokeCardList;
    }

    const showFavourites = () => {
        setPokemonName('favourites');
    }

    const renderSearchHint = () => {
        return (
            <div id="search-hint">
                <h1>Start typing for search...</h1>
                <span>There is nothing to see yet; please start a search, and you can find your favourite pokemons. This search is powered by POKEAPI.CO!
                    Do you know that there are over a 1000 pokemons to choose from? You can mark your favourite ones to find them later.
                    If you have some pokemons marked, you can click on the "FAVOURITE POKEMONS" link or search "favourites" to see them!</span>
            </div>
        )
    }

    const searchPageMainContent = () => {
        return (
            <div id="search-page-main">
                <StatPanel
                    open={statPanelData.open}
                    close={(e: boolean) => { if (e) statPanelData.open = false; }}
                    data={statPanelData.data}
                    updateFavourites={(v: string[]) => { updateFavourites(v); setNewState({}) }} />
                <div className="search-wrapper">
                    <TextField
                        placeholder="Search Pokémon..."
                        className='search-bar'
                        value={pokemonName}
                        onChange={(event) => makeSearch(event)}
                        InputProps={{
                            startAdornment: (
                                <IconButton disabled>
                                    <SearchIcon />
                                </IconButton>
                            ),
                            endAdornment: (
                                <IconButton onClick={clearSearch}>
                                    <CancelIcon />
                                </IconButton>
                            )
                        }}
                    />
                </div>
                <div className="account-panel-wrapper">
                    <AccountPanel nickname={loggedInUser.nickname} showFavourites={showFavourites} />
                </div>
                <div className="card-list-scroller">
                    <div id="poke-card-list-wrapper">
                        {pokemonName === '' ? renderSearchHint() : renderPokeCards()}
                    </div>
                </div>
            </div>
        );
    }

    return loggedInUser && loggedInUser.uid ? searchPageMainContent() : <PokedexLoader />
}

export default SearchPage;