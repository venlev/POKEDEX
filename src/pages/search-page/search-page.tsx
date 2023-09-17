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

const SearchPage = () => {

    const [pokemonName, setPokemonName] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);
    const [pokemons, setPokemons] = useState(['']);
    const [timeoutContext, setTimeoutContext] = useState(setTimeout(() => { }, 0));
    const [pokemonCardResultList, setPokemonCardResultList] = useState([] as PokemonCard[])

    useEffect(() => {

        /* TIMER TO WAIT USER TO FINISH TYPING BEFORE SENDING OUT TOO MANY REQS*/
        const pauseMillis = 2000; /* WAIT THIS AMOUNT OF TIME AFTER LAST KS*/
        if (timeoutContext) clearTimeout(timeoutContext);

        if (pokemonName && pokemonName.length > 0) {
            let typePauseTimer = setTimeout(() => {
                console.log('search with: ', pokemonName)
                let suggestionList: string[] = searchInList(pokemonName, pokemons);
                getPokeCardDataList(suggestionList).then(pokemonCardResultList => {
                    setPokemonCardResultList(pokemonCardResultList);
                    console.log(pokemonCardResultList);
                });
            }, pauseMillis);

            setTimeoutContext(typePauseTimer);
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

    const renderPokeCards = () => {
        let PokeCardList = [];

        if (pokemonCardResultList.length > 0) {
            for (let pokemonResultCard of pokemonCardResultList) {
                PokeCardList.push(<PokeCard data={pokemonResultCard} searchTerm={pokemonName} />)
            }
        }

        return PokeCardList;
    }

    const searchPageMainContent = () => {
        return (
            <div id="search-page-main">
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
                    <AccountPanel nickname={loggedInUser.nickname} />
                </div>
                <div className="card-list-scroller">
                    <div id="poke-card-list-wrapper">
                        {renderPokeCards()}
                    </div>
                </div>
            </div>
        );
    }

    return loggedInUser && loggedInUser.uid ? searchPageMainContent() : <PokedexLoader />
}

export default SearchPage;