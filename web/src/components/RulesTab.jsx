import React from 'react';
import { ScrollText, Droplet, Book, Users, Skull, Activity, Shield, Crown } from 'lucide-react';

export default function RulesTab({ setActiveTab }) {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">

            {/* EN-TÊTE */}
            <div className="text-center space-y-4 border-b border-stone-800 pb-8">
                <h1 className="text-4xl font-serif text-stone-200">Règlement Vampire</h1>
                <p className="text-stone-500 italic">Codex de la Non-Vie et Lois de la Nuit</p>
            </div>

            {/* NAVIGATION RAPIDE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { id: 'tools', icon: ScrollText, label: 'I. Outils Narratifs' },
                    { id: 'territory', icon: Shield, label: 'II. Territoire' },
                    { id: 'thirst', icon: Droplet, label: 'III. Gestion de la Soif' },
                    { id: 'vitae', icon: Activity, label: 'IV. Utilisation de la Vitae' },
                    { id: 'bloodpotency', icon: Crown, label: 'V. Puissance de Sang' },
                    { id: 'hunting', icon: Skull, label: 'VI. Alimentation & Goules' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center gap-3 p-3 rounded bg-stone-900/40 border border-stone-800 hover:border-red-900/50 hover:bg-stone-900 transition-all text-left group"
                    >
                        <item.icon size={18} className="text-stone-600 group-hover:text-red-500 transition-colors" />
                        <span className="text-sm font-serif text-stone-400 group-hover:text-stone-200 uppercase tracking-wider">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* CONTENU */}
            <div className="space-y-16">

                {/* I. OUTILS NARRATIFS */}
                <section id="tools" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">I. Vos Outils Narratifs</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="prose prose-invert prose-stone max-w-none">
                        <p>
                            Le <strong>Panneau Vampirique</strong> (<code>/vampire</code>) est votre premier outil narratif. Cette commande discord vous donne accès à la gestion de votre Soif ainsi qu'au <strong>Vis Vitae</strong>, l'interface web que vous consultez actuellement.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                            <div
                                onClick={() => setActiveTab('character')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><ScrollText size={16} /> Fiche</h3>
                                <p className="text-sm text-stone-400">Votre identité publique et secrète. Chaque modification est notifiée au MJ.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('sheet')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Droplet size={16} /> Vitae</h3>
                                <p className="text-sm text-stone-400">Puissance de Sang, Malédiction de clan et Actions de progression.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('disciplines')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Activity size={16} /> Disciplines</h3>
                                <p className="text-sm text-stone-400">Vos pouvoirs surnaturels et leur coût en Vitae.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('rituals')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Book size={16} /> Grimoire</h3>
                                <p className="text-sm text-stone-400"><strong>Tremere & Giovanni</strong> uniquement. Commencez avec un grimoire vide et apprenez vos rituels en jeu.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('ghouls')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Users size={16} /> Goules</h3>
                                <p className="text-sm text-stone-400">Registre de vos serviteurs de sang.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* II. TERRITOIRE */}
                <section id="territory" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">II. Le Système de Territoire</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>
                    <div className="bg-stone-900/20 p-6 rounded border-l-4 border-stone-700">
                        <p className="text-stone-300 mb-4">
                            Chaque vampire peut revendiquer un <strong>domaine</strong> au sein de la ville.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-stone-400 text-sm">
                            <li>Les <strong>forums</strong> sont des sections urbaines, chaque <strong>post</strong> est un lieu.</li>
                            <li>Apposez un <strong>Tag à votre nom</strong> pour marquer votre territoire.</li>
                            <li><strong>Localisation par défaut :</strong> Si vous n'êtes pas en scène, vous êtes présumé être dans votre domaine.</li>
                            <li><strong>Règle de Contiguïté :</strong> La Camarilla interdit les domaines éparpillés. Votre territoire doit être cohérent.</li>
                            <li><strong>Souveraineté :</strong> Nul ne peut chasser chez vous sans permission. Gare aux guerres de domaine.</li>
                        </ul>
                    </div>
                </section>

                {/* III. GESTION DE LA SOIF */}
                <section id="thirst" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">III. La Gestion de la Soif</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>
                    <div className="prose prose-invert prose-stone text-stone-300">
                        <p>
                            La gestion repose désormais sur une <strong>Réserve de Vitae</strong> (visible sur la table ci-dessous ou le panneau discord).
                        </p>
                        <div className="flex gap-6 mt-6 flex-col md:flex-row">
                            <div className="flex-1 bg-red-950/20 border border-red-900/40 p-4 rounded text-center">
                                <h3 className="text-red-500 font-serif uppercase tracking-widest mb-2">Bouton « Soif »</h3>
                                <p className="text-xs text-stone-400">
                                    Permet de dépenser une quantité précise de Vitae. À utiliser manuellement après chaque discipline ou action coûteuse.
                                </p>
                            </div>
                            <div className="flex-1 bg-green-950/20 border border-green-900/40 p-4 rounded text-center">
                                <h3 className="text-green-600 font-serif uppercase tracking-widest mb-2">Bouton « Se nourrir »</h3>
                                <p className="text-xs text-stone-400">
                                    Restaure intégralement votre réserve de Vitae après une scène de chasse.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* IV. UTILISATION DE LA VITAE */}
                <section id="vitae" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">IV. L'Utilisation de la Vitae</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-stone-900 p-4 rounded border border-stone-800">
                            <h3 className="text-stone-200 font-serif mb-2">Disciplines</h3>
                            <p className="text-sm text-stone-500">Généralement <strong>1, 3 ou 9 Vitae</strong> selon le niveau du pouvoir.</p>
                        </div>
                        <div className="bg-stone-900 p-4 rounded border border-stone-800">
                            <h3 className="text-stone-200 font-serif mb-2">Exploits Physiques</h3>
                            <p className="text-sm text-stone-500">Dépasser ses limites physiques (soulever une voiture, sauter un mur) : <strong>3 Vitae</strong>.</p>
                        </div>
                        <div className="bg-stone-900 p-4 rounded border border-stone-800 col-span-1 md:col-span-2">
                            <h3 className="text-stone-200 font-serif mb-2">Régénération</h3>
                            <ul className="text-sm text-stone-500 space-y-1">
                                <li className="flex justify-between"><span>Blessures Mineures</span> <span className="text-red-500 font-bold">1 Vitae</span></li>
                                <li className="flex justify-between"><span>Blessures Graves</span> <span className="text-red-500 font-bold">3 Vitae</span></li>
                                <li className="flex justify-between"><span>Blessures Majeures</span> <span className="text-red-500 font-bold">9 Vitae</span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* V. PUISSANCE DE SANG */}
                <section id="bloodpotency" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">V. La Puissance de Sang et l'Évolution</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-stone-800 mb-8">
                        <table className="w-full text-left text-sm text-stone-400">
                            <thead className="bg-stone-900 text-stone-200 font-serif uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Rang</th>
                                    <th className="px-4 py-3 text-right">Réserve Max</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                <tr className="bg-stone-950/50">
                                    <td className="px-4 py-2">Rang 1 (Néonate)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">5</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Rang 2 (Ancilla Mineur)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">8</td>
                                </tr>
                                <tr className="bg-stone-950/50">
                                    <td className="px-4 py-2">Rang 3 (Ancilla Majeur)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">12</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Rang 4 (Ancien)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">18</td>
                                </tr>
                                <tr className="bg-stone-950/50">
                                    <td className="px-4 py-2">Rang 5 (Mathusalem)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">25</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-stone-900/30 p-5 rounded border border-stone-800 space-y-4">
                        <h3 className="font-serif text-lg text-stone-300">Progression</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-stone-400">
                            <li><strong>Actions RP :</strong> Accomplissez des hauts faits listés dans l'onglet Vitae.</li>
                            <li><strong>Validation :</strong> Cochez l'action. Le MJ reçoit une notification.</li>
                            <li><strong>Saturation :</strong> L'action validée remplit votre jauge de saturation.</li>
                            <li><strong>Incubation :</strong> Au seuil critique, attendez une nuit (incubation) pour muter.</li>
                        </ol>
                    </div>

                    <div className="bg-red-950/10 p-5 rounded border border-red-900/20 mt-6">
                        <h3 className="font-serif text-lg text-red-500 mb-2">Résistance Mentale</h3>
                        <p className="text-sm text-stone-400 mb-4">
                            Pour résister à une discipline mentale (Domination, Présence...), comparez les Puissances de Sang.
                        </p>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li><strong className="text-red-400">Immunité Absolue :</strong> Impossible d'affecter un vampire de BP supérieur.</li>
                            <li><strong className="text-red-400">Résistance :</strong> Possible si BP égal ou inférieur.</li>
                            <li>
                                <strong>Coût :</strong> <code>Coût du pouvoir × (Différence de Rang + 1)</code>
                            </li>
                        </ul>
                        <p className="text-xs text-red-400/80 mt-2 italic">
                            Un jeune vampire (Rang 1-2) n'aura souvent pas assez de sang pour résister à un Ancien.
                        </p>
                    </div>
                </section>

                {/* VI. ALIMENTATION */}
                <section id="hunting" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">VI. Alimentation & Goules</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-serif text-stone-300 border-b border-stone-800 pb-2">Les Goules</h3>
                            <ul className="text-sm text-stone-400 space-y-2">
                                <li><strong>Création :</strong> Donner son sang à un mortel pendant <strong>3 nuits distinctes</strong>.</li>
                                <li><strong>Restriction :</strong> Boire sur sa propre goule ne nourrit pas (boucle fermée).</li>
                                <li><strong>Vol :</strong> Boire la goule d'un autre brise le lien et détruit ses pouvoirs.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-serif text-stone-300 border-b border-stone-800 pb-2">Scènes de Chasse (Venatio)</h3>
                            <ul className="text-sm text-stone-400 space-y-2">
                                <li><strong>Annonce :</strong> Obligatoire dans le salon <em>Venatio</em>.</li>
                                <li><strong>Solo :</strong> Possible sans MJ (narration libre).</li>
                                <li><strong>Vider la jauge :</strong> Nourrit complètement la Bête.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-stone-900/40 rounded">
                            <div className="w-16 text-center font-bold text-green-500">100-80%</div>
                            <div className="text-sm text-stone-300"><strong>Réserve Pleine :</strong> Alimentation "off" possible. Calme.</div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-stone-900/40 rounded">
                            <div className="w-16 text-center font-bold text-yellow-500">80-40%</div>
                            <div className="text-sm text-stone-300"><strong>Faim Croissante :</strong> Scène suggérée. Compulsion visible.</div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-red-950/20 border border-red-900/30 rounded">
                            <div className="w-16 text-center font-bold text-red-500">&lt; 40%</div>
                            <div className="text-sm text-stone-300"><strong>Danger Critique :</strong> Scène <strong>OBLIGATOIRE</strong>. Mort de la victime quasi-certaine.</div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
