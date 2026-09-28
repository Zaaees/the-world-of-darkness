import { useSiteContent, siteText, definitions, openContentEditor } from './store';

export default function SiteText({ contentKey, variables }) {
  const { editing, editableScopes } = useSiteContent();
  const text = siteText(contentKey, variables);
  if (!editing || !editableScopes.includes(definitions[contentKey]?.scope)) return text;
  // No extra DOM in ordinary player mode. The capture handler prevents game actions.
  return <span data-site-content-key={contentKey} tabIndex={0} role="button" aria-label={`Modifier : ${text}`}
    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); openContentEditor(contentKey); } }}
    className="outline outline-1 outline-dashed outline-amber-500/60 cursor-text"
    onClick={event => { event.preventDefault(); event.stopPropagation(); openContentEditor(contentKey); }}>{text}</span>;
}
