// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import React from 'react';
import { ScrollText, Droplet, Book, Users, Skull, Activity, Shield, Crown, FileText, Sparkles } from 'lucide-react';

export default function RulesTab({ setActiveTab }) {
    useSiteContent();
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
                <h1 className="text-4xl font-serif text-stone-200"><SiteText contentKey="vampire.text.01326" /></h1>
                <p className="text-stone-500 italic"><SiteText contentKey="vampire.text.01327" /></p>
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
                        <span className="text-sm font-serif text-stone-400 group-hover:text-stone-200 uppercase tracking-wider">{displayText("vampire", item.label)}</span>
                    </button>
                ))}
            </div>

            {/* CONTENU */}
            <div className="space-y-16 text-stone-300">

                {/* I. OUTILS NARRATIFS */}
                <section id="tools" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700"><SiteText contentKey="vampire.text.01328" /></h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="space-y-4">
                        <p className="leading-relaxed"><SiteText contentKey="vampire.text.01329" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01330" /></strong> (<code className="bg-stone-900 px-1 py-0.5 rounded text-red-400 text-sm">{siteText("vampire.text.01331")}</code><SiteText contentKey="vampire.text.01332" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01333" /></strong><SiteText contentKey="vampire.text.01334" /></p>
                        <p className="leading-relaxed"><SiteText contentKey="vampire.text.01329" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01333" /></strong><SiteText contentKey="vampire.text.01335" /></p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                            <button type="button"
                                onClick={() => setActiveTab('character')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><FileText size={16} /><SiteText contentKey="vampire.text.01336" /></h3>
                                <p className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01337" /><em><SiteText contentKey="vampire.text.01338" /></em>.</p>
                            </button>

                            <button type="button"
                                onClick={() => setActiveTab('sheet')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Droplet size={16} /><SiteText contentKey="vampire.text.01339" /></h3>
                                <p className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01340" /></p>
                            </button>

                            <button type="button"
                                onClick={() => setActiveTab('disciplines')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Sparkles size={16} /><SiteText contentKey="vampire.text.01341" /></h3>
                                <p className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01342" /></p>
                            </button>

                            <button type="button"
                                onClick={() => setActiveTab('rituals')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Book size={16} /><SiteText contentKey="vampire.text.01343" /></h3>
                                <p className="text-sm text-stone-400"><strong><SiteText contentKey="vampire.text.01344" /></strong><SiteText contentKey="vampire.text.01345" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01346" /></strong><SiteText contentKey="vampire.text.01347" /></p>
                            </button>

                            <button type="button"
                                onClick={() => setActiveTab('ghouls')}
                                className="bg-stone-900/30 border border-stone-800 p-4 rounded cursor-pointer hover:border-red-900/30 hover:bg-stone-900/50 transition-all"
                            >
                                <h3 className="text-red-500 font-serif mb-2 flex items-center gap-2"><Users size={16} /><SiteText contentKey="vampire.text.01348" /></h3>
                                <p className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01349" /></p>
                            </button>
                        </div>
                    </div>
                </section>

                {/* II. TERRITOIRE */}
                <section id="territory" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700"><SiteText contentKey="vampire.text.01350" /></h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>
                    <div className="bg-stone-900/20 p-6 rounded border-l-4 border-stone-700">
                        <p className="text-stone-300 mb-4 font-serif text-lg"><SiteText contentKey="vampire.text.01351" /><strong className="text-stone-100"><SiteText contentKey="vampire.text.01352" /></strong><SiteText contentKey="vampire.text.01353" /></p>
                        <div className="space-y-4 text-stone-400 text-sm leading-relaxed">
                            <p><SiteText contentKey="vampire.text.01354" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01355" /></strong><SiteText contentKey="vampire.text.01356" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01357" /></strong><SiteText contentKey="vampire.text.01358" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01359" /></strong><SiteText contentKey="vampire.text.01360" /></p>
                            <p><SiteText contentKey="vampire.text.01361" /></p>
                            <p><strong className="text-stone-300"><SiteText contentKey="vampire.text.01362" /></strong><SiteText contentKey="vampire.text.01363" /></p>
                            <p><strong className="text-stone-300"><SiteText contentKey="vampire.text.01364" /></strong><SiteText contentKey="vampire.text.01365" /></p>
                            <p><strong className="text-stone-300"><SiteText contentKey="vampire.text.01366" /></strong><SiteText contentKey="vampire.text.01367" /></p>
                        </div>
                    </div>
                </section>

                {/* III. GESTION DE LA SOIF */}
                <section id="thirst" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700"><SiteText contentKey="vampire.text.01368" /></h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>
                    <div className="space-y-4">
                        <p className="leading-relaxed"><SiteText contentKey="vampire.text.01369" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01330" /></strong><SiteText contentKey="vampire.text.01370" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01371" /></strong>.
                        </p>
                        <div className="flex gap-6 mt-6 flex-col md:flex-row">
                            <div className="flex-1 bg-red-950/20 border border-red-900/40 p-4 rounded text-center">
                                <h3 className="text-red-500 font-serif uppercase tracking-widest mb-2 font-bold"><SiteText contentKey="vampire.text.01372" /></h3>
                                <p className="text-xs text-stone-400"><SiteText contentKey="vampire.text.01373" /></p>
                            </div>
                            <div className="flex-1 bg-green-950/20 border border-green-900/40 p-4 rounded text-center">
                                <h3 className="text-green-600 font-serif uppercase tracking-widest mb-2 font-bold"><SiteText contentKey="vampire.text.01374" /></h3>
                                <p className="text-xs text-stone-400"><SiteText contentKey="vampire.text.01375" /></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* IV. UTILISATION DE LA VITAE */}
                <section id="vitae" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700"><SiteText contentKey="vampire.text.01376" /></h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>
                    <div className="mb-4">
                        <p className="leading-relaxed text-stone-400"><SiteText contentKey="vampire.text.01377" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01378" /></strong><SiteText contentKey="vampire.text.01379" /></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg"><SiteText contentKey="vampire.text.01380" /></h3>
                            <p className="text-sm text-stone-500"><SiteText contentKey="vampire.text.01381" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01382" /></strong><SiteText contentKey="vampire.text.01383" /></p>
                        </div>

                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg"><SiteText contentKey="vampire.text.01384" /></h3>
                            <p className="text-sm text-stone-500 mb-2"><SiteText contentKey="vampire.text.01385" /></p>
                            <p className="text-sm text-stone-500"><strong className="text-red-400"><SiteText contentKey="vampire.text.01386" /></strong><SiteText contentKey="vampire.text.01387" /></p>
                        </div>

                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg"><SiteText contentKey="vampire.text.01388" /></h3>
                            <p className="text-sm text-stone-500"><SiteText contentKey="vampire.text.01389" /></p>
                        </div>

                        <div className="bg-stone-900 p-6 rounded border border-stone-800 hover:border-stone-700 transition-colors">
                            <h3 className="text-stone-200 font-serif mb-2 text-lg"><SiteText contentKey="vampire.text.01390" /></h3>
                            <p className="text-sm text-stone-500 mb-2"><SiteText contentKey="vampire.text.01391" /></p>
                            <ul className="text-sm text-stone-500 space-y-2">
                                <li className="flex justify-between border-b border-stone-800 pb-1"><span><SiteText contentKey="vampire.text.01392" /></span> <span className="text-red-500 font-bold"><SiteText contentKey="vampire.text.01393" /></span></li>
                                <li className="flex justify-between border-b border-stone-800 pb-1"><span><SiteText contentKey="vampire.text.01394" /></span> <span className="text-red-500 font-bold"><SiteText contentKey="vampire.text.01395" /></span></li>
                                <li className="flex justify-between"><span><SiteText contentKey="vampire.text.01396" /></span> <span className="text-red-500 font-bold"><SiteText contentKey="vampire.text.01397" /></span></li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* V. PUISSANCE DE SANG */}
                <section id="bloodpotency" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700"><SiteText contentKey="vampire.text.01398" /></h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <p className="leading-relaxed text-stone-400 mb-4"><SiteText contentKey="vampire.text.01399" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01400" /></strong><SiteText contentKey="vampire.text.01401" /></p>

                    <h3 className="font-serif text-lg text-stone-300 mb-2"><SiteText contentKey="vampire.text.01402" /></h3>
                    <p className="text-sm text-stone-500 mb-4"><SiteText contentKey="vampire.text.01403" /></p>

                    <div className="overflow-hidden rounded-lg border border-stone-800 mb-8 bg-stone-900/50">
                        <table className="w-full text-left text-sm text-stone-400">
                            <thead className="bg-stone-900 text-stone-200 font-serif uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3"><SiteText contentKey="vampire.text.01404" /></th>
                                    <th className="px-4 py-3 text-right"><SiteText contentKey="vampire.text.01405" /></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                <tr className="bg-stone-950/30">
                                    <td className="px-4 py-2"><SiteText contentKey="vampire.text.01406" /></td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">5</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2"><SiteText contentKey="vampire.text.01407" /></td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">8</td>
                                </tr>
                                <tr className="bg-stone-950/30">
                                    <td className="px-4 py-2"><SiteText contentKey="vampire.text.01408" /></td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">12</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2"><SiteText contentKey="vampire.text.01409" /></td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">18</td>
                                </tr>
                                <tr className="bg-stone-950/30">
                                    <td className="px-4 py-2"><SiteText contentKey="vampire.text.01410" /></td>
                                    <td className="px-4 py-2 text-right text-red-500 font-bold">25</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-stone-900/30 p-5 rounded border border-stone-800 space-y-4">
                        <h3 className="font-serif text-lg text-stone-300"><SiteText contentKey="vampire.text.01411" /></h3>
                        <p className="text-sm text-stone-500"><SiteText contentKey="vampire.text.01412" /></p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-stone-400">
                            <li><strong className="text-stone-300"><SiteText contentKey="vampire.text.01413" /></strong><SiteText contentKey="vampire.text.01414" /><strong><SiteText contentKey="vampire.text.01415" /></strong><SiteText contentKey="vampire.text.01416" /></li>
                            <li><strong className="text-stone-300"><SiteText contentKey="vampire.text.01417" /></strong><SiteText contentKey="vampire.text.01418" /></li>
                            <li><strong className="text-stone-300"><SiteText contentKey="vampire.text.01419" /></strong><SiteText contentKey="vampire.text.01420" /></li>
                            <li><strong className="text-stone-300"><SiteText contentKey="vampire.text.01421" /></strong><SiteText contentKey="vampire.text.01422" /></li>
                        </ol>
                    </div>

                    <div className="bg-red-950/10 p-5 rounded border border-red-900/20 mt-6 space-y-4">
                        <h3 className="font-serif text-lg text-red-500 mb-2"><SiteText contentKey="vampire.text.01423" /></h3>
                        <p className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01424" /></p>

                        <div className="space-y-4 text-sm text-stone-400">
                            <div>
                                <strong className="text-stone-300 block mb-1"><SiteText contentKey="vampire.text.01425" /></strong><SiteText contentKey="vampire.text.01426" /><strong className="text-stone-200"><SiteText contentKey="vampire.text.01427" /></strong><SiteText contentKey="vampire.text.01428" /></div>

                            <div>
                                <strong className="text-stone-300 block mb-1"><SiteText contentKey="vampire.text.01429" /></strong><SiteText contentKey="vampire.text.01430" /></div>

                            <div>
                                <strong className="text-stone-300 block mb-1"><SiteText contentKey="vampire.text.01431" /></strong>
                                <p className="mb-2"><SiteText contentKey="vampire.text.01432" /></p>
                                <div className="bg-black/20 p-2 rounded border border-red-900/30 inline-block mb-2">
                                    <strong className="text-red-400"><SiteText contentKey="vampire.text.01433" /></strong><SiteText contentKey="vampire.text.01434" /></div>
                                <ul className="list-disc list-inside pl-2 space-y-1 text-xs italic opacity-80">
                                    <li><SiteText contentKey="vampire.text.01435" /></li>
                                    <li><SiteText contentKey="vampire.text.01436" /></li>
                                    <li><SiteText contentKey="vampire.text.01437" /></li>
                                    <li><SiteText contentKey="vampire.text.01438" /></li>
                                </ul>
                            </div>
                        </div>

                        <p className="text-sm text-red-400/80 mt-2 font-serif bg-red-950/30 p-2 rounded">
                            <strong className="font-bold"><SiteText contentKey="vampire.text.01439" /></strong><SiteText contentKey="vampire.text.01440" /></p>
                    </div>
                </section>

                {/* VI. ALIMENTATION */}
                <section id="hunting" className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-serif text-red-700"><SiteText contentKey="vampire.text.01441" /></h2>
                        <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <p className="text-stone-400 mb-4"><SiteText contentKey="vampire.text.01442" /></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-serif text-stone-300 border-b border-stone-800 pb-2 text-xl"><SiteText contentKey="vampire.text.01443" /></h3>
                            <p className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01444" /></p>
                            <ul className="text-sm text-stone-400 space-y-2 list-disc list-inside">
                                <li><SiteText contentKey="vampire.text.01445" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01446" /></strong>.</li>
                                <li><SiteText contentKey="vampire.text.01447" /></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-serif text-stone-300 border-b border-stone-800 pb-2 text-xl"><SiteText contentKey="vampire.text.01448" /></h3>
                            <ul className="text-sm text-stone-400 space-y-2 list-disc list-inside">
                                <li><SiteText contentKey="vampire.text.01449" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01450" /></strong><SiteText contentKey="vampire.text.01451" /></li>
                                <li><SiteText contentKey="vampire.text.01449" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01452" /></strong><SiteText contentKey="vampire.text.01453" /></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <h3 className="font-serif text-stone-300 text-xl"><SiteText contentKey="vampire.text.01454" /></h3>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 bg-stone-900/40 rounded border border-stone-800/50">
                                <div className="w-24 text-center font-bold text-green-500 font-mono text-lg shrink-0">100-80%</div>
                                <div>
                                    <strong className="text-green-400 block mb-1"><SiteText contentKey="vampire.text.01455" /></strong>
                                    <span className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01456" /></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-stone-900/40 rounded border border-stone-800/50">
                                <div className="w-24 text-center font-bold text-yellow-500 font-mono text-lg shrink-0">80-40%</div>
                                <div>
                                    <strong className="text-yellow-400 block mb-1"><SiteText contentKey="vampire.text.01457" /></strong>
                                    <span className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01458" /><strong className="text-stone-300"><SiteText contentKey="vampire.text.01459" /></strong><SiteText contentKey="vampire.text.01460" /></span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-red-950/20 border border-red-900/30 rounded">
                                <div className="w-24 text-center font-bold text-red-500 font-mono text-lg shrink-0">&lt; 40%</div>
                                <div>
                                    <strong className="text-red-400 block mb-1"><SiteText contentKey="vampire.text.01461" /></strong>
                                    <span className="text-sm text-stone-400"><SiteText contentKey="vampire.text.01462" /><strong className="uppercase text-red-500"><SiteText contentKey="vampire.text.01463" /></strong><SiteText contentKey="vampire.text.01464" /></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-stone-900 p-6 rounded border border-stone-800">
                        <h3 className="font-serif text-stone-300 text-xl mb-4"><SiteText contentKey="vampire.text.01465" /></h3>
                        <p className="text-sm text-stone-400 mb-2"><SiteText contentKey="vampire.text.01466" /></p>
                        <ul className="text-sm text-stone-400 space-y-2 list-disc list-inside">
                            <li><SiteText contentKey="vampire.text.01467" /></li>
                            <li><strong className="text-stone-300"><SiteText contentKey="vampire.text.01468" /></strong><SiteText contentKey="vampire.text.01469" /><em><SiteText contentKey="vampire.text.01470" /></em>.</li>
                        </ul>
                        <p className="text-sm text-stone-500 mt-2 italic"><SiteText contentKey="vampire.text.01471" /></p>
                    </div>
                </section>

            </div>
        </div>
    );
}
