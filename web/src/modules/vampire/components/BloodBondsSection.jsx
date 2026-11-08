import React, { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import CatalogText from '../../../core/content/CatalogText';
import SiteText from '../../../core/content/SiteText';
import { siteText, useSiteContent } from '../../../core/content/store';
import { apiFetch } from '../../../core/api';
import { API_URL } from '../../../config';

// Rendu d'une ligne (fonction simple, pas un composant : un composant par fichier).
function renderBond(bond, name, npc, details) {
  return (
    <li key={bond.id} className="bg-stone-900/40 border border-stone-800 rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-serif text-stone-200 break-words min-w-0">
          {name}
          {npc && (
            <span className="ml-2 text-[10px] uppercase tracking-wider text-stone-500"><SiteText contentKey="vampire.bonds.npc" /></span>
          )}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-red-300 bg-red-900/30 border border-red-800 rounded px-2 py-0.5">
          {siteText('vampire.bonds.stage', { v0: bond.stage })}
        </span>
      </div>
      {details}
    </li>
  );
}

export default function BloodBondsSection({ discordUserId, guildId }) {
  useSiteContent();
  const [state, setState] = useState({ status: 'loading', boundTo: [], drankFromMe: [], error: null });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await apiFetch(`${API_URL}/api/vampire/bonds`, {
          headers: { 'X-Discord-User-ID': discordUserId, 'X-Discord-Guild-ID': guildId },
        });
        const data = await response.json();
        if (cancelled) return;
        if (data.success) {
          setState({ status: 'ready', boundTo: data.bound_to || [], drankFromMe: data.drank_from_me || [], error: null });
        } else {
          setState({ status: 'error', boundTo: [], drankFromMe: [], error: data.error || '' });
        }
      } catch (err) {
        if (!cancelled) setState({ status: 'error', boundTo: [], drankFromMe: [], error: err.message || '' });
      }
    })();
    return () => { cancelled = true; };
  }, [discordUserId, guildId]);

  const { status, boundTo, drankFromMe, error } = state;
  const empty = status === 'ready' && boundTo.length === 0 && drankFromMe.length === 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-red-600 flex-shrink-0">
          <Link2 size={20} />
        </div>
        <h2 className="text-xl font-serif text-stone-200"><SiteText contentKey="vampire.bonds.title" /></h2>
      </div>

      {status === 'loading' && (
        <p className="text-sm text-stone-500 italic"><SiteText contentKey="vampire.bonds.loading" /></p>
      )}

      {status === 'error' && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded text-sm">
          <CatalogText scope="vampire" value={error} />
        </div>
      )}

      {empty && (
        <p className="text-sm text-stone-500 italic"><SiteText contentKey="vampire.bonds.empty" /></p>
      )}

      {boundTo.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs text-stone-500 uppercase tracking-wider"><SiteText contentKey="vampire.bonds.boundTo" /></h3>
          <ul className="space-y-2">
            {boundTo.map((bond) => renderBond(bond, bond.regnant_name, bond.regnant_kind === 'npc', (
              <>
                <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                  {siteText(`vampire.bonds.stage${bond.stage}`, { v0: bond.regnant_name })}
                </p>
                {bond.stage === 3 && (
                  <p className="text-xs text-red-300/80 mt-2">
                    {siteText('vampire.bonds.defy', { v0: bond.regnant_name, v1: bond.defy_cost })}
                  </p>
                )}
              </>
            )))}
          </ul>
        </div>
      )}

      {drankFromMe.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs text-stone-500 uppercase tracking-wider"><SiteText contentKey="vampire.bonds.drankFromMe" /></h3>
          <ul className="space-y-2">
            {drankFromMe.map((bond) => renderBond(bond, bond.thrall_name, false, null))}
          </ul>
        </div>
      )}
    </section>
  );
}
