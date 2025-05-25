export type EvolutionNode = {
    id: number;
    name: string;
    sprite: string;
    evolves_to: EvolutionNode[];
};
