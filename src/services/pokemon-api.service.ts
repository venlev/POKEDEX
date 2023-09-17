import axios from 'axios';
import { PokemonCard } from '../typedefinitions/pokemon-typedefs';
import noImageAvailable from '../assets/no_image_available.png'

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

const getPokeCardDataList = (suggestionList: string[]): Promise<PokemonCard[]> => {
    return new Promise(resolve => {
        let queryPromisesList: Promise<any>[] = [];
        let pokemonCardPreps: PokemonCard[] = [];

        if (suggestionList.length && suggestionList.length > 0) {

            suggestionList.forEach(suggestedPokemon => {
                queryPromisesList.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${suggestedPokemon}`));
            });

            Promise.all(queryPromisesList).then(pokeResponseData => {
                for (let result of pokeResponseData) {
                    const pokemonData = result.data;

                    let statStore: { [key: string]: number } = {};

                    pokemonData.stats.forEach((stat: { base_stat: number, stat: { name: string } }) => {
                        statStore[stat.stat.name] = stat.base_stat
                    });

                    const newPokemonCard: PokemonCard = {
                        img: pokemonData.sprites.front_default ? pokemonData.sprites.front_default : noImageAvailable,
                        name: pokemonData.name,
                        type: pokemonData.types[0].type.name,
                        stats: {
                            hp: statStore.hp,
                            sp: statStore['special-attack'],
                            atk: statStore.attack,
                            def: statStore.defense
                        }
                    }
                    pokemonCardPreps.push(newPokemonCard);
                }
                resolve(pokemonCardPreps);
            });

        }
    })
}

type URL = string;
type allPokemonsResult = { name: string, url: string };

export {
    getAllPokemonNames,
    getPokeCardDataList
}