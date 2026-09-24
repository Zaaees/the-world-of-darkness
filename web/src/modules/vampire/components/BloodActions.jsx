import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, RefreshCw, Check } from 'lucide-react';
import { getActionPoints, isActionVisible, isActionCompleted } from '../../../data/bloodActions';

export function ActionButton({ action, isDisabled, isPending, isCompleted, isSubmitting, onSubmit }) {
  const terminal = action.points === 0;
  const disabled = isDisabled || terminal || isPending || isCompleted || isSubmitting;
  return (
    <article className="vp-action p-4 rounded border border-stone-800 bg-stone-900/60">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-serif text-base text-stone-200">{action.name}</h4>
        <span className="shrink-0 text-red-400 font-mono text-sm">{terminal ? 'Héritage' : `+${action.points}`}</span>
      </div>
      <p className="text-sm leading-relaxed text-stone-400 mt-2">{action.description}</p>
      <details className="mt-3 text-sm text-stone-400">
        <summary className="cursor-pointer text-stone-300 focus-visible:outline focus-visible:outline-red-500">Pistes pour votre récit</summary>
        <ul className="list-disc pl-5 mt-3 space-y-2">{action.hints.map(hint => <li key={hint}>{hint}</li>)}</ul>
      </details>
      {!terminal && <button type="button" disabled={disabled} onClick={() => onSubmit(action)}
        className="mt-4 inline-flex items-center gap-2 rounded border border-red-900 px-3 py-2 text-sm text-stone-200 hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-red-500">
        {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : isCompleted ? <Check size={14} /> : isPending ? <Clock size={14} /> : null}
        {isSubmitting ? 'Envoi en cours…' : isCompleted ? 'Accompli' : isPending ? 'En attente du MJ' : 'Soumettre au MJ'}
      </button>}
    </article>
  );
}

export function ActionCategory({ category, character, completedActions = [], pendingActions = [], submittingAction, onSubmitAction }) {
  const [isOpen, setIsOpen] = useState(false);
  const level = character.bloodPotency || 1;
  const actions = category.actions.filter(action => isActionVisible(action, level) && !isActionCompleted(action, completedActions));
  if (!actions.length) return null;
  const Icon = category.icon;
  return <section className="vp-action-category mb-6">
    <button type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-3 py-2 text-left">
      <Icon size={20} className="text-red-500 shrink-0" />
      <span className="flex-1"><span className="block font-serif text-stone-200">{category.name}</span><span className="text-xs text-stone-400">{category.description}</span></span>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && <div className="mt-3 space-y-3">{actions.map(action => <ActionButton key={action.id}
      action={{ ...action, points: getActionPoints(action, level) }} isDisabled={level >= 5}
      isPending={pendingActions.some(pending => (typeof pending === 'string' ? pending : pending.action_id) === action.id)}
      isCompleted={false} isSubmitting={submittingAction === action.id} onSubmit={onSubmitAction} />)}</div>}
  </section>;
}
