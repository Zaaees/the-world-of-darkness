import React from 'react';
import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import RulesTab from './RulesTab';

describe('Règlement : Lien de sang', () => {
  it("décrit le Lien de sang dans la section Alimentation", () => {
    const {container} = render(<RulesTab setActiveTab={() => {}} />);
    const section = container.querySelector('#hunting');
    const text = section.textContent;
    expect(text).toContain('Le Lien de sang');
    expect(text).toContain("Boire le sang d'un vampire, c'est commencer à l'aimer.");
    expect(text).toContain('Chaque gorgée resserre le lien d\'un cran ; à la troisième, vous êtes lié');
    expect(text).toContain('Offrir mon sang');
    expect(text).toContain('Défier le lien');
    expect(text).toContain("Lié, vous n'avez qu'un maître : aucun autre sang");
    expect(text).toContain('Note : une goule de sang est liée au troisième stade dès sa création');
    expect(text).toContain('Au Zénith, boire un autre vampire vous nourrit sans vous lier.');
  });
});
