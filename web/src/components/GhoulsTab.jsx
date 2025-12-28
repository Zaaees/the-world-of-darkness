import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X, Droplet, Shield, AlertCircle } from 'lucide-react';

// Configuration de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Limites de goules par Puissance du Sang
const GHOUL_LIMITS = {
  1: 2,
  2: 3,
  3: 5,
  4: 10,
  5: 20,
};

export default function GhoulsTab({ discordUserId, discordGuildId, clan, bloodPotency }) {
  const [ghouls, setGhouls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxGhouls, setMaxGhouls] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [editingGhoul, setEditingGhoul] = useState(null);
  const [creatingGhoul, setCreatingGhoul] = useState(false);
  const [newGhoul, setNewGhoul] = useState({ name: '', description: '', role: '' });

  // Charger les goules
  useEffect(() => {
    if (discordUserId && discordGuildId) {
      loadGhouls();
    }
  }, [discordUserId, discordGuildId]);

  const loadGhouls = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/ghouls`, {
        headers: {
          'X-Discord-User-ID': discordUserId,
          'X-Discord-Guild-ID': discordGuildId,
        },
      });

      const data = await response.json();

      if (data.success) {
        setGhouls(data.ghouls || []);
        setMaxGhouls(data.max_ghouls || GHOUL_LIMITS[bloodPotency] || 2);
        setCurrentCount(data.current_count || 0);
      } else {
        setError(data.error || 'Erreur lors du chargement des goules');
      }
    } catch (err) {
      console.error('Erreur chargement goules:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const createGhoul = async () => {
    if (!newGhoul.name.trim()) {
      setError('Le nom de la goule est requis');
      return;
    }

    try {
      setError(null);

      const response = await fetch(`${API_URL}/api/ghouls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Discord-User-ID': discordUserId,
          'X-Discord-Guild-ID': discordGuildId,
        },
        body: JSON.stringify(newGhoul),
      });

      const data = await response.json();

      if (data.success) {
        await loadGhouls();
        setCreatingGhoul(false);
        setNewGhoul({ name: '', description: '', role: '' });
      } else {
        setError(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error('Erreur création goule:', err);
      setError('Erreur de connexion au serveur');
    }
  };

  const updateGhoul = async (ghoul) => {
    try {
      setError(null);

      const response = await fetch(`${API_URL}/api/ghouls/${ghoul.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Discord-User-ID': discordUserId,
          'X-Discord-Guild-ID': discordGuildId,
        },
        body: JSON.stringify({
          name: ghoul.name,
          description: ghoul.description,
          role: ghoul.role,
          notes: ghoul.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadGhouls();
        setEditingGhoul(null);
      } else {
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur mise à jour goule:', err);
      setError('Erreur de connexion au serveur');
    }
  };

  const deleteGhoul = async (ghoulId) => {
    if (!confirm('Êtes-vous sûr de vouloir libérer cette goule ?')) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`${API_URL}/api/ghouls/${ghoulId}`, {
        method: 'DELETE',
        headers: {
          'X-Discord-User-ID': discordUserId,
          'X-Discord-Guild-ID': discordGuildId,
        },
      });

      const data = await response.json();

      if (data.success) {
        await loadGhouls();
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur suppression goule:', err);
      setError('Erreur de connexion au serveur');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-stone-500">
        <div className="animate-pulse">Chargement des goules...</div>
      </div>
    );
  }

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

  useEffect(() => {
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
