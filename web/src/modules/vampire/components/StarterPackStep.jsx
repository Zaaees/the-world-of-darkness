// site-content: migrated
import { useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import { getOriginQuestionEntries } from '../../../data/originQuestions';

export default function StarterPackStep({ selectedClan, answers, onAnswerChange }) {
    useSiteContent();
  const questions = getOriginQuestionEntries(selectedClan.id);
  return <section className="space-y-5 text-stone-200 mt-6 bg-stone-900/50 p-3 sm:p-6 rounded border border-stone-800">
    <h3 className="text-xl font-serif"><SiteText contentKey="vampire.text.01478" /></h3>
    <p className="text-sm"><SiteText contentKey="vampire.text.01479" /></p>
    {questions.map((question,index) => <div key={index}>
      <label htmlFor={`origin-q${index+1}`} className="block mb-2"><SiteText {...question} /></label>
      <textarea id={`origin-q${index+1}`} value={answers[`q${index+1}`] || ''} onChange={e=>onAnswerChange(`q${index+1}`,e.target.value)} minLength={10} maxLength={6000} rows={5} className="w-full bg-stone-950 border border-stone-700 rounded p-3"/>
      <p className="text-xs">{(answers[`q${index+1}`] || '').trim().length}<SiteText contentKey="vampire.text.01480" /></p>
    </div>)}
  </section>;
}
