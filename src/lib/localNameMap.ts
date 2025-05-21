// lib/localNameMap.ts
export const localNameMap: Record<string, string> = {
  "mr-mime": "Mr. Mime",
  "mime-jr": "Mime Jr.",
  "type-null": "Type: Null",
  "jangmo-o": "Jangmo-o",
  "hakamo-o": "Hakamo-o",
  "kommo-o": "Kommo-o",
  "porygon-z": "Porygon-Z",
  "ho-oh": "Ho-Oh",
  "wo-chien": "Wo-Chien",
  "chien-pao": "Chien-Pao",
  "ting-lu": "Ting-Lu",
  "chi-yu": "Chi-Yu",
  "great-tusk": "Great Tusk",
  "scream-tail": "Scream Tail",
  "brute-bonnet": "Brute Bonnet",
  "flutter-mane": "Flutter Mane",
  "slither-wing": "Slither Wing",
  "sandy-shocks": "Sandy Shocks",
  "iron-treads": "Iron Treads",
  "iron-bundle": "Iron Bundle",
  "iron-hands": "Iron Hands",
  "iron-jugulis": "Iron Jugulis",
  "iron-moth": "Iron Moth",
  "iron-thorns": "Iron Thorns",
  "iron-valiant": "Iron Valiant",
  "roaring-moon": "Roaring Moon",
  "walking-wake": "Walking Wake",
  "gouging-fire": "Gouging Fire",
  "raging-bolt": "Raging Bolt",
  "iron-leaves": "Iron Leaves",
  "urshifu-single-strike": "Urshifu (Single Strike)",
  "urshifu-rapid-strike": "Urshifu (Rapid Strike)",
  "zamazenta-crowned": "Zamazenta (Crowned)",
  "zacian-crowned": "Zacian (Crowned)",
  "giratina-origin": "Giratina (Origin)",
  "darmanitan-standard": "Darmanitan",
  "darmanitan-zen": "Darmanitan (Zen)",
  "tapu-koko": "Tapu Koko",
  "tapu-lele": "Tapu Lele",
  "tapu-bulu": "Tapu Bulu",
  "tapu-fini": "Tapu Fini",
  "farfetchd": "Farfetch’d",
  "sirfetchd": "Sirfetch’d",
  "nidoran-f": "Nidoran♀",
  "nidoran-m": "Nidoran♂",
  "flabebe": "Flabébé"
};

export function formatPokemonName(name: string): string {
  if (localNameMap[name]) return localNameMap[name];
  return name
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
