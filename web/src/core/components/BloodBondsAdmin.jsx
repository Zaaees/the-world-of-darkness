import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { displayText, siteText, useSiteContent } from '../content/store';
import SiteText from '../content/SiteText';
import { apiFetch } from '../api';
import { API_URL } from '../../config';

const STAGES = [1, 2, 3];
const RANKS = [1, 2, 3, 4, 5];
const FIELD = 'w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 focus:border-red-800 focus:outline-none';
const LABEL = 'block text-xs font-serif uppercase tracking-widest text-stone-500 mb-1';

export default function BloodBondsAdmin({ discordUser, guildId }) {
    useSiteContent();
    const [data, setData] = useState({ bonds: [], vampires: [], npcs: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [thrallId, setThrallId] = useState('');
    const [mode, setMode] = useState('registry'); // 'registry' | 'free'
    const [npcId, setNpcId] = useState('');
    const [npcName, setNpcName] = useState('');
    const [potency, setPotency] = useState(1);
    const [stage, setStage] = useState(1);

    const headers = useCallback((extra = {}) => ({
        ...extra,
        'X-Discord-User-ID': discordUser.id,
        'X-Discord-Guild-ID': guildId.toString(),
    }), [discordUser, guildId]);

    const load = useCallback(async () => {
        if (!discordUser || !guildId) return;
        setLoading(true);
        try {
            const response = await apiFetch(`${API_URL}/api/gm/bonds`, { headers: headers() });
            const body = await response.json();
            if (body.success) {
                setData({ bonds: body.bonds || [], vampires: body.vampires || [], npcs: body.npcs || [] });
            } else {
                setError(body.error);
            }
        } catch (err) {
            console.error(err);
            setError(siteText('vampire.bonds.admin.loadError'));
        } finally {
            setLoading(false);
        }
    }, [discordUser, guildId, headers]);

    useEffect(() => { load(); }, [load]);

    // Envoie une écriture, puis recharge la liste (ou affiche l'erreur du serveur).
    const send = async (path, method, payload) => {
        setSaving(true);
        try {
            const response = await apiFetch(`${API_URL}/api/gm/bonds${path}`, {
                method,
                headers: headers(payload ? { 'Content-Type': 'application/json' } : {}),
                ...(payload ? { body: JSON.stringify(payload) } : {}),
            });
            const body = await response.json();
            if (!body.success) {
                setError(body.error);
                return false;
            }
            setError(null);
            await load();
            return true;
        } catch (err) {
            console.error(err);
            setError(siteText('vampire.bonds.admin.loadError'));
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async id => {
        if (!window.confirm(siteText('vampire.bonds.admin.confirmDelete'))) return;
        await send(`/${id}`, 'DELETE');
    };

    const handleCreate = async e => {
        e.preventDefault();
        if (!thrallId) return;
        const payload = mode === 'registry'
            ? { thrallId, npcId, stage }
            : { thrallId, npcName: npcName.trim(), potency, stage };
        if (mode === 'registry' ? !npcId : !payload.npcName) return;
        if (await send('', 'POST', payload)) {
            setNpcId('');
            setNpcName('');
        }
    };

    const stageOptions = STAGES.map(s => (
        <option key={s} value={s}>{siteText('vampire.bonds.stage', { v0: s })}</option>
    ));

    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded flex justify-between items-center gap-3">
                    <span className="min-w-0 break-words">{displayText('vampire', error)}</span>
                    <button type="button" onClick={() => setError(null)} className="text-red-400 hover:text-red-200"><SiteText contentKey="vampire.text.00014" /></button>
                </div>
            )}

            {data.bonds.length === 0 ? (
                <div className="text-center py-12 border border-stone-800 border-dashed rounded bg-stone-900/20 text-stone-500">
                    {loading ? <SiteText contentKey="vampire.bonds.loading" /> : <SiteText contentKey="vampire.bonds.admin.empty" />}
                </div>
            ) : (
                <ul className="space-y-3">
                    {data.bonds.map(bond => (
                        <li key={bond.id} className="bg-stone-900/40 border border-stone-800 rounded p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="min-w-0 break-words font-serif text-stone-200">
                                <span>{bond.thrall_name}</span>
                                <span className="mx-2 text-stone-600">→</span>
                                <span>{bond.regnant_name}</span>
                                <span className="ml-2 text-[10px] uppercase tracking-wider text-stone-500">
                                    {bond.regnant_kind === 'npc'
                                        ? <SiteText contentKey="vampire.bonds.npc" />
                                        : <SiteText contentKey="vampire.bonds.admin.player" />}
                                </span>
                                <span className="ml-2 text-xs text-stone-500">
                                    {siteText('vampire.bonds.admin.rank', { v0: bond.regnant_potency })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor={`bond-stage-${bond.id}`} className="sr-only"><SiteText contentKey="vampire.bonds.admin.stageLabel" /></label>
                                <select
                                    id={`bond-stage-${bond.id}`}
                                    value={bond.stage}
                                    disabled={saving}
                                    onChange={e => send(`/${bond.id}`, 'PUT', { stage: parseInt(e.target.value, 10) })}
                                    className="bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 focus:border-red-800 focus:outline-none"
                                >
                                    {stageOptions}
                                </select>
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => handleDelete(bond.id)}
                                    className="flex items-center gap-1 px-3 py-2 rounded border border-stone-700 text-stone-400 hover:text-red-400 hover:border-red-900 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={14} /><SiteText contentKey="vampire.bonds.admin.delete" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleCreate} className="bg-stone-900/30 border border-stone-800 rounded p-4 sm:p-6 max-w-lg mx-auto">
                <h3 className="text-xl font-serif text-stone-200 mb-6 border-b border-stone-800 pb-2"><SiteText contentKey="vampire.bonds.admin.formTitle" /></h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="bond-thrall" className={LABEL}><SiteText contentKey="vampire.bonds.admin.thrall" /></label>
                        <select id="bond-thrall" value={thrallId} onChange={e => setThrallId(e.target.value)} className={FIELD} required>
                            <option value="">{siteText('vampire.bonds.admin.choose')}</option>
                            {data.vampires.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-stone-300">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="bond-mode" checked={mode === 'registry'} onChange={() => setMode('registry')} />
                            <SiteText contentKey="vampire.bonds.admin.fromRegistry" />
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="bond-mode" checked={mode === 'free'} onChange={() => setMode('free')} />
                            <SiteText contentKey="vampire.bonds.admin.freeName" />
                        </label>
                    </div>

                    {mode === 'registry' ? (
                        <select aria-label={siteText('vampire.bonds.admin.fromRegistry')} value={npcId} onChange={e => setNpcId(e.target.value)} className={FIELD} required>
                            <option value="">{siteText('vampire.bonds.admin.choose')}</option>
                            {data.npcs.map(n => (
                                <option key={n.id} value={n.id}>{n.name} ({siteText('vampire.bonds.admin.rank', { v0: n.blood_potency })})</option>
                            ))}
                        </select>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="bond-npc-name" className={LABEL}><SiteText contentKey="vampire.bonds.admin.npcName" /></label>
                                <input id="bond-npc-name" type="text" value={npcName} onChange={e => setNpcName(e.target.value)} className={FIELD} required />
                            </div>
                            <div>
                                <label htmlFor="bond-potency" className={LABEL}><SiteText contentKey="vampire.bonds.admin.potency" /></label>
                                <select id="bond-potency" value={potency} onChange={e => setPotency(parseInt(e.target.value, 10))} className={FIELD}>
                                    {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="bond-new-stage" className={LABEL}><SiteText contentKey="vampire.bonds.admin.stageLabel" /></label>
                        <select id="bond-new-stage" value={stage} onChange={e => setStage(parseInt(e.target.value, 10))} className={FIELD}>
                            {stageOptions}
                        </select>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button type="submit" disabled={saving} className="px-6 py-2 rounded bg-red-900 hover:bg-red-800 text-white font-serif tracking-wider transition-colors disabled:opacity-50">
                            <SiteText contentKey="vampire.bonds.admin.submit" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
