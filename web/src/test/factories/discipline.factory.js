import { faker } from '@faker-js/faker';

export const createPower = (overrides = {}) => ({
    level: faker.number.int({ min: 1, max: 10 }),
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    bloodCost: faker.number.int({ min: 0, max: 5 }),
    duration: faker.helpers.arrayElement(['instant', 'scene', 'passive']),
    ...overrides,
});

export const createDiscipline = (overrides = {}) => {
    const powerCount = overrides.powerCount || 5;
    const powers = Array.from({ length: powerCount }, (_, i) =>
        createPower({ level: i + 1 })
    );

    return {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        powers,
        maxLevel: overrides.maxLevel || 5,
        ...overrides,
    };
};
