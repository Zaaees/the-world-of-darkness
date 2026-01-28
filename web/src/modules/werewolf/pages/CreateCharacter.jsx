import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WerewolfLayout from '../components/WerewolfLayout';
// Import des assets Story 2.2 - données des races, auspices et tribus
import werewolfData from '../assets/werewolf_data.json';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { API_URL } from '../../../config';

// Constantes de validation
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

/**
 * CreateCharacter - Formulaire de création de personnage Werewolf
 * 
 * Permet à un nouveau joueur Loup-Garou de définir son personnage :
 * - Race (Breed)
 * - Auspice
 * - Tribu
 * - Nom du personnage
 * 
 * Tous les champs sont obligatoires et les choix sont définitifs.
 */
export default function CreateCharacter() {
    const navigate = useNavigate();
    const { discordUser, guildId } = useUserRoles();

    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        auspice: '',
        tribu: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null); // Pour le Toast

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (!discordUser || !guildId) {
                throw new Error("Impossible de vous identifier. Veuillez recharger la page.");
            }

            const headers = {
                'Content-Type': 'application/json',
                'X-Discord-User-ID': discordUser.id,
                'X-Discord-Guild-ID': guildId.toString()
            };

            // Mapper 'tribu' vers 'tribe' pour le backend si nécessaire, 
            // mais routes.py utilise character_data['tribe'], donc 'tribu' doit être 'tribe' si c'est ce qu'attend le backend?
            // Vérifions character_service.py... il attend character_data['tribe'].
            // Frontend envoie 'tribu'.

            // On va mapper les clés pour correspondre exactement au backend
            const payload = {
                name: formData.name,
                breed: formData.breed,
                auspice: formData.auspice,
                tribe: formData.tribu
            };

            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Une erreur est survenue lors de la création.");
            }

            // Success
            setSuccessMsg(data.message || "Personnage créé avec succès !");

            // Redirection après délai pour laisser le temps de lire le toast
            setTimeout(() => {
                if (data.redirect) {
                    navigate(data.redirect);
                }
            }, 2000);

        } catch (err) {
            console.error("Erreur création perso:", err);
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    return (
        <WerewolfLayout>
            <div className="theme-deep-woods" data-theme="deep-woods">
                <div className="min-h-screen flex flex-col items-center justify-center p-6">
                    <div className="max-w-lg w-full">
                        {/* Titre */}
                        <h1 className="text-3xl md:text-4xl font-header text-amber-200 mb-2 text-center tracking-wide">
                            Création de Personnage
                        </h1>
                        <p className="text-emerald-400 font-serif text-lg mb-6 text-center">
                            Réponds à l'appel de Gaïa
                        </p>

                        {/* Toast de Succès (Fixed/Absolute) */}
                        {successMsg && (
                            <div className="fixed top-4 right-4 z-50 animate-bounce-in">
                                <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-100 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-md">
                                    <span className="text-2xl">🎉</span>
                                    <div>
                                        <h4 className="font-bold text-lg">Félicitations !</h4>
                                        <p>{successMsg}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Avertissement - Choix définitifs */}
                        <div
                            id="definitive-warning"
                            className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6"
                            role="alert"
                        >
                            <p className="text-red-300 text-sm text-center">
                                ⚠️ <strong>Attention :</strong> Ces choix sont <strong>définitifs</strong> et ne pourront pas être modifiés ultérieurement.
                            </p>
                        </div>

                        {/* Message d'Erreur */}
                        {error && (
                            <div className="bg-red-950/50 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
                                <p>❌ {error}</p>
                            </div>
                        )}

                        {/* Formulaire */}
                        <form
                            onSubmit={handleSubmit}
                            className="bg-stone-900/50 border border-emerald-900/30 rounded-lg p-6 backdrop-blur-sm space-y-5"
                        >
                            {/* Nom du personnage */}
                            <div>
                                <label
                                    htmlFor="character-name"
                                    className="block text-stone-300 text-sm font-medium mb-2"
                                >
                                    Nom du personnage
                                </label>
                                <input
                                    type="text"
                                    id="character-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength={NAME_MIN_LENGTH}
                                    maxLength={NAME_MAX_LENGTH}
                                    aria-label="Nom"
                                    aria-describedby="definitive-warning"
                                    placeholder="Entre le nom de ton personnage..."
                                    className="w-full bg-stone-800/50 border border-stone-600 rounded-md px-4 py-2 text-stone-100 placeholder-stone-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                                />
                            </div>

                            {/* Race (Breed) */}
                            <div>
                                <label
                                    htmlFor="character-race"
                                    className="block text-stone-300 text-sm font-medium mb-2"
                                >
                                    Race
                                </label>
                                <select
                                    id="character-race"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    required
                                    aria-label="Race"
                                    aria-describedby="definitive-warning"
                                    className="w-full bg-stone-800/50 border border-stone-600 rounded-md px-4 py-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                                >
                                    <option value="">-- Sélectionne ta race --</option>
                                    {werewolfData.breeds.map(breed => (
                                        <option key={breed.id} value={breed.id}>
                                            {breed.name_fr}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Auspice */}
                            <div>
                                <label
                                    htmlFor="character-auspice"
                                    className="block text-stone-300 text-sm font-medium mb-2"
                                >
                                    Auspice
                                </label>
                                <select
                                    id="character-auspice"
                                    name="auspice"
                                    value={formData.auspice}
                                    onChange={handleChange}
                                    required
                                    aria-label="Auspice"
                                    aria-describedby="definitive-warning"
                                    className="w-full bg-stone-800/50 border border-stone-600 rounded-md px-4 py-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                                >
                                    <option value="">-- Sélectionne ton auspice --</option>
                                    {werewolfData.auspices.map(auspice => (
                                        <option key={auspice.id} value={auspice.id}>
                                            {auspice.name_fr}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tribu */}
                            <div>
                                <label
                                    htmlFor="character-tribu"
                                    className="block text-stone-300 text-sm font-medium mb-2"
                                >
                                    Tribu
                                </label>
                                <select
                                    id="character-tribu"
                                    name="tribu"
                                    value={formData.tribu}
                                    onChange={handleChange}
                                    required
                                    aria-label="Tribu"
                                    aria-describedby="definitive-warning"
                                    className="w-full bg-stone-800/50 border border-stone-600 rounded-md px-4 py-2 text-stone-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition"
                                >
                                    <option value="">-- Sélectionne ta tribu --</option>
                                    {werewolfData.tribes.map(tribe => (
                                        <option key={tribe.id} value={tribe.id}>
                                            {tribe.name_fr}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Bouton de soumission */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-4 
                                    ${isSubmitting
                                        ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
                                        : 'bg-amber-700 hover:bg-amber-600 text-white'}`}
                            >
                                {isSubmitting ? 'Rituel en cours...' : 'Créer mon personnage'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </WerewolfLayout>
    );
}
