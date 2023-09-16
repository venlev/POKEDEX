import { FavouritePokemonTypeList } from "./pokemon-typedefs"

export type UserData = {
    uid: string,
    nickname: string,
    favouritePokemonTypes: FavouritePokemonTypeList,
    favouritePokemonList: string[];
}