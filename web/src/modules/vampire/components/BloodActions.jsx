import CatalogText from '../../../core/content/CatalogText';
// site-content: migrated
import { siteText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, RefreshCw, Check } from 'lucide-react';
import { getActionPoints, isActionVisible, isActionCompleted } from '../../../data/bloodActions';

export function ActionButton({ action, isDisabled, isPending, isCompleted, isSubmitting, onSubmit }) {
    useSiteContent();
  const terminal = action.points === 0;
  const disabled = isDisabled || terminal || isPending || isCompleted || isSubmitting;
  return (
    <article className="vp-action p-4 rounded border border-stone-800 bg-stone-900/60">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-serif text-base text-stone-200"><CatalogText scope={"vampire"} value={action.name} /></h4>
        <span className="shrink-0 text-red-400 font-mono text-sm">{terminal ? siteText("vampire.text.01199") : `+${action.points}`}</span>
      </div>
      <p className="text-sm leading-relaxed text-stone-400 mt-2"><CatalogText scope={"vampire"} value={action.description} /></p>
      <details className="mt-3 text-sm text-stone-400">
        <summary className="cursor-pointer text-stone-300 focus-visible:outline focus-visible:outline-red-500"><SiteText contentKey="vampire.text.01200" /></summary>
        <ul className="list-disc pl-5 mt-3 space-y-2">{action.hints.map(hint => <li key={hint}><CatalogText scope={"vampire"} value={hint} /></li>)}</ul>
      </details>
      {!terminal && <button type="button" disabled={disabled} onClick={() => onSubmit(action)}
        className="mt-4 inline-flex items-center gap-2 rounded border border-red-900 px-3 py-2 text-sm text-stone-200 hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-red-500">
        {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : isCompleted ? <Check size={14} /> : isPending ? <Clock size={14} /> : null}
        {isSubmitting ? siteText("vampire.text.01201") : isCompleted ? siteText("vampire.text.01202") : isPending ? siteText("vampire.text.01203") : siteText("vampire.text.01204")}
      </button>}
    </article>
  );
}

export function ActionCategory({ category, character, completedActions = [], pendingActions = [], submittingAction, onSubmitAction }) {
    useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const level = character.bloodPotency || 1;
  const actions = category.actions.filter(action => isActionVisible(action, level) && !isActionCompleted(action, completedActions));
  if (!actions.length) return null;
  const Icon = category.icon;
  return <section className="vp-action-category mb-6">
    <button type="button" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-3 py-2 text-left">
      <Icon size={20} className="text-red-500 shrink-0" />
      <span className="flex-1"><span className="block font-serif text-stone-200"><CatalogText scope={"vampire"} value={category.name} /></span><span className="text-xs text-stone-400"><CatalogText scope={"vampire"} value={category.description} /></span></span>
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && <div className="mt-3 space-y-3">
      {category.warning && <aside className="rounded border border-amber-800 bg-amber-950/30 p-3 text-sm leading-relaxed text-amber-200"><CatalogText scope="vampire" value={category.warning} /></aside>}
      {actions.map(action => <ActionButton key={action.id}
      action={{ ...action, points: getActionPoints(action, level) }} isDisabled={level >= 5}
      isPending={pendingActions.some(pending => (typeof pending === 'string' ? pending : pending.action_id) === action.id)}
      isCompleted={false} isSubmitting={submittingAction === action.id} onSubmit={onSubmitAction} />)}</div>}
  </section>;
}
