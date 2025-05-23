export type Pokemon = {
  id: number;
  name: string;
  rawName: string; // if you want to keep that
  images: {
    sprite: string | null;
    home: string | null;
    official: string | null;
  };
  types: string[];
  abilities: string[];
  height: number; // decimeters
  weight: number; // hectograms
  stats: {
    name: string;
    base_stat: number;
  }[];
  moves: {
    name: string;
    level_learned_at: number;
    move_learn_method: string;
  }[];
};
