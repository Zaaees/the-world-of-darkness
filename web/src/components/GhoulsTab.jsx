import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X, Droplet, Shield, AlertCircle } from 'lucide-react';

// Limites de goules par Puissance du Sang
const GHOUL_LIMITS = {
  1: 2,
  2: 3,
  3: 5,
  4: 10,
  5: 20,
};

// Disciplines par clan
const CLAN_DISCIPLINES = {
  brujah: ['Célérité', 'Puissance', 'Présence'],
  gangrel: ['Animalisme', 'Force d\'Âme', 'Protéisme'],
  malkavian: ['Auspex', 'Aliénation', 'Occultation'],
  nosferatu: ['Animalisme', 'Occultation', 'Puissance'],
  toreador: ['Auspex', 'Célérité', 'Présence'],
  tremere: ['Auspex', 'Domination', 'Thaumaturgie'],
  ventrue: ['Domination', 'Force d\'Âme', 'Présence'],
  lasombra: ['Domination', 'Obténébration', 'Puissance'],
  tzimisce: ['Animalisme', 'Auspex', 'Vicissitude'],
  assamite: ['Célérité', 'Occultation', 'Quietus'],
  setite: ['Occultation', 'Présence', 'Serpentis'],
  ravnos: ['Animalisme', 'Chimérie', 'Force d\'Âme'],
  giovanni: ['Domination', 'Nécromancie', 'Puissance'],
};

// Pouvoirs de niveau 1 pour chaque discipline
const DISCIPLINE_POWERS = {
  'Animalisme': 'Murmures Fauves',
  'Auspex': 'Sens Accrus',
  'Célérité': 'Grâce Féline',
  'Domination': 'Commandement',
  'Force d\'Âme': 'Résilience',
  'Occultation': 'Cape d\'Ombre',
  'Puissance': 'Vigueur',
  'Présence': 'Crainte Révérencielle',
  'Protéisme': 'Yeux de la Bête',
  'Obténébration': 'Jeu d\'Ombres',
  'Thaumaturgie': 'Goût du Sang',
  'Vicissitude': 'Modelage Mineur',
  'Nécromancie': 'Insight',
  'Quietus': 'Silence de la Mort',
  'Serpentis': 'Regard Hypnotique',
  'Aliénation': 'Passion',
  'Chimérie': 'Ignis Fatuus',
};

export default function GhoulsTab({ ghouls = [], clan, bloodPotency, onUpdateGhouls }) {
  const [editingGhoul, setEditingGhoul] = useState(null);
  const [creatingGhoul, setCreatingGhoul] = useState(false);
  const [newGhoul, setNewGhoul] = useState({ name: '', description: '', role: '' });
  const [error, setError] = useState(null);

  const maxGhouls = GHOUL_LIMITS[bloodPotency] || 2;
  const currentCount = ghouls.length;

  const createGhoul = () => {
    if (!newGhoul.name.trim()) {
      setError('Le nom de la goule est requis');
      return;
    }

    // Assigner une discipline aléatoire du clan
    const clanDisciplines = CLAN_DISCIPLINES[clan?.toLowerCase()] || [];
    const randomDiscipline = clanDisciplines[Math.floor(Math.random() * clanDisciplines.length)];
    const disciplinePower = DISCIPLINE_POWERS[randomDiscipline] || 'Pouvoir Inconnu';

    const ghoul = {
      id: `ghoul_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: newGhoul.name.trim(),
      description: newGhoul.description.trim() || null,
      role: newGhoul.role.trim() || null,
      discipline_name: randomDiscipline,
      discipline_power: disciplinePower,
      status: 'actif',
      notes: '',
      created_at: Date.now(),
    };

    onUpdateGhouls([...ghouls, ghoul]);
    setCreatingGhoul(false);
    setNewGhoul({ name: '', description: '', role: '' });
    setError(null);
  };

  const updateGhoul = (updatedGhoul) => {
    const updated = ghouls.map(g => g.id === updatedGhoul.id ? updatedGhoul : g);
    onUpdateGhouls(updated);
    setEditingGhoul(null);
    setError(null);
  };

  const deleteGhoul = (ghoulId) => {
    if (!confirm('Êtes-vous sûr de vouloir libérer cette goule ?')) {
      return;
    }
    const updated = ghouls.filter(g => g.id !== ghoulId);
    onUpdateGhouls(updated);
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
            <h2 className="text-xl font-serif text-stone-200">Registre de Goules</h2>
            <p className="text-xs text-stone-500">
              {currentCount} / {maxGhouls} goules actives
            </p>
          </div>
        </div>

        {currentCount < maxGhouls && !creatingGhoul && (
          <button
            onClick={() => setCreatingGhoul(true)}
            className="flex items-center gap-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-300 px-4 py-2 rounded transition-colors"
          >
            <Plus size={16} />
            Nouvelle Goule
          </button>
        )}
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 p-4 rounded flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Formulaire de création */}
      {creatingGhoul && (
        <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-stone-200">Créer une Goule</h3>
            <button
              onClick={() => {
                setCreatingGhoul(false);
                setNewGhoul({ name: '', description: '', role: '' });
                setError(null);
              }}
              className="text-stone-500 hover:text-stone-300"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Nom *</label>
            <input
              type="text"
              value={newGhoul.name}
              onChange={(e) => setNewGhoul({ ...newGhoul, name: e.target.value })}
              placeholder="Marcus, Sarah, etc."
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 placeholder-stone-700 focus:border-red-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Rôle</label>
            <input
              type="text"
              value={newGhoul.role}
              onChange={(e) => setNewGhoul({ ...newGhoul, role: e.target.value })}
              placeholder="Garde du corps, informateur, etc."
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 placeholder-stone-700 focus:border-red-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Description</label>
            <textarea
              value={newGhoul.description}
              onChange={(e) => setNewGhoul({ ...newGhoul, description: e.target.value })}
              placeholder="Apparence, personnalité, histoire..."
              rows={3}
              className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 placeholder-stone-700 focus:border-red-900 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={createGhoul}
              className="flex-1 flex items-center justify-center gap-2 bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-red-200 px-4 py-2 rounded transition-colors"
            >
              <Save size={16} />
              Créer
            </button>
            <button
              onClick={() => {
                setCreatingGhoul(false);
                setNewGhoul({ name: '', description: '', role: '' });
                setError(null);
              }}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
            >
              Annuler
            </button>
          </div>

          <p className="text-xs text-stone-600 italic">
            Une discipline de ton clan sera assignée aléatoirement à cette goule.
          </p>
        </div>
      )}

      {/* Liste des goules */}
      {ghouls.length === 0 && !creatingGhoul ? (
        <div className="text-center py-12 text-stone-600">
          <Users size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-serif">Aucune goule pour le moment</p>
          <p className="text-sm mt-2">
            Les goules sont des mortels liés à toi par le sang.
          </p>
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
        <p className="font-serif mb-2 text-stone-500">À propos des goules</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Chaque goule reçoit aléatoirement une discipline de ton clan (niveau 1)</li>
          <li>Le nombre maximum de goules augmente avec ta Puissance du Sang</li>
        </ul>
      </div>
    </div>
  );
}

// Composant pour une carte de goule
function GhoulCard({ ghoul, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const [editedGhoul, setEditedGhoul] = useState(ghoul);

  React.useEffect(() => {
    setEditedGhoul(ghoul);
  }, [ghoul]);

  if (isEditing) {
    return (
      <div className="bg-stone-900/60 border border-stone-700 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Nom</label>
          <input
            type="text"
            value={editedGhoul.name}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, name: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Rôle</label>
          <input
            type="text"
            value={editedGhoul.role || ''}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, role: e.target.value })}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Description</label>
          <textarea
            value={editedGhoul.description || ''}
            onChange={(e) => setEditedGhoul({ ...editedGhoul, description: e.target.value })}
            rows={3}
            className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:border-red-900 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1 uppercase tracking-wider">Notes</label>
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
            <Save size={16} />
            Sauvegarder
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/40 border border-stone-800 rounded-lg p-5 hover:border-stone-700 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-serif text-lg text-stone-200 mb-1">{ghoul.name}</h3>
          {ghoul.role && (
            <p className="text-sm text-stone-500 italic">{ghoul.role}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(ghoul)}
            className="p-2 text-stone-500 hover:text-stone-300 transition-colors"
            title="Modifier"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(ghoul.id)}
            className="p-2 text-stone-500 hover:text-red-500 transition-colors"
            title="Libérer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {ghoul.description && (
        <p className="text-sm text-stone-400 mb-3 leading-relaxed">{ghoul.description}</p>
      )}

      <div className="flex items-center gap-4 pt-3 border-t border-stone-800/50">
        {ghoul.discipline_name && ghoul.discipline_power && (
          <div className="flex items-center gap-2">
            <Droplet size={14} className="text-red-700" />
            <span className="text-xs text-stone-500">
              <span className="text-red-600 font-medium">{ghoul.discipline_name}</span> - {ghoul.discipline_power}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-stone-700" />
          <span className="text-xs text-stone-600 capitalize">{ghoul.status || 'actif'}</span>
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
