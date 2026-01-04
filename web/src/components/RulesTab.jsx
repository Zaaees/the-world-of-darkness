import React, { useEffect } from 'react';
import { ScrollText, Droplet, Book, Users, Skull, Activity, Shield, Crown, FileText, Sparkles } from 'lucide-react';

export default function RulesTab({ setActiveTab }) {
    useEffect(() => {
        console.log("RulesTab mounted");
    }, []);

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
            <div className="space-y-16 text-stone-300">

                {/* I. OUTILS NARRATIFS */}
                <section id="tools" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">I. Vos Outils Narratifs</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="space-y-4">
                        <p className="leading-relaxed">
                            Le <strong className="text-stone-200">Panneau Vampirique</strong> (<code className="bg-stone-900 px-1 py-0.5 rounded text-red-400 text-sm">/vampire</code>) est votre premier outil narratif. Cette commande vous donne accès à la gestion de votre Soif ainsi qu'au <strong className="text-stone-200">Vis Vitae</strong>, votre deuxième outil narratif, qui vous permet de gérer les aspects techniques de votre personnage.
                        </p>
                        <p className="leading-relaxed">
                            Le <strong className="text-stone-200">Vis Vitae</strong> se compose de cinq onglets distincts (selon votre clan) correspondant aux sections du site :
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                            <div
                                onClick={() => setActiveTab('character')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><FileText size={16} /> Fiche</h3>
                                <p className="text-sm text-stone-400">Créez et modifiez votre fiche de personnage. Chaque modification est automatiquement notifiée au MJ Vampire et publiée dans le salon <em>Tabulae</em>.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('sheet')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Droplet size={16} /> Vitae</h3>
                                <p className="text-sm text-stone-400">Consultez votre puissance de sang actuelle et votre progression. Découvrez la Malédiction de votre clan et les actions disponibles pour augmenter votre puissance. Soumettez vos demandes de validation au MJ Vampire après avoir accompli une action en RP.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('disciplines')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Sparkles size={16} /> Disciplines</h3>
                                <p className="text-sm text-stone-400">Accédez à vos pouvoirs surnaturels et leur coût en Vitae. Vos facultés dépendent de votre clan et de votre puissance de sang — de nouvelles capacités se débloquent à chaque niveau atteint.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('rituals')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Book size={16} /> Grimoire</h3>
                                <p className="text-sm text-stone-400"><strong>Tremere & Giovanni</strong> uniquement. Consultez votre bibliothèque de rituels et cérémonies. <strong className="text-stone-300">Vous commencez votre non-vie avec un grimoire vide.</strong> Ces arts occultes ne s'improvisent pas : pour acquérir de nouveaux rituels, vous devrez mener l'enquête en jeu, trouver des mentors ou déchiffrer des textes anciens.</p>
                            </div>

                            <div
                                onClick={() => setActiveTab('ghouls')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Users size={16} /> Goules</h3>
                                <p className="text-sm text-stone-400">Gérez le registre de vos goules. Le nombre maximal dépend de votre puissance de sang. Chaque goule créée obtient aléatoirement le premier niveau de l'une de vos disciplines.</p>
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
                        <p className="text-stone-300 mb-4 font-serif text-lg">
                            Chaque vampire peut revendiquer un <strong className="text-stone-100">domaine</strong> au sein de la ville.
                        </p>
                        <div className="space-y-4 text-stone-400 text-sm leading-relaxed">
                            <p>Les <strong className="text-stone-300">forums</strong> représentent les différentes sections urbaines, et chaque <strong className="text-stone-300">post</strong> correspond à un lieu distinct. Pour marquer un lieu comme votre domaine, apposez un <strong className="text-stone-300">Tag à votre nom</strong> sur le post concerné.</p>
                            <p>Un vampire peut étendre son influence sur l'ensemble d'un forum, s'appropriant ainsi toute une zone de la ville.</p>
                            <p><strong className="text-stone-300">Localisation par défaut :</strong> Lorsque votre personnage n'est engagé dans aucune scène active, il est considéré comme présent dans son domaine. Votre refuge s'y trouve également.</p>
                            <p><strong className="text-stone-300">Position de la Camarilla :</strong> La Camarilla laisse aux vampires la liberté de définir leurs domaines. Toutefois, elle n'autorise pas un vampire à posséder plusieurs territoires géographiquement éloignés. Votre domaine doit former un ensemble cohérent et contigu.</p>
                            <p><strong className="text-stone-300">Souveraineté et conflits :</strong> Selon les traditions de la Mascarade, vous êtes souverain sur votre territoire. Nul ne peut y chasser sans votre permission. Cependant, d'autres vampires peuvent convoiter vos possessions. Les guerres de domaine sont monnaie courante — soyez prêt à défendre ce qui vous appartient.</p>
                        </div>
                    </div>
                </section>

                {/* III. GESTION DE LA SOIF */}
                <section id="thirst" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">III. La Gestion de la Soif</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>
                    <div className="space-y-4">
                        <p className="leading-relaxed">
                            La gestion de la Soif s'effectue via votre <strong className="text-stone-200">Panneau Vampirique</strong> (sur Discord) et repose sur une <strong className="text-stone-200">Réserve de Vitae</strong>.
                        </p>
                        <div className="flex gap-6 mt-6 flex-col md:flex-row">
                            <div className="flex-1 bg-red-950/20 border border-red-900/40 p-4 rounded text-center">
                                <h3 className="text-red-500 font-serif uppercase tracking-widest mb-2 font-bold">Bouton « Soif »</h3>
                                <p className="text-xs text-stone-400">
                                    Ce bouton ouvre une interface vous permettant de dépenser une quantité précise de Vitae. À chaque usage de vos pouvoirs, vous devez manuellement payer le coût en sang. Plus votre réserve baisse, plus la Bête se rapproche, imposant des contraintes croissantes sur votre RP.
                                </p>
                            </div>
                            <div className="flex-1 bg-green-950/20 border border-green-900/40 p-4 rounded text-center">
                                <h3 className="text-green-600 font-serif uppercase tracking-widest mb-2 font-bold">Bouton « Se nourrir »</h3>
                                <p className="text-xs text-stone-400">
                                    Restaure intégralement votre réserve de Vitae à son maximum. Note : pour un vampire ancien, cette plénitude n'est que physique, la faim de l'âme ne s'apaise jamais totalement.
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
                    <div className="mb-4">
                        <p className="leading-relaxed text-stone-400">
                            Tous les vampires disposent d'une <strong className="text-stone-200">réserve de Vitae</strong>, dont la capacité augmente avec la puissance de sang. Cette réserve se vide à mesure que vous l'utilisez.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg">Utilisation des Disciplines</h3>
                            <p className="text-sm text-stone-500">Activez vos pouvoirs surnaturels. Le coût (généralement <strong className="text-stone-300">1, 3 ou 9 Vitae</strong>) est détaillé dans l'onglet Disciplines.</p>
                        </div>

                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg">Exploits Physiques Surhumains</h3>
                            <p className="text-sm text-stone-500 mb-2">Déployez momentanément une puissance extraordinaire pour dépasser vos limites physiques : envoyer valser une voiture, sauter un mur de 4 mètres, courir plus vite qu'une moto, augmenter vos sens à l'extrême, etc. </p>
                            <p className="text-sm text-stone-500"><strong className="text-red-400">Coût : 3 points de Vitae</strong> pour une seule action ponctuelle.</p>
                        </div>

                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg">Résistance Mentale</h3>
                            <p className="text-sm text-stone-500">Repoussez les assauts ciblant votre esprit en brûlant votre sang. Voir section V pour les règles détaillées.</p>
                        </div>

                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg">Régénération</h3>
                            <p className="text-sm text-stone-500 mb-2">Le corps mort d'un vampire ne régénère rien sans Vitae.</p>
                            <ul className="text-sm text-stone-500 space-y-2">
                                <li className="flex justify-between border-b border-stone-800 pb-1"><span>Blessures Mineures</span> <span className="text-red-500 font-bold">1 Vitae</span></li>
                                <li className="flex justify-between border-b border-stone-800 pb-1"><span>Blessures Graves</span> <span className="text-red-500 font-bold">3 Vitae</span></li>
                                <li className="flex justify-between"><span>Blessures Majeures (démembrement)</span> <span className="text-red-500 font-bold">9 Vitae</span></li>
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

                    <p className="leading-relaxed text-stone-400 mb-4">
                        La <strong className="text-stone-200">Puissance de Sang</strong> (BP) mesure l'épaisseur et la puissance mystique de votre sang.
                    </p>

                    <h3 className="font-serif text-lg text-stone-300 mb-2">Capacité en Vitae par Rang</h3>
                    <p className="text-sm text-stone-500 mb-4">Votre rang détermine la taille de votre réservoir :</p>

                    <div className="overflow-hidden rounded-lg border border-stone-800 mb-8 bg-stone-900/50">
                        <table className="w-full text-left text-sm text-stone-400">
                            <thead className="bg-stone-900 text-stone-200 font-serif uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Rang</th>
                                    <th className="px-4 py-3 text-right">Réserve Max</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                <tr className="bg-stone-950/30">
                                    <td className="px-4 py-2">Rang 1 (Néonate)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">5</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Rang 2 (Ancilla Mineur)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">8</td>
                                </tr>
                                <tr className="bg-stone-950/30">
                                    <td className="px-4 py-2">Rang 3 (Ancilla Majeur)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">12</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2">Rang 4 (Ancien)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">18</td>
                                </tr>
                                <tr className="bg-stone-950/30">
                                    <td className="px-4 py-2">Rang 5 (Mathusalem)</td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">25</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-stone-900/30 p-5 rounded border border-stone-800 space-y-4">
                        <h3 className="font-serif text-lg text-stone-300">Progression de la Puissance</h3>
                        <p className="text-sm text-stone-500">Le sang s'épaissit par l'expérience et le temps.</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-stone-400">
                            <li><strong className="text-stone-300">Actions RP :</strong> Dans l'onglet <strong>Vitae</strong> du Vis Vitae, vous trouverez une liste d'actions spécifiques à accomplir (ex: "Créer une goule", "Gagner un duel", "Contrôler un quartier").</li>
                            <li><strong className="text-stone-300">Validation :</strong> Une fois l'action jouée en scène, cochez-la dans l'interface. Le MJ Vampire recevra une notification pour valider l'accomplissement.</li>
                            <li><strong className="text-stone-300">Saturation :</strong> Chaque action validée ajoute des points de saturation à votre sang.</li>
                            <li><strong className="text-stone-300">Mutation (Incubation) :</strong> Lorsque vous atteignez le seuil requis pour le rang suivant, votre sang ne change pas instantanément. Il entre dans une phase de <strong>mutation</strong>. Vous devrez attendre la nuit suivante ("Incubation") pour que votre physiologie s'adapte et que votre Puissance de Sang augmente effectivement.</li>
                        </ol>
                    </div>

                    <div className="bg-red-950/10 p-5 rounded border border-red-900/20 mt-6 space-y-4">
                        <h3 className="font-serif text-lg text-red-500 mb-2">Résistance Mentale et Hiérarchie</h3>
                        <p className="text-sm text-stone-400">
                            Pour toutes les disciplines ciblant l'esprit ou la volonté (Domination, Présence...), la Puissance de Sang est la règle fondamentale.
                        </p>

                        <div className="space-y-4 text-sm text-stone-400">
                            <div>
                                <strong className="text-stone-300 block mb-1">1. Immunité Absolue</strong>
                                Un vampire ne peut <strong className="text-stone-200">jamais</strong> affecter mentalement un vampire d'une Puissance de Sang supérieure à la sienne.
                            </div>

                            <div>
                                <strong className="text-stone-300 block mb-1">2. Affrontement entre égaux</strong>
                                À puissance égale, les disciplines fonctionnent normalement. La victime peut dépenser de la Vitae pour résister.
                            </div>

                            <div>
                                <strong className="text-stone-300 block mb-1">3. Résistance par la Vitae</strong>
                                <p className="mb-2">Tout vampire peut dépenser de la Vitae pour repousser une discipline mentale d'un adversaire de rang égal ou inférieur. Le coût augmente drastiquement selon l'écart de puissance.</p>
                                <div className="bg-black/20 p-2 rounded border border-red-900/30 inline-block mb-2">
                                    <strong className="text-red-400">Formule :</strong> Coût de résistance = Coût de la discipline × (Différence de rang + 1)
                                </div>
                                <ul className="list-disc list-inside pl-2 space-y-1 text-xs italic opacity-80">
                                    <li>Exemple : Un attaquant utilise Domination (Coût 3).</li>
                                    <li>Si Défenseur = Attaquant (Écart 0) → 3 Vitae pour résister</li>
                                    <li>Si Défenseur &gt; Attaquant (Écart 1) → 6 Vitae pour résister</li>
                                    <li>Si Défenseur &gt;&gt; Attaquant (Écart 2) → 9 Vitae pour résister</li>
                                </ul>
                            </div>
                        </div>

                        <p className="text-sm text-red-400/80 mt-2 font-serif bg-red-950/30 p-2 rounded">
                            <strong className="font-bold">Note :</strong> Un jeune vampire (Rang 1-2) n'aura souvent pas assez de sang pour résister à un Ancien. Dans ce cas, il n'y a pas de frénésie ou d'échappatoire : il succombe simplement à la volonté de l'Ancien, incapable de se défendre.
                        </p>
                    </div>
                </section>

                {/* VI. ALIMENTATION */}
                <section id="hunting" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700">VI. Les Règles d'Alimentation et Goules</h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <p className="text-stone-400 mb-4">Le niveau de votre réserve de Vitae dicte votre comportement de prédateur et votre relation avec vos serviteurs.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-serif text-stone-300 border-b border-stone-800 pb-2 text-xl">La Création de Goules</h3>
                            <p className="text-sm text-stone-400">Créer une goule est un acte d'asservissement intime.</p>
                            <ul className="text-sm text-stone-400 space-y-2 list-disc list-inside">
                                <li>Vous devez donner votre sang à un mortel au cours de <strong className="text-stone-300">trois nuits distinctes</strong>.</li>
                                <li>Le lien de sang se renforce à chaque étape. Ce n'est qu'à la troisième ingestion que la transformation physiologique et psychologique est complète.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-serif text-stone-300 border-b border-stone-800 pb-2 text-xl">Restrictions concernant les goules</h3>
                            <ul className="text-sm text-stone-400 space-y-2 list-disc list-inside">
                                <li>Vous <strong className="text-stone-300">ne pouvez pas</strong> vous nourrir sur vos propres goules. Votre sang coule dans leurs veines ; boire d'elles reviendrait à boire votre propre sang dilué, ce qui ne nourrit pas.</li>
                                <li>Vous <strong className="text-stone-300">pouvez</strong> vous nourrir sur les goules d'autres vampires, mais cela leur retire immédiatement toutes leurs capacités surnaturelles et brise le lien qui les unit à leur maître.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <h3 className="font-serif text-stone-300 text-xl">Alimentation selon votre niveau de Vitae</h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 bg-stone-900/40 rounded border border-stone-800/50">
                                <div className="w-24 text-center font-bold text-green-500 font-mono text-lg shrink-0">100-80%</div>
                                <div>
                                    <strong className="text-green-400 block mb-1">Réserve Pleine</strong>
                                    <span className="text-sm text-stone-400">Nourrissez-vous en off, entre deux scènes, sans mise en scène particulière. Vous êtes calme.</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-stone-900/40 rounded border border-stone-800/50">
                                <div className="w-24 text-center font-bold text-yellow-500 font-mono text-lg shrink-0">80-40%</div>
                                <div>
                                    <strong className="text-yellow-400 block mb-1">Faim Croissante</strong>
                                    <span className="text-sm text-stone-400">Alimentation en off possible, mais une scène est <strong className="text-stone-300">fortement suggérée</strong>. La compulsion de votre clan est présente et commence à être visible par les autres dans votre comportement (tics, obsessions, regards).</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-red-950/20 border border-red-900/30 rounded">
                                <div className="w-24 text-center font-bold text-red-500 font-mono text-lg shrink-0">&lt; 40%</div>
                                <div>
                                    <strong className="text-red-400 block mb-1">Danger Critique</strong>
                                    <span className="text-sm text-stone-400">Alimentation en scène <strong className="uppercase text-red-500">OBLIGATOIRE</strong>. La Bête prend le contrôle : vous viderez intégralement votre victime de son sang, provoquant sa mort dans l'acte du Baiser. La subtilité n'est plus une option.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-stone-900 p-6 rounded border border-stone-800">
                        <h3 className="font-serif text-stone-300 text-xl mb-4">Les Scènes de Chasse</h3>
                        <p className="text-sm text-stone-400 mb-2">Une scène de Chasse = rechercher un PNJ pour vous nourrir.</p>
                        <ul className="text-sm text-stone-400 space-y-2 list-disc list-inside">
                            <li>Possible sans MJ — vous pouvez incarner les PNJ vous-même.</li>
                            <li><strong className="text-stone-300">Obligatoire :</strong> annoncer votre chasse dans le salon <em>Venatio</em>.</li>
                        </ul>
                        <p className="text-sm text-stone-500 mt-2 italic">Cette annonce permet aux autres joueurs ou MJ de rejoindre la scène s'ils le souhaitent.</p>
                    </div>
                </section>

            </div>
        </div>
    );
}
