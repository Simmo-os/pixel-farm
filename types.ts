export enum AnimalType {
  Chicken = 'CHICKEN',
  Crane = 'CRANE',
  Ant = 'ANT',
  Rabbit = 'RABBIT',
  Turtle = 'TURTLE',
  Spider = 'SPIDER',
  Dog = 'DOG'
}

export interface GridItem {
  id: string;
  type: AnimalType;
  x: number;
  y: number;
  variant: number; // For slight visual variation if needed
}

export interface GenerationState {
  chickens: number;
  rabbits: number;
}
