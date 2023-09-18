export type PokemonResultFilters = {
    type: string,
    ability: string,
    attackRange: {
        from: number,
        to: number
    }
}