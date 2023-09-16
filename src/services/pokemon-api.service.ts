import { PokemonClient } from 'pokenode-ts';

const API = new PokemonClient();

const getPokemonByName = (name: string) => {
    //console.log(name)
    return new Promise(resolve => {
        API.getPokemonByName(name)
            .then((data) => {
                //console.log(data)
                resolve(data);
            })
            .catch((error) => console.error(error))
    })
}

export {
    getPokemonByName
}