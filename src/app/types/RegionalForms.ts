import { types } from "util";

export const regionalForms = {
    // Alolan Forms (Gen 7)
    rattata: {
        formName: "Alolan",
        pokedexId: 10091, // Alolan Rattata uses a special sprite ID
        types: ["dark", "normal"],
    },
    raticate: {
        formName: "Alolan",
        pokedexId: 10093,
        types: ["dark", "normal"],
    },
    raichu: {
        formName: "Alolan",
        pokedexId: 10100,
        types: ["electric", "psychic"],
    },
    sandshrew: {
        formName: "Alolan",
        pokedexId: 10101,
        types: ["ice", "steel"],
    },
    sandslash: {
        formName: "Alolan",
        pokedexId: 10102,
        types: ["ice", "steel"],
    },
    vulpix: {
        formName: "Alolan",
        pokedexId: 10103,
        types: ["ice"],
    },
    ninetales: {
        formName: "Alolan",
        pokedexId: 10104,
        types: ["ice", "fairy"],
    },
    diglett: {
        formName: "Alolan",
        pokedexId: 10105,
        types: ["ground", "steel"],
    },
    dugtrio: {
        formName: "Alolan",
        pokedexId: 10106,
        types: ["ground", "steel"],
    },
    meowth: {
        formName: "Alolan",
        pokedexId: 10107,
        types: ["dark"],
    },
    persian: {
        formName: "Alolan",
        pokedexId: 10108,
        types: ["dark"],
    },
    geodude: {
        formName: "Alolan",
        pokedexId: 10109,
        types: ["rock", "electric"],
    },
    graveler: {
        formName: "Alolan",
        pokedexId: 10110,
        types: ["rock", "electric"],
    },
    golem: {
        formName: "Alolan",
        pokedexId: 10111,
        types: ["rock", "electric"],
    },
    grimer: {
        formName: "Alolan",
        pokedexId: 10112,
        types: ["poison", "dark"],
    },
    muk: {
        formName: "Alolan",
        pokedexId: 10113,
        types: ["poison", "dark"],
    },
    exeggutor: {
        formName: "Alolan",
        pokedexId: 10114,
        types: ["grass", "dragon"],
    },
    marowak: {
        formName: "Alolan",
        pokedexId: 10115,
        types: ["fire", "ghost"],
    },
    zapdos: {
        formName: "Galarian",
        pokedexId: 10170,
        types: ["flying", "fighting"],
    },
    articuno: {
        formName: "Galarian",
        pokedexId: 10169,
        types: ["ice", "psychic"],
    },
    moltres: {
        formName: "Galarian",
        pokedexId: 10171,
        types: ["dark", "flying"],
    },

    // Galarian Forms (Gen 8)
    meowth_galar: {
        formName: "Galarian",
        pokedexId: 1100,  // Galarian Meowth has a separate sprite ID (not official national dex)
        types: ["steel"],
    },
    ponyta: {
        formName: "Galarian",
        pokedexId: 10162,
        types: ["psychic"],
    },
    rapidash: {
        formName: "Galarian",
        pokedexId: 10163,
        types: ["psychic", "fairy"],
    },
    farfetchd: {
        formName: "Galarian",
        pokedexId: 10166,
        types: ["fighting"],
    },
    weezing: {
        formName: "Galarian",
        pokedexId: 10167,
        types: ["poison", "fairy"],
    },
    slowpoke: {
        formName: "Galarian",
        pokedexId: 10164,
        types: ["psychic"],
    },
    slowbro: {
        formName: "Galarian",
        pokedexId: 10165,
        types: ["psychic", "poison"],
    },
    slowking: {
        formName: "Galarian",
        pokedexId: 10172,
        types: ["poison", "psychic"],
    },
    'mr-mime': {
        formName: "Galarian",
        pokedexId: 10168,
        types: ["ice", "psychic"],
    },
    corsola: {
        formName: "Galarian",
        pokedexId: 10173,
        types: ["ghost"],
    },
    zigzagoon: {
        formName: "Galarian",
        pokedexId: 10174,
        types: ["dark", "normal"],
    },
    linoone: {
        formName: "Galarian",
        pokedexId: 10175,
        types: ["dark", "normal"],
    },
    darumaka: {
        formName: "Galarian",
        pokedexId: 10176,
        types: ["ice"],
    },
    'darmanitan': {
        formName: "Galarian",
        pokedexId: 10177,
        types: ["ice"],
    },
    yamask: {
        formName: "Galarian",
        pokedexId: 10179,
        types: ["ghost", "ground"],
    },
    stunfisk: {
        formName: "Galarian",
        pokedexId: 10180,
        types: ["ground", "steel"],
    },

    // Hisuian Forms (Gen 8 - Legends: Arceus)
    growlithe: {
        formName: "Hisuian",
        pokedexId: 10229,
        types: ["fire", "rock"],
    },
    arcanine: {
        formName: "Hisuian",
        pokedexId: 10230,
        types: ["fire", "rock"],
    },
    voltorb: {
        formName: "Hisuian",
        pokedexId: 10231,
        types: ["electric", "grass"],
    },
    electrode: {
        formName: "Hisuian",
        pokedexId: 10232,
        types: ["electric", "grass"],
    },
    typhlosion: {
        formName: "Hisuian",
        pokedexId: 10233,
        types: ["fire", "ghost"],
    },
    qwilfish: {
        formName: "Hisuian",
        pokedexId: 10234,
        types: ["dark", "poison"],
    },
    sneasel: {
        formName: "Hisuian",
        pokedexId: 10235,
        types: ["fighting", "dark"],
    },
    samurott: {
        formName: "Hisuian",
        pokedexId: 10236,
        types: ["water", "dark"],
    },
    basculin: {
        formName: "Hisuian Red-Striped",
        pokedexId: 10089,
        types: ["water", "rock"],
    },
    basculin_blue: {
        formName: "Hisuian Blue-Striped",
        pokedexId: 10090,
        types: ["water", "dark"],
    },
    zorua: {
        formName: "Hisuian",
        pokedexId: 10238,
        types: ["normal", "ghost"],
    },
    zoroark: {
        formName: "Hisuian",
        pokedexId: 10239,
        types: ["normal", "ghost"],
    },
    decidueye: {
        formName: "Hisuian",
        pokedexId: 10244,
        types: ["grass", "fighting"],
    },
    lilligant: {
        formName: "Hisuian",
        pokedexId: 10237,
        types: ["grass", "fighting"],
    },
    braviary: {
        formName: "Hisuian",
        pokedexId: 10240,
        types: ["psychic", "flying"],
    },
    sliggoo: {
        formName: "Hisuian",
        pokedexId: 10241,
        types: ["steel", "dragon"],
    },
    goodra: {
        formName: "Hisuian",
        pokedexId: 10242,
        types: ["steel", "dragon"],
    },
    avalugg: {
        formName: "Hisuian",
        pokedexId: 10164,
        types: ["ice", "rock"],
    },


    // Paldean Forms (Gen 9)
    tauros: {
        formName: "Paldean Combat Breed",
        pokedexId: 10250,
        types: ["fighting", "normal"],
    },
    tauros_paldean: {
        formName: "Paldean Blaze Breed",
        pokedexId: 10251,
        types: ["fire", "normal"],
    },
    tauros_paldean_water: {
        formName: "Paldean Aqua Breed",
        pokedexId: 10252,
        types: ["water", "normal"],
    },
    wooper: {
        formName: "Paldean",
        pokedexId: 10253,
        types: ["poison", "ground"],
    },
    basculin_paldean: {
        formName: "Paldean",
        pokedexId: 10125,
        types: ["water", "fighting"],
    },
    
};
