import re

filepath = r"f:\Dossiers Utilisateur\Desktop\World of Darkness Code - BMAT\web\src\modules\werewolf\pages\CharacterSheet.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import ReactMarkdown from 'react-markdown';",
    "import ReactMarkdown from 'react-markdown';\nimport { Save, Edit2, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';"
)

# 2. States
content = content.replace(
    """    const [isEditingStory, setIsEditingStory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [storyDraft, setStoryDraft] = useState('');""",
    """    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [sheetData, setSheetData] = useState({
        name: '', age: '', sex: '', physical_desc: '', mental_desc_pre: '', first_change: '', story: '', image_url: ''
    });
    const [uploadingImage, setUploadingImage] = useState(false);"""
)

# 3. API Population
content = content.replace(
    """                // Personnage
                if (charData?.character) {
                    setCharacter(charData.character);
                    setStoryDraft(charData.character.story || '');
                } else if (charData?.code === 'NO_CHARACTER') {""",
    """                // Personnage
                if (charData?.character) {
                    setCharacter(charData.character);
                    const c = charData.character;
                    setSheetData({
                        name: c.name !== "Jeune Garou inconnu" ? c.name : '',
                        age: c.age || '',
                        sex: c.sex || '',
                        physical_desc: c.physical_desc || '',
                        mental_desc_pre: c.mental_desc_pre || '',
                        first_change: c.first_change || '',
                        story: c.story || '',
                        image_url: c.image_url || ''
                    });
                    const req = ['name', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'story'];
                    let complete = true;
                    for (const f of req) {
                        if (!c[f] || c[f] === "Jeune Garou inconnu") { complete = false; break; }
                    }
                    setIsEditing(!complete);
                } else if (charData?.code === 'NO_CHARACTER') {"""
)

# 4. handleUpdateStory -> handleChange etc
start_idx = content.find("    /**\n     * Met à jour l'histoire du personnage.")
end_idx = content.find("    // ── Rendu : états de chargement et d'erreur ──")

replacement_handlers = """    const handleChange = (e) => {
        const { name, value } = e.target;
        setSheetData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        setFormError(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'X-Discord-User-ID': String(discordUser.id), 'X-Discord-Guild-ID': String(guildId) },
                body: formData
            });
            const data = await response.json();
            if (data.success && data.url) setSheetData(prev => ({ ...prev, image_url: data.url }));
            else setFormError(data.error || "Erreur upload image");
        } catch (err) {
            setFormError("Impossible d'uploader l'image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async () => {
        if (!discordUser) return;
        setIsSaving(true);
        setFormError(null);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Discord-User-ID': String(discordUser.id), 'X-Discord-Guild-ID': String(guildId) },
                body: JSON.stringify({
                    name: sheetData.name || "Jeune Garou inconnu",
                    age: sheetData.age, sex: sheetData.sex, physical_desc: sheetData.physical_desc,
                    mental_desc_pre: sheetData.mental_desc_pre, first_change: sheetData.first_change,
                    story: sheetData.story, image_url: sheetData.image_url
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Erreur sauvegarde');
            
            setCharacter(prev => ({ ...prev, ...data.character }));
            
            const req = ['name', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'story'];
            let complete = true;
            for (const f of req) {
                if (!data.character[f] || data.character[f] === "Jeune Garou inconnu") { complete = false; break; }
            }
            if (complete) setIsEditing(false);
            else setFormError("Veuillez remplir tous les champs obligatoires (Image optionnelle).");
            
        } catch (err) {
            setFormError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

"""
content = content[:start_idx] + replacement_handlers + content[end_idx:]

# 5. JSX Render for activeTab === 'sheet'
# We will use Regex to capture the block safely because it is large
import ast

def get_new_sheet_jsx():
    return """            {/* Contenu de l'onglet actif */}
            {activeTab === 'sheet' && character && (
                <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-700">
                    {/* Header de la fiche */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-amber-900/30 pb-6">
                        <div className="flex items-center gap-4">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors text-xs text-stone-300"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-header text-amber-200 tracking-tight">
                                    {character.name || "Jeune Garou inconnu"}
                                </h1>
                                <p className="text-emerald-400 font-serif italic text-lg mt-1">
                                    {translate('tribe', character.tribe)}
                                </p>
                            </div>
                        </div>
                        <RenownBadge rank={character.rank} />
                    </div>

                    {/* Grille d'informations — design immersif avec lore */}
                    {(() => {
                        const breedData = findLoreData('breeds', character.breed);
                        const auspiceData = findLoreData('auspices', character.auspice);
                        const tribeData = findLoreData('tribes', character.tribe);
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                {/* Carte Race */}
                                <div className="bg-stone-900/60 p-5 rounded-lg border border-emerald-900/30 hover:border-emerald-700/50 transition-colors">
                                    <span className="block text-xs uppercase tracking-widest text-emerald-600 mb-2">Race</span>
                                    <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                        {breedData?.name_fr || translate('breed', character.breed)}
                                    </h3>
                                    {breedData?.quote && (
                                        <blockquote className="italic text-xs text-stone-500 border-l-2 border-emerald-900/50 pl-2 mb-2 leading-relaxed">
                                            "{breedData.quote}"
                                        </blockquote>
                                    )}
                                    <p className="text-stone-400 text-xs leading-relaxed">
                                        {breedData?.description || ''}
                                    </p>
                                </div>

                                {/* Carte Auspice */}
                                <div className="bg-stone-900/60 p-5 rounded-lg border border-amber-900/30 hover:border-amber-700/50 transition-colors">
                                    <span className="block text-xs uppercase tracking-widest text-amber-600 mb-2">Auspice</span>
                                    <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                        {auspiceData?.name_fr || translate('auspice', character.auspice)}
                                    </h3>
                                    {auspiceData?.quote && (
                                        <blockquote className="italic text-xs text-stone-500 border-l-2 border-amber-900/50 pl-2 mb-2 leading-relaxed">
                                            "{auspiceData.quote}"
                                        </blockquote>
                                    )}
                                    <p className="text-stone-400 text-xs leading-relaxed">
                                        {auspiceData?.description || ''}
                                    </p>
                                </div>

                                {/* Carte Tribu */}
                                <div className="bg-stone-900/60 p-5 rounded-lg border border-red-900/30 hover:border-red-700/50 transition-colors">
                                    <span className="block text-xs uppercase tracking-widest text-red-600 mb-2">Tribu</span>
                                    <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                        {tribeData?.name_fr || translate('tribe', character.tribe)}
                                    </h3>
                                    {tribeData?.quote && (
                                        <blockquote className="italic text-xs text-stone-500 border-l-2 border-red-900/50 pl-2 mb-2 leading-relaxed">
                                            "{tribeData.quote}"
                                        </blockquote>
                                    )}
                                    <p className="text-stone-400 text-xs leading-relaxed">
                                        {tribeData?.description || ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Mode Edition ou Lecture */}
                    {!isEditing ? (
                        <div className="space-y-6">
                            {character.image_url && (
                                <div className="mb-6 flex justify-center">
                                    <img src={character.image_url} alt="Personnage" className="max-h-[500px] w-auto rounded border border-stone-800 shadow-lg object-contain bg-black/20" />
                                </div>
                            )}

                            <div className="bg-stone-900/50 p-3 rounded border border-stone-800 flex flex-wrap gap-6 items-center justify-center mb-6">
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block">Nom</span>
                                    <span className="text-lg font-serif text-stone-200">{character.name !== "Jeune Garou inconnu" ? character.name : "-"}</span>
                                </div>
                                <div className="h-8 w-px bg-stone-800 hidden sm:block"></div>
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block">Âge</span>
                                    <span className="text-base text-stone-300">{character.age || "-"}</span>
                                </div>
                                <div className="h-8 w-px bg-stone-800 hidden sm:block"></div>
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block">Sexe</span>
                                    <span className="text-base text-stone-300">{character.sex || "-"}</span>
                                </div>
                            </div>

                            <SectionView title="Apparence Physique" content={character.physical_desc} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SectionView title="Mentalité avant le changement" content={character.mental_desc_pre} />
                                <SectionView title="Le Premier Changement" content={character.first_change} highlight />
                            </div>

                            <SectionView title="Histoire" content={character.story} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formError && (
                                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded flex items-center gap-3 text-red-200 animate-in fade-in">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {formError}
                                </div>
                            )}

                            {/* Image Upload */}
                            <div className="bg-stone-900/50 border border-stone-800 rounded p-6 text-center">
                                {sheetData.image_url ? (
                                    <div className="space-y-4">
                                        <img src={sheetData.image_url} alt="Aperçu" className="mx-auto max-h-64 rounded shadow border border-stone-700" />
                                        <div className="flex justify-center gap-2">
                                            <label className="cursor-pointer px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-300 text-sm flex items-center gap-2 transition-colors">
                                                <Upload size={14} /> Changer l'image
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                            </label>
                                            <button onClick={() => setSheetData(prev => ({ ...prev, image_url: '' }))} className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded border border-red-900/50 text-red-300 text-sm">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer block border-2 border-dashed border-stone-700 rounded-lg p-8 hover:border-stone-500 hover:bg-stone-900/30 transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                                        <p className="text-stone-400 font-medium mb-1">
                                            {uploadingImage ? 'Téléchargement...' : 'Ajouter une image (Optionnel)'}
                                        </p>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-stone-400">Nom complet</label>
                                    <input type="text" name="name" value={sheetData.name} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder="Nom du Garou" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-400">Âge</label>
                                        <input type="number" min="0" name="age" value={sheetData.age} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder="Ex: 25" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-400">Sexe</label>
                                        <input type="text" name="sex" value={sheetData.sex} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder="H/F/Autre" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400">Apparence Physique (Homidée, Lupus ou Crinos...)</label>
                                <textarea name="physical_desc" value={sheetData.physical_desc} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400">Mentalité (Avant le Premier Changement)</label>
                                <textarea name="mental_desc_pre" value={sheetData.mental_desc_pre} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-red-500">Le Premier Changement</label>
                                <textarea name="first_change" value={sheetData.first_change} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none placeholder-stone-600" placeholder="Comment avez-vous vécu votre première transformation ? La Rage primordiale s'est-elle emparée de vous ?" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400">Histoire complète (Supporte le Markdown)</label>
                                <textarea name="story" value={sheetData.story} onChange={handleChange} rows={12} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-stone-800">
                                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors disabled:opacity-50">
                                    <Save className="w-4 h-4" /> {isSaving ? 'Sauvegarde...' : 'Sauvegarder et Publier la Fiche'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}"""

start_token = "{/* Contenu de l'onglet actif */}"
end_token = "{activeTab === 'gifts' && ("

idx_start = content.find(start_token)
idx_end = content.find(end_token)

content = content[:idx_start] + get_new_sheet_jsx() + "\n\n            " + content[idx_end:]


# 6. Add SectionView component at the end
section_view = """
function SectionView({ title, content, highlight = false }) {
  return (
    <div className={`p-4 rounded border ${highlight ? 'bg-red-950/10 border-red-900/30' : 'bg-stone-900/30 border-stone-800/50'} h-full`}>
      <h3 className={`font-serif text-sm uppercase tracking-widest mb-3 border-b pb-2 ${highlight ? 'text-red-400 border-red-900/40' : 'text-stone-500 border-stone-800'}`}>
        {title}
      </h3>
      <div className="text-sm text-stone-300 whitespace-pre-line leading-relaxed text-justify">
        {content ? (
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
        ) : (
            <span className="text-stone-600 italic">Non renseigné</span>
        )}
      </div>
    </div>
  );
}
"""
content = content + section_view

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Modification complete.")
