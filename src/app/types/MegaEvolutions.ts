export type MegaEvolutionData = {
    formName: string;
    pokedexId: number;
    basePokedexId: number;
    types: string[];
};

export type MegaEvolutions = Record<string, MegaEvolutionData>;

export const megaEvolutions: MegaEvolutions = {
    // Mega Evolutions

    // Kanto
    venusaur: {
        formName: "Mega",
        pokedexId: 10033,
        basePokedexId: 3,
        types: ["grass", "poison"],
    },
    charizard: {
        formName: "Mega X",
        pokedexId: 10034,
        basePokedexId: 6,
        types: ["fire", "dragon"],
    },
    charizardY: {
        formName: "Mega Y",
        pokedexId: 10035,
        basePokedexId: 6,
        types: ["fire", "flying"],
    },
    blastoise: {
        formName: "Mega",
        pokedexId: 10036,
        basePokedexId: 9,
        types: ["water"],
    },
    beedrill: {
        formName: "Mega",
        pokedexId: 10090,
        basePokedexId: 15,
        types: ["bug", "poison"],
    },
    pidgeot: {
        formName: "Mega",
        pokedexId: 10073,
        basePokedexId: 18,
        types: ["normal", "flying"],
    },
    alakazam: {
        formName: "Mega",
        pokedexId: 10037,
        basePokedexId: 65,
        types: ["psychic"],
    },
    slowbro: {
        formName: "Mega",
        pokedexId: 10071,
        basePokedexId: 80,
        types: ["water", "psychic"],
    },
    gengar: {
        formName: "Mega",
        pokedexId: 10038,
        basePokedexId: 94,
        types: ["ghost", "poison"],
    },
    kangaskhan: {
        formName: "Mega",
        pokedexId: 10039,
        basePokedexId: 115,
        types: ["normal"],
    },
    pinsir: {
        formName: "Mega",
        pokedexId: 10040,
        basePokedexId: 127,
        types: ["bug", "flying"],
    },
    gyarados: {
        formName: "Mega",
        pokedexId: 10041,
        basePokedexId: 130,
        types: ["water", "dark"],
    },
    aerodactyl: {
        formName: "Mega",
        pokedexId: 10042,
        basePokedexId: 142,
        types: ["rock", "flying"],
    },
    mewtwo: {
        formName: "Mega X",
        pokedexId: 10043,
        basePokedexId: 150,
        types: ["psychic", "fighting"],
    },
    mewtwoY: {
        formName: "Mega Y",
        pokedexId: 10044,
        basePokedexId: 150,
        types: ["psychic"],
    },

    // Johto
    ampharos: {
        formName: "Mega",
        pokedexId: 10045,
        basePokedexId: 181,
        types: ["electric", "dragon"],
    },
    steelix: {
        formName: "Mega",
        pokedexId: 10072,
        basePokedexId: 208,
        types: ["steel", "ground"],
    },
    scizor: {
        formName: "Mega",
        pokedexId: 10046,
        basePokedexId: 212,
        types: ["bug", "steel"],
    },
    heracross: {
        formName: "Mega",
        pokedexId: 10047,
        basePokedexId: 214,
        types: ["bug", "fighting"],
    },
    houndoom: {
        formName: "Mega",
        pokedexId: 10048,
        basePokedexId: 229,
        types: ["dark", "fire"],
    },
    tyranitar: {
        formName: "Mega",
        pokedexId: 10049,
        basePokedexId: 248,
        types: ["rock", "dark"],
    },

    // Hoenn

    sceptile: {
        formName: "Mega",
        pokedexId: 10065,
        basePokedexId: 254,
        types: ["grass", "dragon"],
    },
    blaziken: {
        formName: "Mega",
        pokedexId: 10050,
        basePokedexId: 257,
        types: ["fire", "fighting"],
    },
    swampert: {
        formName: "Mega",
        pokedexId: 10064,
        basePokedexId: 260,
        types: ["water", "ground"],
    },
    gardevoir: {
        formName: "Mega",
        pokedexId: 10051,
        basePokedexId: 282,
        types: ["psychic", "fairy"],
    },
    sableye: {
        formName: "Mega",
        pokedexId: 10066,
        basePokedexId: 302,
        types: ["dark", "ghost"],
    },
    mawile: {
        formName: "Mega",
        pokedexId: 10052,
        basePokedexId: 303,
        types: ["steel", "fairy"],
    },
    aggron: {
        formName: "Mega",
        pokedexId: 10053,
        basePokedexId: 306,
        types: ["steel", "rock"],
    },
    medicham: {
        formName: "Mega",
        pokedexId: 10054,
        basePokedexId: 308,
        types: ["fighting", "psychic"],
    },
    manectric: {
        formName: "Mega",
        pokedexId: 10055,
        basePokedexId: 310,
        types: ["electric"],
    },
    sharpedo: {
        formName: "Mega",
        pokedexId: 10070,
        basePokedexId: 319,
        types: ["water", "dark"],
    },
    camerupt: {
        formName: "Mega",
        pokedexId: 10087,
        basePokedexId: 323,
        types: ["fire", "ground"],
    },
    altaria: {
        formName: "Mega",
        pokedexId: 10067,
        basePokedexId: 334,
        types: ["dragon", "fairy"],
    },
    banette: {
        formName: "Mega",
        pokedexId: 10056,
        basePokedexId: 354,
        types: ["ghost"],
    },
    absol: {
        formName: "Mega",
        pokedexId: 10057,
        basePokedexId: 359,
        types: ["dark"],
    },
    glalie: {
        formName: "Mega",
        pokedexId: 10074,
        basePokedexId: 362,
        types: ["ice"],
    },
    salamence: {
        formName: "Mega",
        pokedexId: 10089,
        basePokedexId: 373,
        types: ["dragon", "flying"],
    },
    metagross: {
        formName: "Mega",
        pokedexId: 10076,
        basePokedexId: 376,
        types: ["steel", "psychic"],
    },
    latias: {
        formName: "Mega",
        pokedexId: 10062,
        basePokedexId: 380,
        types: ["dragon", "psychic"],
    },
    latios: {
        formName: "Mega",
        pokedexId: 10063,
        basePokedexId: 381,
        types: ["dragon", "psychic"],
    },
    kyogre: {
        formName: "Primal",
        pokedexId: 10077,
        basePokedexId: 382,
        types: ["water"],
    },
    groudon: {
        formName: "Primal",
        pokedexId: 10078,
        basePokedexId: 383,
        types: ["ground", "fire"],
    },
    rayquaza: {
        formName: "Mega",
        pokedexId: 10079,
        basePokedexId: 384,
        types: ["dragon", "flying"],
    },

    // Sinnoh
    lopunny: {
        formName: "Mega",
        pokedexId: 10088,
        basePokedexId: 428,
        types: ["normal", "fighting"],
    },
    garchomp: {
        formName: "Mega",
        pokedexId: 10058,
        basePokedexId: 445,
        types: ["dragon", "ground"],
    },
    lucario: {
        formName: "Mega",
        pokedexId: 10059,
        basePokedexId: 448,
        types: ["fighting", "steel"],
    },
    abomasnow: {
        formName: "Mega",
        pokedexId: 10060,
        basePokedexId: 460,
        types: ["grass", "ice"],
    },
    gallade: {
        formName: "Mega",
        pokedexId: 10068,
        basePokedexId: 475,
        types: ["psychic", "fighting"],
    },

    // Unova
    audino: {
        formName: "Mega",
        pokedexId: 10069,
        basePokedexId: 531,
        types: ["normal", "fairy"],
    },

    // Kalos
    diancie: {
        formName: "Mega",
        pokedexId: 10075,
        basePokedexId: 719,
        types: ["rock", "fairy"],
    },
}