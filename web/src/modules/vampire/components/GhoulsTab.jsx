// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X, Droplet, Shield, AlertCircle } from 'lucide-react';

import ghoulCatalog from '../../../../../data/ghoul_disciplines.json';
const GHOUL_LIMITS = ghoulCatalog.limits;
const CLAN_DISCIPLINES = { ...ghoulCatalog.clans, setites: ghoulCatalog.clans.setite, assamites: ghoulCatalog.clans.banu_haqim };

export default function GhoulsTab({ ghouls = [], clan, bloodPotency, onUpdateGhouls }) {
    useSiteContent();
  const [editingGhoul, setEditingGhoul] = useState(null);
  const [creatingGhoul, setCreatingGhoul] = useState(false);
  const [newGhoul, setNewGhoul] = useState({ name: '', description: '', role: '', type: 'blood' }); // type: 'blood' | 'mind'
  const [error, setError] = useState(null);

  const maxGhouls = GHOUL_LIMITS[bloodPotency] || 2;

  // Compter uniquement les goules de sang pour la limite
  const bloodGhoulsCount = ghouls.filter(g => !g.type || g.type === 'blood').length;
  const mindGhoulsCount = ghouls.filter(g => g.type === 'mind').length;

  // Vérifier si le personnage peut créer des goules de l'esprit
  // Condition: BP >= 4 ET possède Domination dans son clan
  const clanDisciplines = CLAN_DISCIPLINES[clan?.toLowerCase()] || [];
  const hasDominate = clanDisciplines.includes('Domination');
  const canCreateMindGhouls = bloodPotency >= 4 && hasDominate;

  // Peut créer une goule si:
  // 1. N'a pas atteint la limite de goules de sang
  // 2. OU peut créer des goules de l'esprit
  const canCreate = bloodGhoulsCount < maxGhouls || canCreateMindGhouls;

  const createGhoul = async () => {
    if (!newGhoul.name.trim()) {
      setError(siteText("vampire.text.01277"));
      return;
    }

    if (newGhoul.type === 'blood' && bloodGhoulsCount >= maxGhouls) {
      setError(siteText("vampire.text.01278"));
      return;
    }

    let ghoulData = {
      id: `ghoul_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newGhoul.name.trim(),
      description: newGhoul.description.trim() || null,
      role: newGhoul.role.trim() || null,
      status: 'actif',
      notes: '',
      created_at: Date.now(),
      type: newGhoul.type || 'blood'
    };

    try { await onUpdateGhouls([...ghouls, ghoulData]); }
    catch (err) { setError(err.message || siteText("vampire.text.02561")); return; }
    setCreatingGhoul(false);
    setNewGhoul({ name: '', description: '', role: '', type: 'blood' });
    setError(null);
  };

  const updateGhoul = async (updatedGhoul) => {
    const updated = ghouls.map(g => g.id === updatedGhoul.id ? updatedGhoul : g);
    try { await onUpdateGhouls(updated); }
    catch (err) { setError(err.message || siteText("vampire.text.02561")); return; }
    setEditingGhoul(null);
    setError(null);
  };

  const deleteGhoul = async (ghoulId) => {
    if (!confirm(siteText("vampire.text.02562"))) {
      return;
    }
    const updated = ghouls.filter(g => g.id !== ghoulId);
    try { await onUpdateGhouls(updated); }
    catch (err) { setError(err.message || siteText("vampire.text.02561")); return; }
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header avec compteur */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-red-600">
            <Users size={20} />
          </div>
          <div>
            <h2 className="text-xl font-serif text-stone-200"><SiteText contentKey="vampire.text.01279" /></h2>
            <div className="flex gap-3 text-xs text-stone-500">
              <p><SiteText contentKey="vampire.text.01280" />{bloodGhoulsCount} / {maxGhouls}</p>
              {mindGhoulsCount > 0 && (
                <p className="text-purple-400"><SiteText contentKey="vampire.text.01281" />{mindGhoulsCount}</p>
              )}
            </div>
          </div>
        </div>

        {canCreate && !creatingGhoul && (
          <button
            onClick={() => setCreatingGhoul(true)}
            className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-300 px-4 py-2 rounded transition-colors"
          >
            <Plus size={16} /><SiteText contentKey="vampire.text.01282" /></button>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium"><SiteText contentKey="vampire.text.01283" /></p>
            <p className="text-sm">{displayText("vampire", error)}</p>
          </div>
        </div>
      )}

      {/* Formulaire de création */}
      {creatingGhoul && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-stone-200"><SiteText contentKey="vampire.text.01284" /></h3>
            <button
              onClick={() => {
                setCreatingGhoul(false);
                setNewGhoul({ name: '', description: '', role: '', type: 'blood' });
                setError(null);
              }}
              className="text-stone-500 hover:text-stone-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sélection du Type de Goule (disponible seulement si éligible aux Mind Ghouls) */}
          {canCreateMindGhouls && (
            <div className="flex gap-4 mb-4 p-3 bg-stone-950/50 rounded border border-stone-800">
              <label className={`flex items-center gap-2 cursor-pointer ${bloodGhoulsCount >= maxGhouls ? 'opacity-50' : ''}`}>
                <input
                  type="radio"
                  name="ghoulType"
                  value="blood"
                  checked={newGhoul.type === 'blood'}
                  onChange={() => setNewGhoul({ ...newGhoul, type: 'blood' })}
                  disabled={bloodGhoulsCount >= maxGhouls}
                  className="text-red-600 focus:ring-red-900"
                />
                <div>
                  <span className="block text-stone-200 font-medium"><SiteText contentKey="vampire.text.01285" /></span>
                  <span className="text-xs text-stone-500"><SiteText contentKey="vampire.text.01286" /></span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ghoulType"
                  value="mind"
                  checked={newGhoul.type === 'mind'}
                  onChange={() => setNewGhoul({ ...newGhoul, type: 'mind' })}
                  className="text-purple-600 focus:ring-purple-900"
                />
                <div>
                  <span className="block text-stone-200 font-medium"><SiteText contentKey="vampire.text.01287" /></span>
                  <span className="text-xs text-stone-500"><SiteText contentKey="vampire.text.01288" /></span>
                </div>
              </label>
            </div>
          )}

          <div>
            <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01289" /></label>
            <input
              type="text"
              value={newGhoul.name}
              onChange={(e) => setNewGhoul({ ...newGhoul, name: e.target.value })}
              placeholder={newGhoul.type === 'mind' ? siteText("vampire.text.01290") : siteText("vampire.text.01291")}
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 placeholder-stone-700 focus:border-red-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01292" /></label>
            <input
              type="text"
              value={newGhoul.role}
              onChange={(e) => setNewGhoul({ ...newGhoul, role: e.target.value })}
              placeholder={siteText("vampire.text.01293")}
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 placeholder-stone-700 focus:border-red-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01294" /></label>
            <textarea
              value={newGhoul.description}
              onChange={(e) => setNewGhoul({ ...newGhoul, description: e.target.value })}
              placeholder={siteText("vampire.text.01295")}
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 placeholder-stone-700 focus:border-red-900 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={createGhoul}
              disabled={newGhoul.type === 'blood' && bloodGhoulsCount >= maxGhouls}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded transition-colors ${newGhoul.type === 'blood' && bloodGhoulsCount >= maxGhouls
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-200'
                }`}
            >
              <Save size={16} /><SiteText contentKey="vampire.text.01296" />{newGhoul.type === 'mind' ? siteText("vampire.text.01287") : siteText("vampire.text.01297")}
            </button>
            <button
              onClick={() => {
                setCreatingGhoul(false);
                setNewGhoul({ name: '', description: '', role: '', type: 'blood' });
                setError(null);
              }}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
            ><SiteText contentKey="vampire.text.01298" /></button>
          </div>

          <p className="text-xs text-stone-600 italic">
            {newGhoul.type === 'blood'
              ? siteText("vampire.text.01299")
              : siteText("vampire.text.01300")}
          </p>
        </div>
      )}

      {/* Liste des goules */}
      {ghouls.length === 0 && !creatingGhoul ? (
        <div className="text-center py-12 text-stone-600">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-serif"><SiteText contentKey="vampire.text.01301" /></p>
          <p className="text-sm mt-2"><SiteText contentKey="vampire.text.01302" /></p>
        </div>
      ) : (
        <div className="space-y-4">
          {ghouls.map((ghoul) => (
            <GhoulCard
              key={ghoul.id}
              ghoul={ghoul}
              isEditing={editingGhoul?.id === ghoul.id}
              onEdit={(g) => setEditingGhoul(g)}
              onSave={updateGhoul}
              onCancel={() => setEditingGhoul(null)}
              onDelete={deleteGhoul}
            />
          ))}
        </div>
      )}

      {/* Info BP */}
      <div className="bg-stone-950/50 border border-stone-900 rounded p-4 text-xs text-stone-600">
        <p className="font-serif mb-2 text-stone-500"><SiteText contentKey="vampire.text.01303" /></p>
        <ul className="space-y-1 list-disc list-inside">
          <li><SiteText contentKey="vampire.text.01304" />{bloodPotency}): {maxGhouls}<SiteText contentKey="vampire.text.01305" /></li>
          <li><SiteText contentKey="vampire.text.01306" /></li>
          {canCreateMindGhouls && (
            <li className="text-purple-400"><SiteText contentKey="vampire.text.01307" /></li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Composant pour une carte de goule
function GhoulCard({ ghoul, isEditing, onEdit, onSave, onCancel, onDelete }) {
    useSiteContent();
  const [editedGhoul, setEditedGhoul] = useState(ghoul);
  const isMindGhoul = ghoul.type === 'mind';

  React.useEffect(() => {
    setEditedGhoul(ghoul);
  }, [ghoul]);

  if (isEditing) {
    return (
      <div className={`bg-stone-900/60 border ${isMindGhoul ? 'border-purple-900/40' : 'border-stone-700'} rounded-lg p-6 space-y-4`}>
        {isMindGhoul && <div className="text-xs text-purple-400 uppercase tracking-widest font-bold"><SiteText contentKey="vampire.text.01287" /></div>}

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01308" /></label>
          <input
            type="text"
            value={editedGhoul.name}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, name: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01292" /></label>
          <input
            type="text"
            value={editedGhoul.role || ''}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, role: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01294" /></label>
          <textarea
            value={editedGhoul.description || ''}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, description: e.target.value })}
            rows={3}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider"><SiteText contentKey="vampire.text.01309" /></label>
          <textarea
            value={editedGhoul.notes || ''}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, notes: e.target.value })}
            rows={2}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(editedGhoul)}
            className="flex-1 flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-200 px-4 py-2 rounded transition-colors"
          >
            <Save size={16} /><SiteText contentKey="vampire.text.01310" /></button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
          ><SiteText contentKey="vampire.text.01298" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-stone-900/40 border ${isMindGhoul ? 'border-purple-900/30 hover:border-purple-700' : 'border-stone-800 hover:border-stone-700'} rounded-lg p-5 transition-colors relative overflowing-hidden`}>
      {/* Badge Goule de l'Esprit */}
      {isMindGhoul && (
        <div className="absolute top-0 right-0 bg-purple-900/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-bl uppercase tracking-wider border-l border-b border-purple-900/30"><SiteText contentKey="vampire.text.01287" /></div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-serif text-lg ${isMindGhoul ? 'text-purple-100' : 'text-stone-200'} mb-1`}>{ghoul.name}</h3>
          {ghoul.role && (
            <p className="text-sm text-stone-500 italic">{ghoul.role}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(ghoul)}
            className="p-2 text-stone-500 hover:text-stone-300 transition-colors"
            title={siteText("vampire.text.01311")}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(ghoul.id)}
            className="p-2 text-stone-500 hover:text-red-500 transition-colors"
            title={siteText("vampire.text.01312")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {ghoul.description && (
        <p className="text-sm text-stone-400 mb-3 leading-relaxed">{ghoul.description}</p>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-stone-800/50">
        {!isMindGhoul && ghoul.discipline_name && ghoul.discipline_power && (
          <div className="flex items-center gap-2">
            <Droplet size={14} className="text-red-700" />
            <span className="text-xs text-stone-500">
              <span className="text-red-600 font-medium">{displayText("vampire", ghoul.discipline_name)}</span> - {displayText("vampire", ghoul.discipline_power)}
            </span>
          </div>
        )}
        {isMindGhoul && (
          <div className="flex items-center gap-2">
            <div className="text-purple-700">✦</div>
            <span className="text-xs text-purple-400/70 italic"><SiteText contentKey="vampire.text.01313" /></span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-stone-700" />
          <span className="text-xs text-stone-600 capitalize">{ghoul.status || siteText("vampire.text.01314")}</span>
        </div>
      </div>

      {ghoul.notes && (
        <div className="mt-3 pt-3 border-t border-stone-800/50">
          <p className="text-xs text-stone-600 italic">{ghoul.notes}</p>
        </div>
      )}
    </div>
  );
}
