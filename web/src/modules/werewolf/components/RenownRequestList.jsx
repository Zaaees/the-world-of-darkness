// site-content: migrated
import { displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import React from 'react';
import { translate } from '../utils/translations';

/**
 * Composant de liste des demandes de renommée.
 * Affiche un tableau des demandes avec actions de validation/rejet.
 * 
 * @param {Object} props
 * @param {Array} props.requests - Liste des demandes
 * @param {Function} props.onValidate - Handler validation (id)
 * @param {Function} props.onReject - Handler rejet (id)
 */
export default function RenownRequestList({ requests, onValidate, onReject }) {
    useSiteContent();
    if (!requests || requests.length === 0) {
        return (
            <div data-testid="mj-dashboard-empty" className="p-8 text-center text-amber-200/50 bg-stone-900/50 rounded-lg border border-amber-900/30">
                <p><SiteText contentKey="werewolf.text.01656" /></p>
                <p className="text-sm mt-2"><SiteText contentKey="werewolf.text.01657" /></p>
            </div>
        );
    }

    return (
        <div data-testid="renown-request-list" className="overflow-x-auto rounded-lg border border-amber-900/40 bg-black/60 backdrop-blur-sm">
            <table className="w-full text-left text-sm text-stone-300">
                <thead className="bg-amber-950/40 text-amber-100 uppercase text-xs font-serif tracking-wider">
                    <tr>
                        <th className="px-6 py-3"><SiteText contentKey="werewolf.text.01658" /></th>
                        <th className="px-6 py-3"><SiteText contentKey="werewolf.text.01659" /></th>
                        <th className="px-6 py-3"><SiteText contentKey="werewolf.text.01660" /></th>
                        <th className="px-6 py-3"><SiteText contentKey="werewolf.text.01661" /></th>
                        <th className="px-6 py-3 text-right"><SiteText contentKey="werewolf.text.01662" /></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/20">
                    {requests.map((req) => (
                        <tr key={req.id} data-testid={`renown-request-item-${req.id}`} className="hover:bg-amber-900/10 transition-colors">
                            <td className="px-6 py-4 font-medium text-amber-50">
                                {req.user_name || req.user_id}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-lg font-serif text-amber-500">{displayText("werewolf", req.title)}</div>
                                <div className="text-xs text-stone-500 mt-1 line-clamp-2" title={displayText("werewolf", req.description)}>
                                    {displayText("werewolf", req.description)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {(() => {
                                    const typeMap = {
                                        glory: { label: 'Gloire', classes: 'text-amber-300 border-amber-600/50 bg-amber-900/20' },
                                        honor: { label: 'Honneur', classes: 'text-rose-300 border-rose-600/50 bg-rose-900/20' },
                                        wisdom: { label: 'Sagesse', classes: 'text-indigo-300 border-indigo-600/50 bg-indigo-900/20' }
                                    };
                                    const typeKey = req.renown_type?.toLowerCase();
                                    const conf = typeMap[typeKey] || typeMap.glory;

                                    return (
                                        <span className={`inline-flex px-2 py-0.5 rounded border text-xs font-serif uppercase tracking-wider ${conf.classes}`}>
                                            {displayText("werewolf", translate('renown', typeKey))}
                                        </span>
                                    );
                                })()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-stone-400">
                                {new Date(req.submitted_at).toLocaleDateString('fr-FR', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                })}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                <button
                                    data-testid={`val-btn-${req.id}`}
                                    onClick={() => onValidate(req.id)}
                                    className="px-3 py-1 bg-green-900/50 hover:bg-green-800 text-green-200 border border-green-800/50 rounded transition-colors text-xs uppercase tracking-wide font-bold"
                                ><SiteText contentKey="werewolf.text.01663" /></button>
                                <button
                                    data-testid={`rej-btn-${req.id}`}
                                    onClick={() => onReject(req.id)}
                                    className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-800/50 rounded transition-colors text-xs uppercase tracking-wide font-bold"
                                ><SiteText contentKey="werewolf.text.01664" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
