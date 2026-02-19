import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardLayout from '../components/WizardLayout';
import WizardStep from '../components/WizardStep';
import werewolfData from '../assets/werewolf_data.json';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { API_URL } from '../../../config';

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

export default function CreateCharacter() {
    const navigate = useNavigate();
    const { discordUser, guildId } = useUserRoles();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        breed: '',
        auspice: '',
        tribu: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Helpers to get full object from ID
    const getBreed = (id) => werewolfData.breeds.find(b => b.id === id);
    const getAuspice = (id) => werewolfData.auspices.find(a => a.id === id);
    const getTribe = (id) => werewolfData.tribes.find(t => t.id === id);

    const handleSelect = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        // Auto-advance logic could be added here if desired, 
        // but for now we let the user click "Suivant" or keep selection manual
        // Actually, WizardStep is just big cards. Let's make clicking them select + maybe scroll/focus?
        // For this UX, selecting highlights it. User needs to click "Suivant".
    };

    const nextStep = () => {
        if (step === 1 && !formData.breed) return;
        if (step === 2 && !formData.auspice) return;
        if (step === 3 && !formData.tribu) return;
        setStep(prev => prev + 1);
        window.scrollTo(0, 0);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        setError(null);
        setIsSubmitting(true);

        try {
            if (!discordUser || !guildId) throw new Error("Impossible de vous identifier.");

            const headers = {
                'Content-Type': 'application/json',
                'X-Discord-User-ID': discordUser.id,
                'X-Discord-Guild-ID': guildId.toString()
            };

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

            if (!response.ok) throw new Error(data.error || "Erreur lors de la création.");

            setSuccessMsg("Votre légende commence...");

            // Immediate redirection after a short minimal UI feedback delay (optional but better than fixed 2s)
            // Or ideally wait for next render tick. 
            // Better UX: Redirect immediately or show success then redirect.
            // Using a shorter, clearer delay for reading the success message if needed, 
            // but ensuring unmount is safe.
            const target = data.redirect || '/werewolf/sheet';
            setTimeout(() => {
                navigate(target);
            }, 1000);

        } catch (err) {
            setError(err.message);
            setIsSubmitting(false);
        }
    };

    // Prepare data for WizardStep
    const breedsOptions = werewolfData.breeds.map(b => ({ ...b, title: b.name_fr }));
    const auspicesOptions = werewolfData.auspices.map(a => ({ ...a, title: a.name_fr }));
    const tribesOptions = werewolfData.tribes.map(t => ({ ...t, title: t.name_fr }));

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <WizardStep
                        options={breedsOptions}
                        selectedId={formData.breed}
                        onSelect={(id) => handleSelect('breed', id)}
                    />
                );
            case 2:
                return (
                    <WizardStep
                        options={auspicesOptions}
                        selectedId={formData.auspice}
                        onSelect={(id) => handleSelect('auspice', id)}
                    />
                );
            case 3:
                return (
                    <WizardStep
                        options={tribesOptions}
                        selectedId={formData.tribu}
                        onSelect={(id) => handleSelect('tribu', id)}
                    />
                );
            case 4:
                // Résumé et Nom
                const b = getBreed(formData.breed);
                const a = getAuspice(formData.auspice);
                const t = getTribe(formData.tribu);

                return (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-black/40 rounded-lg p-6 mb-8 border border-gray-600">
                            <h3 className="text-2xl font-serif text-amber-500 mb-6 border-b border-gray-700 pb-2">Récapitulatif</h3>
                            <div className="space-y-5">
                                {/* Race */}
                                <div className="border-l-2 border-emerald-800 pl-4">
                                    <span className="text-gray-500 uppercase text-xs tracking-wider block mb-1">Race</span>
                                    <span className="text-white text-lg font-serif">{b?.name_fr}</span>
                                    {b?.quote && (
                                        <p className="text-gray-500 text-xs italic mt-1">"{b.quote}"</p>
                                    )}
                                </div>

                                {/* Auspice */}
                                <div className="border-l-2 border-amber-800 pl-4">
                                    <span className="text-gray-500 uppercase text-xs tracking-wider block mb-1">Auspice</span>
                                    <span className="text-white text-lg font-serif">{a?.name_fr}</span>
                                    {a?.quote && (
                                        <p className="text-gray-500 text-xs italic mt-1">"{a.quote}"</p>
                                    )}
                                </div>

                                {/* Tribu */}
                                <div className="border-l-2 border-red-800 pl-4">
                                    <span className="text-gray-500 uppercase text-xs tracking-wider block mb-1">Tribu</span>
                                    <span className="text-white text-lg font-serif">{t?.name_fr}</span>
                                    {t?.quote && (
                                        <p className="text-gray-500 text-xs italic mt-1">"{t.quote}"</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-lg p-6 border border-gray-600">
                            <label className="block text-amber-500 font-serif text-xl mb-3">Comment vous nommez-vous ?</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleSelect('name', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-600 rounded p-4 text-white text-lg focus:border-red-600 transition outline-none"
                                placeholder="Nom de votre Garou..."
                                minLength={NAME_MIN_LENGTH}
                                maxLength={NAME_MAX_LENGTH}
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 1: return "Choisissez votre Race";
            case 2: return "Sous quelle lune êtes-vous né ?";
            case 3: return "Quelle Tribu rejoignez-vous ?";
            case 4: return "L'Incarnation";
            default: return "";
        }
    };

    const getStepSubtitle = () => {
        switch (step) {
            case 1: return "Votre forme de naissance détermine votre lien avec le monde.";
            case 2: return "L'Auspice définit votre rôle au sein de la meute.";
            case 3: return "Votre tribu est votre famille élargie, votre culture, votre cause.";
            case 4: return "Donnez un nom à votre légende.";
            default: return "";
        }
    };

    const canProceed = () => {
        if (step === 1) return !!formData.breed;
        if (step === 2) return !!formData.auspice;
        if (step === 3) return !!formData.tribu;
        if (step === 4) return !!formData.name && formData.name.length >= NAME_MIN_LENGTH;
        return false;
    };

    return (
        <WizardLayout title={getStepTitle()} subtitle={getStepSubtitle()}>
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-700 mb-8 rounded-full overflow-hidden">
                <div
                    className="h-full bg-red-600 transition-all duration-500 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                ></div>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6 text-center animate-shake">
                        {error}
                    </div>
                )}

                {renderStepContent()}
            </div>

            {/* Navigation Actions */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <button
                    onClick={prevStep}
                    disabled={step === 1 || isSubmitting}
                    className={`px-6 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 transition ${step === 1 ? 'opacity-0 cursor-default' : ''}`}
                >
                    Précédent
                </button>

                {step < 4 ? (
                    <button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className={`px-8 py-3 rounded font-bold transition duration-300 transform
                            ${canProceed()
                                ? 'bg-red-700 hover:bg-red-600 text-white hover:scale-105 shadow-lg'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        Suivant
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!canProceed() || isSubmitting}
                        className={`px-8 py-3 rounded font-bold flex items-center gap-2 transition duration-300 transform
                            ${canProceed()
                                ? 'bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white hover:scale-105 shadow-xl shadow-red-900/30'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Création...
                            </>
                        ) : (
                            <>
                                <span>Confirmer l'Incarnation</span>
                                <span className="text-xl">🌕</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </WizardLayout>
    );
}
