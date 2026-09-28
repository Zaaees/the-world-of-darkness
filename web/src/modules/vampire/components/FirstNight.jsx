export default function FirstNight({ setActiveTab }) {
  return <section className="border border-stone-700 rounded p-5 space-y-3" aria-labelledby="first-night-title">
    <h2 id="first-night-title" className="font-serif text-2xl">Votre première nuit</h2>
    <p>Définissez un désir, une attache et une limite sur votre fiche. Convenez avec un partenaire du lieu, du rythme de réponse et des limites de la scène.</p>
    <ol className="list-decimal pl-5 space-y-2">
      <li>Présentez votre personnage dans <strong>Tabulae</strong> et contactez un MJ Vampire si vous cherchez un partenaire.</li>
      <li>Ouvrez <code>/vampire</code> sur Discord pour consulter votre réserve de sang. Les dépenses se font dans ce panneau.</li>
      <li>Choisissez une entrée en jeu : négocier une permission de chasse, retrouver un contact mortel ou répondre à une dette de votre Sire. Décidez ensemble de l’obstacle et laissez l’issue ouverte.</li>
      <li>Pour une chasse, annoncez votre scène dans <strong>Venatio</strong>. Après la scène, notez ce qui a changé et conservez son lien si vous demandez une récompense.</li>
    </ol>
    <button type="button" className="border border-stone-600 rounded px-4 py-2" onClick={() => setActiveTab('rules')}>Lire les règles de scène et de consentement</button>
  </section>;
}
