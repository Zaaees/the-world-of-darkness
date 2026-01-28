import { faker } from '@faker-js/faker';

export interface Gift {
    id: string;
    name_fr: string;
    tribe: string;
    level: number;
    description: string;
    gnosis_cost: number;
    system: string;
}

export const createGift = (overrides: Partial<Gift> = {}): Gift => {
    return {
        id: `gift_${faker.string.uuid()}`,
        name_fr: `Don de ${faker.word.noun()}`,
        tribe: faker.helpers.arrayElement(['Furies Noires', 'Griffes Rouges', 'Arpenteurs Silencieux']),
        level: faker.number.int({ min: 1, max: 5 }),
        description: faker.lorem.sentence(),
        gnosis_cost: faker.number.int({ min: 1, max: 10 }),
        system: faker.lorem.paragraph(),
        ...overrides,
    };
};
