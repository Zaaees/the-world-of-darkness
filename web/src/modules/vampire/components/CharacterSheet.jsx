// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import { readDraft, writeDraft, clearDraft } from '../../../core/drafts';
import { apiFetch } from '../../../core/api';

import React, { useState, useEffect } from 'react';
import { Save, Edit2, AlertCircle, FileText, Loader, Image as ImageIcon, Upload } from 'lucide-react';
import { getClanDescription } from '../../../data/clanDescriptions';
import StarterPackDisplay from './StarterPackDisplay';

import { API_URL } from '../../../config';

export default function CharacterSheet({ userId, guildId, onUpdate, initialData, onSave, draftId }) {
    useSiteContent();
  const draftKey = `vampire:sheet:${draftId || `${guildId}:${userId}`}`;
  const [notice, setNotice] = useState('');
  const [needsSync, setNeedsSync] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(Boolean(readDraft(draftKey)) || !initialData); // Mode lecture par défaut si on a des données (PNJ), sinon édition (chargement joueur)

  const [clanId, setClanId] = useState(initialData?.clan || null); // Le clan peut être passé
  const [sheetData, setSheetData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    sex: initialData?.sex || '',
    physical_desc: initialData?.physical_desc || '',
    mental_desc_pre: initialData?.mental_desc_pre || '',
    mental_desc_post: initialData?.mental_desc_post || '',
    history: initialData?.history || '',
    image_url: initialData?.image_url || '',
    starter_pack_answers: initialData?.starter_pack_answers || null,
    ...readDraft(draftKey)
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Charger les données (seulement si pas d'initialData)
  useEffect(() => {
    if (initialData) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer le profil pour avoir le clan
        const profileResponse = await apiFetch(`${API_URL}/api/vampire/profile`, {
          headers: {
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': guildId,
          }
        });
        const profileData = await profileResponse.json();

        if (profileData.success && profileData.clan) {
          setClanId(profileData.clan);
        } else {
          setError(siteText("vampire.text.01205"));
          setLoading(false);
          return;
        }

        // 2. Récupérer la fiche
        const sheetResponse = await apiFetch(`${API_URL}/api/character-sheet`, {
          headers: {
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': guildId,
          }
        });
        const sheetRes = await sheetResponse.json();

        if (sheetRes.success && sheetRes.exists) {
          const draft = readDraft(draftKey);
          setSheetData(Object.fromEntries(Object.entries({...sheetRes.data, ...draft}).map(([key,value]) => [key, value ?? (key === 'starter_pack_answers' ? null : '')])));
          setIsEditing(Boolean(draft));
        } else {
          setIsEditing(true); // Pas de fiche -> Mode édition direct
        }
      } catch (err) {
        console.error("Erreur chargement fiche:", err);
        setError(siteText("vampire.text.01206"));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, guildId, initialData, draftKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...sheetData, [name]: value };
    setSheetData(next);
    writeDraft(draftKey, next);
  };

  const handleSave = async () => {
    if (!(sheetData.name || '').trim()) { setError(siteText("vampire.text.01207")); return; }
    setSaving(true);
    setError(null);
    try {
      if (onSave) {
        // En mode PNJ/Admin, on délègue la sauvegarde
        await onSave(sheetData);
        if (onUpdate && sheetData.name) {
          onUpdate({ name: sheetData.name });
        }
        clearDraft(draftKey);
        setIsEditing(false);
      } else {
        // Mode Joueur standard
        const response = await apiFetch(`${API_URL}/api/character-sheet`, {
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
          clearDraft(draftKey);
          setNeedsSync(!data.published || data.name_synced === false);
          setNotice(data.published ? siteText("vampire.text.02557") : siteText("vampire.text.02558"));
          if (data.name_synced === false) setNotice(siteText("vampire.text.02477"));
          setIsEditing(false);
          if (onUpdate && sheetData.name) {
            onUpdate({ name: sheetData.name });
          }
        } else {
          setError(data.error || siteText("vampire.text.02559"));
        }
      }
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError(siteText("vampire.text.01208"));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiFetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'X-Discord-User-ID': userId,
          'X-Discord-Guild-ID': guildId,
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.url) {
        const next = { ...sheetData, image_url: data.url };
        setSheetData(next);
        writeDraft(draftKey, next);
      } else {
        setError(data.error || siteText("vampire.text.02560"));
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      setError(siteText("vampire.text.01209"));
    } finally {
      setUploadingImage(false);
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
  const _baneHint = clanInfo ? `Corruption liée au clan ${clanInfo.name} : ${clanInfo.baneDescription}` : "Description de la corruption mentale...";

  // --- MODE VUE ---
  if (!isEditing) {
    return (
      <div className="vp-character max-w-6xl mx-auto p-4 md:p-6 bg-[#0c0a09] min-h-screen text-stone-300 text-sm">
        <div className="flex justify-between items-center mb-4 border-b border-stone-800 pb-2">
          <h1 className="text-xl font-serif text-red-600 flex items-center gap-2">
            <FileText className="w-5 h-5" /><SiteText contentKey="vampire.text.01210" /></h1>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors text-xs"
          >
            <Edit2 className="w-3 h-3" /><SiteText contentKey="vampire.text.01211" /></button>
        </div>

        {error && <p role="alert" className="text-red-300">{displayText("vampire", error)}</p>}
        {notice && <p role="status" className="border border-stone-600 p-3 mb-4">{displayText("vampire", notice)} {needsSync && <button type="button" onClick={handleSave} disabled={saving} className="underline"><SiteText contentKey="vampire.text.01212" /></button>}</p>}
        {!sheetData.history && <p className="mb-4"><SiteText contentKey="vampire.text.01213" /></p>}
        <StarterPackDisplay answers={sheetData.starter_pack_answers} clanId={clanId} />
        {/* Image - Centrée Haut */}
        {sheetData.image_url && (
          <div className="mb-6 flex justify-center">
            <img
              src={sheetData.image_url}
              alt={siteText("vampire.text.01214")}
              className="max-h-[500px] w-auto rounded border border-stone-800 shadow-lg object-contain bg-black/20"
            />
          </div>
        )}

        {/* Identité Compacte */}
        <div className="vp-identity bg-stone-900/50 p-3 rounded border border-stone-800 flex flex-wrap gap-6 items-center justify-center mb-6">
          <div className="text-center">
            <span className="text-stone-500 text-xs uppercase tracking-wider block"><SiteText contentKey="vampire.text.01215" /></span>
            <span className="text-lg font-serif text-stone-200">{sheetData.name || "-"}</span>
          </div>
          <div className="h-8 w-px bg-stone-800 hidden sm:block"></div>
          <div className="text-center">
            <span className="text-stone-500 text-xs uppercase tracking-wider block"><SiteText contentKey="vampire.text.01216" /></span>
            <span className="text-base text-stone-300">{sheetData.age || "-"}</span>
          </div>
          <div className="h-8 w-px bg-stone-800 hidden sm:block"></div>
          <div className="text-center">
            <span className="text-stone-500 text-xs uppercase tracking-wider block"><SiteText contentKey="vampire.text.01217" /></span>
            <span className="text-base text-stone-300">{sheetData.sex || "-"}</span>
          </div>
        </div>

        {/* Descriptions - Pleine largeur */}
        <div className="space-y-4 mb-6">
          <SectionView title={siteText("vampire.text.01218")} content={sheetData.physical_desc} scene="mirror" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionView title={siteText("vampire.text.01219")} content={sheetData.mental_desc_pre} />
            <SectionView title={siteText("vampire.text.01220")} content={sheetData.mental_desc_post} highlight />
          </div>
        </div>

        {/* Histoire - Large */}
        <SectionView title={siteText("vampire.text.01221")} content={sheetData.history} scene="archive" />
      </div>
    );
  }

  // --- MODE ÉDITION ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-[#0c0a09] min-h-screen text-stone-200">
      <div className="mb-6 border-b border-stone-800 pb-4">
        <h1 className="text-3xl font-serif text-red-600 mb-2"><SiteText contentKey="vampire.text.01222" /></h1>
        <p className="text-stone-400 text-sm"><SiteText contentKey="vampire.text.01223" /></p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded flex items-center gap-3 text-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {displayText("vampire", error)}
        </div>
      )}

      <div className="space-y-6">
        {/* Image Upload */}
        <div className="bg-stone-900/50 border border-stone-800 rounded p-6 text-center">
          {sheetData.image_url ? (
            <div className="space-y-4">
              <img
                src={sheetData.image_url}
                alt={siteText("vampire.text.01224")}
                className="mx-auto max-h-64 rounded shadow border border-stone-700"
              />
              <div className="flex justify-center gap-2">
                <label className="cursor-pointer px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-300 text-sm flex items-center gap-2 transition-colors">
                  <Upload size={14} /><SiteText contentKey="vampire.text.01225" /><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                </label>
                <button
                  onClick={() => setSheetData(prev => ({ ...prev, image_url: '' }))}
                  className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded border border-red-900/50 text-red-300 text-sm"
                ><SiteText contentKey="vampire.text.01226" /></button>
              </div>
            </div>
          ) : (
            <label className={`cursor-pointer block border-2 border-dashed border-stone-700 rounded-lg p-8 hover:border-stone-500 hover:bg-stone-900/30 transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
              <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
              <p className="text-stone-400 font-medium mb-1">
                {uploadingImage ? siteText("vampire.text.01227") : siteText("vampire.text.01228")}
              </p>
              <p className="text-stone-600 text-xs"><SiteText contentKey="vampire.text.01229" /></p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
            </label>
          )}
        </div>

        {/* Identité */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="sheet-name" className="block text-sm font-medium text-stone-400"><SiteText contentKey="vampire.text.01230" /></label>
            <input
              type="text"
              id="sheet-name" name="name"
              value={sheetData.name}
              onChange={handleChange}
              className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
              placeholder={siteText("vampire.text.01231")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="sheet-age" className="block text-sm font-medium text-stone-400"><SiteText contentKey="vampire.text.01216" /></label>
              <input
                type="text"
                id="sheet-age" name="age"
                value={sheetData.age}
                onChange={handleChange}
                className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
                placeholder={siteText("vampire.text.01232")}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sheet-sex" className="block text-sm font-medium text-stone-400"><SiteText contentKey="vampire.text.01217" /></label>
              <input
                type="text"
                id="sheet-sex" name="sex"
                value={sheetData.sex}
                onChange={handleChange}
                className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 focus:outline-none"
                placeholder={siteText("vampire.text.01233")}
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-2">
          <label htmlFor="sheet-physical_desc" className="block text-sm font-medium text-stone-400"><SiteText contentKey="vampire.text.01218" /></label>
          <textarea
            id="sheet-physical_desc" name="physical_desc"
            value={sheetData.physical_desc}
            onChange={handleChange}
            rows={12}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 focus:outline-none"
            placeholder={siteText("vampire.text.01234")}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sheet-mental_desc_pre" className="block text-sm font-medium text-stone-400"><SiteText contentKey="vampire.text.01219" /></label>
          <textarea
            id="sheet-mental_desc_pre" name="mental_desc_pre"
            value={sheetData.mental_desc_pre}
            onChange={handleChange}
            rows={12}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 focus:outline-none"
            placeholder={siteText("vampire.text.01235")}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="sheet-mental_desc_post" className="block text-sm font-medium text-red-400"><SiteText contentKey="vampire.text.01236" /></label>
          <textarea
            id="sheet-mental_desc_post" name="mental_desc_post"
            value={sheetData.mental_desc_post}
            onChange={handleChange}
            rows={12}
            className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 focus:outline-none placeholder-stone-600"
            placeholder={displayText("vampire", clanInfo ? clanInfo.transformationDescription : siteText("vampire.text.01237"))}
          />
          <p className="text-xs text-stone-500 italic"><SiteText contentKey="vampire.text.01238" /></p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="vampire.text.01221" /></label>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <textarea
                name="history"
                value={sheetData.history}
                onChange={handleChange}
                rows={24}
                className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 focus:outline-none h-full"
                placeholder={siteText("vampire.text.01239")}
              />
            </div>

            <div className="bg-stone-900/40 border border-stone-800 rounded p-4 h-full overflow-y-auto max-h-[600px]">
              <h4 className="text-sm font-serif text-red-500 mb-3 border-b border-stone-800 pb-2"><SiteText contentKey="vampire.text.01240" /></h4>

              <StarterPackDisplay answers={sheetData.starter_pack_answers} clanId={clanId} />
            </div>
          </div>
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
                <Loader className="w-4 h-4 animate-spin" /><SiteText contentKey="vampire.text.01241" /></>
            ) : (
              <>
                <Save className="w-4 h-4" /><SiteText contentKey="vampire.text.01242" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


function SectionView({ title, content, highlight = false, scene }) {
    useSiteContent();
  return (
    <div data-scene={scene} className={`vp-chapter p-3 rounded border ${highlight ? 'bg-red-950/10 border-red-900/20' : 'bg-stone-900/30 border-stone-800/50'} h-full`}>
      <h3 className={`font-serif text-sm uppercase tracking-widest mb-2 border-b pb-1 ${highlight ? 'text-red-400 border-red-900/30' : 'text-stone-500 border-stone-800'}`}>
        {displayText("vampire", title)}
      </h3>
      <div className="text-xs text-stone-300 whitespace-pre-line leading-relaxed text-justify">
        {content || <span className="text-stone-600 italic"><SiteText contentKey="vampire.text.01243" /></span>}
      </div>
    </div>
  );
}
