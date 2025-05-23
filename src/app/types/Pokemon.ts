
export type Pokemon = {
  id: number;
  rawName: string;
  name: string;
  images: {
    official: string;
    home: string;
    sprite: string;
  };
  types: string[];
  abilities: string[];
};
