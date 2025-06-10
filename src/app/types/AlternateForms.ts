export type AlternateForms = typeof alternateForms;

export const alternateForms: Record<string, {
  forms: Array<{
    formName: string;
    pokedexId?: number;
    basePokedexId?: number;
    types?: string[];
    formSuffix?: string;
    apiName?: string;
    notes?: string;
  }>;
}> = {
  // Gender differences with unique forms
  "unfezant": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },
  "frillish": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },
  "jellicent": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },
  "pyroar": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },
  "meowstic": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },
  "indeedee": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },
  "basculegion": {
    forms: [
      { formName: "Male" },
      { formName: "Female" }
    ]
  },

  // Permanent alternate forms (not regional, not mega, not gimmick)
  "castform": {
    forms: [
      { formName: "Normal" },
      { formName: "Sunny" },
      { formName: "Rainy" },
      { formName: "Snowy" }
    ]
  },
  "deoxys": {
    forms: [
      { formName: "Normal" },
      { formName: "Attack" },
      { formName: "Defense" },
      { formName: "Speed" }
    ]
  },
  "burmy": {
    forms: [
      { formName: "Plant Cloak" },
      { formName: "Sandy Cloak" },
      { formName: "Trash Cloak" }
    ]
  },
  "wormadam": {
    forms: [
      { formName: "Plant Cloak" },
      { formName: "Sandy Cloak" },
      { formName: "Trash Cloak" }
    ]
  },
  "cherrim": {
    forms: [
      { formName: "Overcast" },
      { formName: "Sunshine" }
    ]
  },
  "shellos": {
    forms: [
      { formName: "West Sea" },
      { formName: "East Sea" }
    ]
  },
  "gastrodon": {
    forms: [
      { formName: "West Sea" },
      { formName: "East Sea" }
    ]
  },
  "rotom": {
    forms: [
      { formName: "Normal" },
      { formName: "Heat" },
      { formName: "Wash" },
      { formName: "Frost" },
      { formName: "Fan" },
      { formName: "Mow" }
    ]
  },
  dialga: {
    forms: [
      {
        formName: "Normal",
        pokedexId: 483,
        basePokedexId: 483,
        types: ["steel", "dragon"],
      },
      {
        formName: "Origin",
        pokedexId: 10245,
        basePokedexId: 483,
        types: ["steel", "dragon"],
      },
    ],
  },
  palkia: {
    forms: [
      {
        formName: "Normal",
        pokedexId: 484,
        basePokedexId: 484,
        types: ["water", "dragon"],
      },
      {
        formName: "Origin",
        pokedexId: 10246,
        basePokedexId: 484,
        types: ["water", "dragon"],
      },
    ],
  },
  "giratina-altered": {
    forms: [
      {
        formName: "Altered",
        pokedexId: 487,
        basePokedexId: 487,
        types: ["ghost", "dragon"],
      },
      {
        formName: "Origin",
        pokedexId: 10007,
        basePokedexId: 487,
        types: ["ghost", "dragon"],
      },
    ],
  },
  "shaymin": {
    forms: [
      { formName: "Land" },
      { formName: "Sky" }
    ]
  },
  "basculin": {
    forms: [
      { formName: "Red-Striped" },
      { formName: "Blue-Striped" },
      { formName: "White-Striped" }
    ]
  },
  "darmanitan": {
    forms: [
      { formName: "Standard" },
      { formName: "Zen Mode" }
    ]
  },
  "tornadus": {
    forms: [
      { formName: "Incarnate" },
      { formName: "Therian" }
    ]
  },
  "thundurus": {
    forms: [
      { formName: "Incarnate" },
      { formName: "Therian" }
    ]
  },
  "landorus": {
    forms: [
      { formName: "Incarnate" },
      { formName: "Therian" }
    ]
  },
  "kyurem": {
    forms: [
      { formName: "Normal" },
      { formName: "White" },
      { formName: "Black" }
    ]
  },
  "keldeo": {
    forms: [
      { formName: "Ordinary" },
      { formName: "Resolute" }
    ]
  },
  "meloetta": {
    forms: [
      { formName: "Aria" },
      { formName: "Pirouette" }
    ]
  },
  "greninja": {
    forms: [
      { formName: "Normal" },
      { formName: "Ash-Greninja" }
    ]
  },
  "zygarde": {
    forms: [
      { formName: "50%" },
      { formName: "10%" },
      { formName: "Complete" }
    ]
  },
  "oricorio": {
    forms: [
      { formName: "Baile" },
      { formName: "Pom-Pom" },
      { formName: "Pa'u" },
      { formName: "Sensu" }
    ]
  },
  "lycanroc": {
    forms: [
      { formName: "Midday" },
      { formName: "Midnight" },
      { formName: "Dusk" }
    ]
  },
  "wishiwashi": {
    forms: [
      { formName: "Solo" },
      { formName: "School" }
    ]
  },
  "minior": {
    forms: [
      { formName: "Meteor" },
      { formName: "Core" }
    ]
  },
  "mimikyu": {
    forms: [
      { formName: "Disguised" },
      { formName: "Busted" }
    ]
  },
  "toxtricity": {
    forms: [
      { formName: "Amped" },
      { formName: "Low Key" }
    ]
  },
  "eiscue": {
    forms: [
      { formName: "Ice Face" },
      { formName: "Noice Face" }
    ]
  },
  "morpeko": {
    forms: [
      { formName: "Full Belly" },
      { formName: "Hangry" }
    ]
  },
  "urshifu": {
    forms: [
      { formName: "Single Strike" },
      { formName: "Rapid Strike" }
    ]
  },
  "zarude": {
    forms: [
      { formName: "Normal" },
      { formName: "Dada" }
    ]
  },
  "enamorus": {
    forms: [
      { formName: "Incarnate" },
      { formName: "Therian" }
    ]
  },
  // Add more as needed
};