import CatalogText from '../../../core/content/CatalogText';
// site-content: migrated
import { siteText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import { useEffect, useRef, useState } from 'react';

export default function SceneSubmission({ action, onClose, onSubmit }) {
    useSiteContent();
  const dialog = useRef(null);
  const [values, setValues] = useState({ sceneLink: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.querySelector('input')?.focus();
    return () => previous?.focus();
  }, []);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try { await onSubmit(values); onClose(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const keys = e => {
    if (e.key === 'Escape' && !busy) onClose();
    if (e.key !== 'Tab') return;
    const items = [...dialog.current.querySelectorAll('input,textarea,button:not(:disabled)')];
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  return <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <section ref={dialog} role="dialog" aria-modal="true" aria-labelledby="scene-title" onKeyDown={keys} className="bg-stone-950 border border-stone-700 rounded p-5 w-full max-w-xl max-h-[90vh] overflow-y-auto">
      <h2 id="scene-title" className="text-xl font-serif"><SiteText contentKey="vampire.text.01472" /><CatalogText scope={"vampire"} value={action.name} /></h2>
      <form onSubmit={submit} className="space-y-4 mt-3">
        <div>
          <label htmlFor="scene-sceneLink" className="block mb-1"><CatalogText scope="vampire" value="Lien de la scène Discord" /></label>
          <input id="scene-sceneLink" type="url" required value={values.sceneLink} onChange={e => setValues({ sceneLink: e.target.value })} className="w-full bg-stone-900 rounded p-2" />
        </div>
        {error && <p role="alert" className="text-red-300"><CatalogText scope={"vampire"} value={error} /></p>}
        <div className="flex gap-3"><button type="button" disabled={busy} onClick={onClose} className="border rounded px-4 py-2"><SiteText contentKey="vampire.text.01474" /></button><button disabled={busy} className="bg-red-900 rounded px-4 py-2">{busy?siteText("vampire.text.01475"):siteText("vampire.text.01476")}</button></div>
      </form>
    </section>
  </div>;
}
