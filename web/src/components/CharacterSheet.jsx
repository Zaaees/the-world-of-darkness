
import React, { useState, useEffect } from 'react';
import { Save, Edit2, AlertCircle, FileText, Loader } from 'lucide-react';
import { getClanDescription } from '../data/clanDescriptions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function CharacterSheet({ userId, guildId }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [clanId, setClanId] = useState(null);
  const [sheetData, setSheetData] = useState({
    name: '',
    age: '',
    sex: '',
    physical_desc: '',
    mental_desc_pre: '',
    mental_desc_post: '',
    history: ''
  });

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer le profil pour avoir le clan
        const profileResponse = await fetch(`${API_URL}/api/vampire/profile`, {
          headers: {
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': guildId,
          }
        });
        const profileData = await profileResponse.json();
        
        if (profileData.success && profileData.clan) {
          setClanId(profileData.clan);
        } else {
          setError("Vous devez avoir un clan pour accéder à la fiche.");
          setLoading(false);
          return;
        }

        // 2. Récupérer la fiche
        const sheetResponse = await fetch(`${API_URL}/api/character-sheet`, {
          headers: {
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': guildId,
          }
        });
        const sheetRes = await sheetResponse.json();

        if (sheetRes.success && sheetRes.exists) {
          setSheetData(sheetRes.data);
          setIsEditing(false);
        } else {
          setIsEditing(true); // Pas de fiche -> Mode édition direct
        }
      } catch (err) {
        console.error("Erreur chargement fiche:", err);
        setError("Impossible de charger la fiche.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, guildId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSheetData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/character-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Discord-User-ID': userId,
          'X-Discord-Guild-ID': guildId,
        },
        body: JSON.stringify(sheetData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsEditing(false);
      } else {
        setError(data.error || "Erreur lors de la sauvegarde.");
      }
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError("Erreur de connexion.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-red-700 animate-spin" />
      </div>
    );
  }

  const clanInfo = getClanDescription(clanId);
  const baneHint = clanInfo ? `Corruption liée au clan ${clanInfo.name} : ${clanInfo.baneDescription}` : "Description de la corruption mentale...";

  // --- MODE VUE ---
  if (!isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[#0c0a09] min-h-screen text-stone-200">
        <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4">
          <h1 className="text-3xl font-serif text-red-600 flex items-center gap-2">
            <FileText className="w-8 h-8" />
            Fiche de Personnage
          </h1>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Modifier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-stone-900/50 p-4 rounded border border-stone-800">
            <h3 className="text-stone-500 text-sm font-medium mb-1">Nom</h3>
            <p className="text-xl font-serif">{sheetData.name || "-"}</p>
          </div>
          <div className="bg-stone-900/50 p-4 rounded border border-stone-800">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-stone-500 text-sm font-medium mb-1">Âge</h3>
                  <p className="text-lg">{sheetData.age || "-"}</p>
                </div>
                <div>
                  <h3 className="text-stone-500 text-sm font-medium mb-1">Sexe</h3>
                  <p className="text-lg">{sheetData.sex || "-"}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <SectionView title="Description Physique" content={sheetData.physical_desc} />
          <SectionView title="Mentalité (Avant l'Etreinte)" content={sheetData.mental_desc_pre} />
          <SectionView title="Mentalité Corrompue" content={sheetData.mental_desc_post} />
          <SectionView title="Histoire" content={sheetData.history} />
        </div>
      </div>
    );
  }

  // --- MODE ÉDITION ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[#0c0a09] min-h-screen text-stone-200">
      <div className="mb-6 border-b border-stone-800 pb-4">
        <h1 className="text-3xl font-serif text-red-600 mb-2">Édition de la Fiche</h1>
        <p className="text-stone-400 text-sm">
          Remplissez les informations ci-dessous. Une fois sauvegardée, la fiche sera automatiquement publiée sur le forum Discord.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-400">Nom et Prénom</label>
            <input
              type="text"
              name="name"
              value={sheetData.name}
              onChange={handleChange}
              className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
              placeholder="Nom complet"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-400">Âge</label>
              <input
                type="text"
                name="age"
                value={sheetData.age}
                onChange={handleChange}
                className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
                placeholder="Ex: 25 ans"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-stone-400">Sexe</label>
              <input
                type="text"
                name="sex"
                value={sheetData.sex}
                onChange={handleChange}
                className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
                placeholder="H/F/Autre"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-400">Description Physique</label>
          <textarea
            name="physical_desc"
            value={sheetData.physical_desc}
            onChange={handleChange}
            rows={4}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
            placeholder="Description du regard, la couleur des yeux, habits couramment portés, cicatrices, allure..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-400">Mentalité (Avant l'Etreinte)</label>
          <textarea
            name="mental_desc_pre"
            value={sheetData.mental_desc_pre}
            onChange={handleChange}
            rows={4}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
            placeholder="Qui étiez-vous ? Vos rêves, vos peurs, votre personnalité avant la nuit..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-red-400">Mentalité Corrompue (Après l'Etreinte)</label>
          <textarea
            name="mental_desc_post"
            value={sheetData.mental_desc_post}
            onChange={handleChange}
            rows={4}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none placeholder-stone-600"
            placeholder={baneHint}
          />
          <p className="text-xs text-stone-500 italic">
            Comment la malédiction de votre clan a-t-elle altéré votre esprit ?
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-400">Histoire</label>
          <textarea
            name="history"
            value={sheetData.history}
            onChange={handleChange}
            rows={8}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
            placeholder="Votre vie avant l'Etreinte, les circonstances de votre mort, vos premières nuits..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-stone-800">
           {/* Si on était en mode vue avant (donc pas première création), on peut annuler */}
           {/* Mais ici pour simplifier, si on annule on recharge la page ou on revient à l'état précédent. 
               Comme on n'a pas gardé l'état précédent proprement (sauf reload), on va juste mettre un bouton Annuler qui reload si on a des données.
           */}
           <button
             onClick={handleSave}
             disabled={saving}
             className="flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors disabled:opacity-50"
           >
             {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Sauvegarde...
                </>
             ) : (
                <>
                  <Save className="w-4 h-4" /> Sauvegarder la Fiche
                </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
}

function SectionView({ title, content }) {
  return (
    <div className="bg-stone-900/30 p-5 rounded border border-stone-800/50">
      <h3 className="text-red-500 font-serif text-lg mb-3 border-b border-stone-800 pb-2">
        {title}
      </h3>
      <div className="text-stone-300 whitespace-pre-line leading-relaxed">
        {content || <span className="text-stone-600 italic">Non renseigné</span>}
      </div>
    </div>
  );
}
