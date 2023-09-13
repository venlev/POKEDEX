import './search-page.css';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import AccountPanel from '../../components/account-panel/account-panel.component';
import PokeCard from '../../components/poke-card/poke-card.component';
import { useEffect, useState } from 'react';
import { getPokemonByName } from '../../services/pokemon-api.service';

const SearchPage = () => {

    const [pokemonName, setPokemonName] = useState('pikachu');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getPokemonByName(pokemonName).then(data => {
            console.log(data);
        });
    }, [pokemonName]);

    const makeSearch = (e: any) => {
        setPokemonName(e.target.value);
    }

    return (
        <div id="search-page-main">
            <div className="search-wrapper">
                <TextField
                    placeholder="Search Pokémon..."
                    className='search-bar'
                    onChange={(event) => makeSearch(event)}
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        )
                    }}
                />
            </div>
            <div className="account-panel-wrapper">
                <AccountPanel />
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
    )
}

export default SearchPage;