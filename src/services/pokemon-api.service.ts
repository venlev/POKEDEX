import axios from 'axios';
import { PokemonCard } from '../typedefinitions/pokemon-typedefs';

const getAllPokemonNames = () => {
    return new Promise(resolve => {
        axios.get('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1281')
            .then(values => {
                const results: allPokemonsResult[] = values.data.results;
                let allPokemons = results.map(result => result.name);
                resolve(allPokemons);
            }).catch(err => console.log(err));
    });
}

const getPokeCardDataList = (suggestionList: string[]) => {
    let queryPromisesList: Promise<any>[] = [];
    let pokemonCardPreps: PokemonCard[] = [];

    suggestionList.forEach(suggestedPokemon => {
        queryPromisesList.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${suggestedPokemon}`));
    });

    Promise.all(queryPromisesList).then(pokeResponseData => {
        for (let result of pokeResponseData) {
            const pokemonData = result.data;

            const newPokemonCard: PokemonCard = {
                img: 'pokemonData.sprites.front_default',
                name: pokemonData.name,
                type: pokemonData.types[0].type.name,
                stats: {
                    hp: pokemonData.stats.filter((stat: { name: string; base_stat: number; }) => { if (stat.name === 'hp') return stat.base_stat }),
                    sp: pokemonData.stats.filter((stat: { name: string; base_stat: number; }) => { if (stat.name === 'special-attack') return stat.base_stat }),
                    atk: pokemonData.stats.filter((stat: { name: string; base_stat: number; }) => { if (stat.name === 'attack') return stat.base_stat }),
                    def: pokemonData.stats.filter((stat: { name: string; base_stat: number; }) => { if (stat.name === 'defense') return stat.base_stat })
                }
            }
            pokemonCardPreps.push(newPokemonCard);
        }

        console.log(pokemonCardPreps);
    });

    /*

    we should return Promise<PokeCardData>[]
    if (queryPromisesList.length > 0) {
        return Promise.all(queryPromisesList);
    }
    */
}

type URL = string;
type allPokemonsResult = { name: string, url: string };

export {
    getAllPokemonNames,
    getPokeCardDataList
}