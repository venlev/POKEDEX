import React, { useCallback } from 'react';
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
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Slider from '@mui/material/Slider';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import { PokemonResultFilters } from '../../typedefinitions/utils-typedefs';

const SearchPage = () => {

    const [pokemonName, setPokemonName] = useState('');
    const [loggedInUser, setLoggedInUser] = useState({} as UserData);
    const [pokemons, setPokemons] = useState(['']);
    const [timeoutContext, setTimeoutContext] = useState(setTimeout(() => { }, 0));
    const [pokemonCardResultList, setPokemonCardResultList] = useState([] as PokemonCard[]);
    const [, setNewState] = useState({});
    const [statPanelData, setStatPanelData] = useState({ data: {} as PokemonCard, open: false });
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [searchMessage, setSearchMessage] = useState<'none' | 'short-query' | 'loading' | 'no-result'>('none');
    const [filters, setFilters] = useState<PokemonResultFilters>({} as PokemonResultFilters);
    const [atkFilterBounds, setAtkFilterBounds] = useState<AttackFilterRange>({} as AttackFilterRange);

    useEffect(() => {

        /* TIMER TO WAIT USER TO FINISH TYPING BEFORE SENDING OUT TOO MANY REQS*/
        const pauseMillis = 2000; /* WAIT THIS AMOUNT OF TIME AFTER LAST KS*/
        if (timeoutContext) clearTimeout(timeoutContext);
        let isFavouritesAvailable: boolean = (loggedInUser.favouritePokemonList && loggedInUser.favouritePokemonList.length > 0);

        if (pokemonName && pokemonName.length >= 3 && pokemonName !== 'favourites') {
            setPokemonCardResultList([]);
            setSearchMessage('loading');
            let typePauseTimer = setTimeout(() => {
                let suggestionList: string[] = searchInList(pokemonName, pokemons);
                if (suggestionList.length === 0) setSearchMessage('no-result');
                getPokeCardDataList(suggestionList).then(pokemonCardResultList => {
                    setPokemonCardResultList(pokemonCardResultList);
                });
            }, pauseMillis);

            setTimeoutContext(typePauseTimer);
        } else if (pokemonName !== '') setSearchMessage('short-query');


        if (pokemonName === 'favourites' && isFavouritesAvailable) {
            getPokeCardDataList(loggedInUser.favouritePokemonList).then(pokemonCardResultList => {
                setPokemonCardResultList(pokemonCardResultList);
            });
        }

        //console.log(`search: ${pokemonName} results: `, suggestionList);
    }, [pokemonName]);

    const getTypeFilters = useCallback(() => {
        let typeFilters: string[] = [];
        let uTypes: string[] = [];
        let options = [];

        for (let PCR of pokemonCardResultList) typeFilters.push(PCR.type);
        typeFilters.forEach(type => { if (!uTypes.includes(type)) uTypes.push(type); });
        for (let type of uTypes) { options.push(<option value={type}>{type}</option>); }

        return options;
    }, [pokemonCardResultList]);

    const getAbilityFilters = useCallback(() => {
        let abilityFilters: string[] = [];
        let uAbilities: string[] = [];
        let abilities = [];

        for (let PCR of pokemonCardResultList) abilityFilters.push(...PCR.abilities);
        abilityFilters.forEach(ability => { if (!uAbilities.includes(ability)) uAbilities.push(ability); });
        for (let ability of uAbilities) { abilities.push(<option value={ability}>{ability}</option>); }

        return abilities;
    }, [pokemonCardResultList]);


    const getAttackFilters = useCallback(() => {
        let attackForces: number[] = [];

        for (let PCR of pokemonCardResultList) attackForces.push(PCR.stats.atk);
        let bottomValue = Math.min(...attackForces);
        let ceilValue = Math.max(...attackForces);
        let range: AttackFilterRange = { ceil: ceilValue, bottom: bottomValue };
        setAtkFilterBounds(range);
        filters.attackRange = { from: 0, to: 0 }
        filters.attackRange.from = bottomValue;
        filters.attackRange.to = ceilValue;

    }, [pokemonCardResultList]);

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

    const toggleFilterDialog = (direction: 'open' | 'close') => {
        direction === 'close'
            ? setOpenFilterDialog(false)
            : setOpenFilterDialog(true);
    };

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
        switch (searchMessage) {
            case 'none':
                return (
                    <div id="search-hint">
                        <h1>Start typing for search...</h1>
                        <span>There is nothing to see yet; please start a search, and you can find your favourite pokemons. This search is powered by POKEAPI.CO!
                            Do you know that there are over a 1000 pokemons to choose from? You can mark your favourite ones to find them later.
                            If you have some pokemons marked, you can click on the "FAVOURITE POKEMONS" link or search "favourites" to see them!</span>
                    </div>
                )
            case 'short-query':
                return (
                    <div id="search-hint">
                        <h1>No results yet...</h1>
                        <span>Typee three or more characters of the name of the pokemon you are looking for to begin search...</span>
                    </div>
                )
            case 'loading':
                return (
                    <div id="search-hint">
                        <h1 className="hint-title">Loading...</h1>
                        <span>Let me find the best results...</span>
                        <LinearProgress className='progress-bar' />
                    </div>
                )

            case 'no-result':
                return (
                    <div id="search-hint">
                        <h1>No results...</h1>
                        <span>It seems like we couldn't find a pokemon with this name. Make sure you typed the search term correctly.</span>
                    </div>
                )
        }
    }

    const renderFilters = () => {

        const filterChange = (e: any, filterTarget: FilterTargetType) => {
            getAttackFilters();
            switch (filterTarget) {
                case 'type':
                    filters.type = e.target.value;
                    break;
                case 'ability':
                    filters.ability = e.target.value;
                    break;
                case 'attack':
                    filters.attackRange = { from: 0, to: 0 }
                    filters.attackRange.from = e.target.value[0];
                    filters.attackRange.to = e.target.value[1];
                    break;
            }
        }

        const searchByFilters = () => {
            console.log(filters);
        }

        return (
            <Dialog open={openFilterDialog} onClose={e => toggleFilterDialog('close')}>
                <DialogTitle className='filter-dialog-header'>
                    Filter in search results...
                    <IconButton className='filter-dialog-close' onClick={e => { toggleFilterDialog('close'); }}>
                        <CancelIcon color='error' />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div id="filter-bar">
                        <table>
                            <tbody>
                                <tr className='custom-tr'>
                                    <td>Filter by type</td>
                                    <td>
                                        <select className='select' onChange={e => filterChange(e, 'type')}>
                                            <option value="" disabled>Select type</option>
                                            {getTypeFilters()}
                                        </select>
                                    </td>
                                </tr>
                                <tr className='custom-tr'>
                                    <td>Filter by ability</td>
                                    <td>
                                        <select className='select' onChange={e => filterChange(e, 'ability')}>
                                            <option value="" disabled>Select ability</option>
                                            {getAbilityFilters()}
                                        </select>
                                    </td>
                                </tr>
                                <tr className='custom-tr'>
                                    <td>Attack</td>
                                    <td>
                                        <Slider
                                            value={[10, 40]}
                                            min={atkFilterBounds.bottom}
                                            max={atkFilterBounds.ceil}
                                            valueLabelDisplay="auto"
                                            onChange={e => filterChange(e, 'attack')}
                                        />
                                    </td>
                                </tr>
                                <tr className='custom-tr'>
                                    <td colSpan={2}>
                                        <Button variant="contained" className='filter-btn' endIcon={<FilterAltIcon />} onClick={searchByFilters}>
                                            Filter results
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    const searchPageMainContent = () => {
        return (
            <div id="search-page-main">
                {renderFilters()}
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
                                <>
                                    <IconButton onClick={e => toggleFilterDialog('open')} disabled={pokemonCardResultList.length === 0}>
                                        <FilterAltIcon />
                                    </IconButton>
                                    <IconButton onClick={clearSearch}>
                                        <CancelIcon />
                                    </IconButton>
                                </>
                            )
                        }}
                    />
                </div>
                <div className="account-panel-wrapper">
                    <AccountPanel nickname={loggedInUser.nickname} showFavourites={showFavourites}/>
                </div>
                <div className="card-list-scroller">
                    <div id="poke-card-list-wrapper">
                        {pokemonCardResultList.length === 0 ? renderSearchHint() : renderPokeCards()}
                    </div>
                </div>
            </div>
        );
    }

    return loggedInUser && loggedInUser.uid ? searchPageMainContent() : <PokedexLoader />
}

type FilterTargetType = 'type' | 'ability' | 'attack';
type AttackFilterRange = { ceil: number, bottom: number };

export default SearchPage;