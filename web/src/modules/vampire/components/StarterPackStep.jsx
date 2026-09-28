import { getOriginQuestions } from '../../../data/originQuestions';

export default function StarterPackStep({ selectedClan, answers, onAnswerChange }) {
  const questions = answers.questions || getOriginQuestions(selectedClan.id);
  return <section className="space-y-5 text-stone-200 mt-6 bg-stone-900/50 p-3 sm:p-6 rounded border border-stone-800">
    <h3 className="text-xl font-serif">L’Éveil de votre Sang</h3>
    <p className="text-sm">Votre clan propose une tension, pas un destin imposé. Aucun acte violent ni âge précis n’est obligatoire. Répondez à votre manière ; les noms et les détails de la ville peuvent être définis avec le MJ.</p>
    {questions.map((question,index) => <div key={index}>
      <label htmlFor={`origin-q${index+1}`} className="block mb-2">{question}</label>
      <textarea id={`origin-q${index+1}`} value={answers[`q${index+1}`] || ''} onChange={e=>onAnswerChange(`q${index+1}`,e.target.value)} minLength={10} maxLength={6000} rows={5} className="w-full bg-stone-950 border border-stone-700 rounded p-3"/>
      <p className="text-xs">{(answers[`q${index+1}`] || '').trim().length} caractères — minimum 10</p>
    </div>)}
  </section>;
}
