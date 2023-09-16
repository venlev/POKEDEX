export type PokemonTypes = 'fire' | 'grass' | 'electric';

export type FavouritePokemonTypeList = {
    fire: boolean,
    grass: boolean,
    electric: boolean
}

export type PokemonCard = {
    img: string,
    name: string,
    type: string,
    stats: PokemonStats,
    favourite?: boolean
}

export type PokemonStats = {
    hp: number,
    sp: number,
    atk: number,
    def: number,
}