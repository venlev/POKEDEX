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
    const [searchTerm, setSearchTerm] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);
    const [pokemons, setPokemons] = useState(['']);

    useEffect(() => {
        /*
        getPokemonByName(pokemonName).then(data => {
            //console.log(data);
        });
        */

        let suggestionList: string[] = searchInList(pokemonName, pokemons);
        let pokeCardDataList: PokemonCard[];

        getPokeCardDataList(suggestionList);

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

    const searchPageMainContent = () => {
        return (
            <div id="search-page-main">
                <div className="search-wrapper">
                    <TextField
                        placeholder="Search Pokémon..."
                        className='search-bar'
                        onChange={(event) => makeSearch(event)}
                        InputProps={{
                            startAdornment: (
                                <IconButton disabled>
                                    <SearchIcon />
                                </IconButton>
                            ),
                            endAdornment: (
                                <IconButton>
                                    <CancelIcon />
                                </IconButton>
                            )
                        }}
                    />
                </div>
                <div className="account-panel-wrapper">
                    <AccountPanel nickname={loggedInUser.nickname} />
                </div>
                <div id="poke-card-list-wrapper">
                    <PokeCard />
                    <PokeCard />
                    <PokeCard />
                    <PokeCard />
                    <PokeCard />
                    <PokeCard />
                </div>
            </div>
        );
    }

    return loggedInUser && loggedInUser.uid ? searchPageMainContent() : <PokedexLoader />
}

export default SearchPage;