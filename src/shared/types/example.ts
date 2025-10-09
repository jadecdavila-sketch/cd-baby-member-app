export type ExampleCharacter = {
  id: number;
  name: {
    first: string;
    middle: string;
    last: string;
  };
  images: {
    main: string;
  };
  gender: string;
  species: string;
  occupation: string;
  sayings: string[];
  homePlanet: string;
  age: string;
};

export type ExampleCharactersList = ExampleCharacter[];

export type ExampleCharacterUpdate = {
  id: number;
  data: Partial<Omit<ExampleCharacter, 'id'>>;
};
