// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Shield, Star, BookOpen, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { useRenown } from '../hooks/useRenown';

const TAB_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

const STAT_CONFIG = {
    glory: { label: 'Gloire', color: 'text-amber-500', bg: 'bg-amber-500/20', border: 'border-amber-500/30' },
    honor: { label: 'Honneur', color: 'text-stone-300', bg: 'bg-stone-300/20', border: 'border-stone-300/30' },
    wisdom: { label: 'Sagesse', color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' }
};

export default function RenownGuide() {
    useSiteContent();
    const { fetchRenownRules, authReady } = useRenown();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (!authReady) return;

        let mounted = true;

        const loadRules = async () => {
            try {
                const result = await fetchRenownRules();
                if (mounted && result.success) {
                    setData(result);
                    // Default to progress tab if we successfully loaded data
                    setActiveTab('progress');
                }
            } catch (err) {
                console.error("RenownGuide fetch error:", err);
                if (mounted) setError(err.message || siteText("werewolf.text.02572"));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadRules();

        return () => { mounted = false; };
    }, [authReady]);

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <p className="text-stone-300 leading-relaxed italic"><SiteText contentKey="werewolf.text.01625" /></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(STAT_CONFIG).map(([key, config]) => (
                    <div key={key} className={`p-4 rounded-lg border ${config.border} ${config.bg}`}>
                        <h4 className={`font-serif font-bold ${config.color} mb-2 capitalize`}>{displayText("werewolf", config.label)}</h4>
                        <p className="text-xs text-stone-400">
                            {key === 'glory' && siteText("werewolf.text.01626")}
                            {key === 'honor' && siteText("werewolf.text.01627")}
                            {key === 'wisdom' && siteText("werewolf.text.01628")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderRulesTab = () => {
        if (!data) return null;

        // Use generic keys 1-5 to show the table
        const ranks = [1, 2, 3, 4, 5];
        const myAuspice = data.my_auspice;

        return (
            <div className="space-y-4">
                <div className="bg-stone-900/40 p-4 rounded-lg border border-stone-800">
                    <h3 className="text-stone-300 font-bold mb-2 flex items-center gap-2">
                        <Info size={18} /><SiteText contentKey="werewolf.text.01629" /><span className="text-amber-500">{displayText("werewolf", myAuspice)}</span>
                    </h3>
                    <p className="text-sm text-stone-400"><SiteText contentKey="werewolf.text.01630" />{myAuspice.toUpperCase() === 'RAGABASH'
                            ? siteText("werewolf.text.01631")
                            : siteText("werewolf.text.01632")}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-stone-400">
                        <thead className="text-xs text-stone-300 uppercase bg-stone-900/60">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg"><SiteText contentKey="werewolf.text.01633" /></th>
                                <th className="px-4 py-3"><SiteText contentKey="werewolf.text.01634" /></th>
                                <th className="px-4 py-3"><SiteText contentKey="werewolf.text.01635" /></th>
                                <th className="px-4 py-3 rounded-tr-lg"><SiteText contentKey="werewolf.text.01636" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranks.map(rank => {
                                const req = data.rules[myAuspice]?.[rank];
                                if (!req) return null;

                                return (
                                    <tr key={rank} className="border-b border-stone-800 last:border-0 hover:bg-stone-800/20">
                                        <td className="px-4 py-3 font-bold text-stone-200"><SiteText contentKey="werewolf.text.01637" />{displayText("werewolf", rank)}</td>
                                        {myAuspice.toUpperCase() === 'RAGABASH' ? (
                                            <td colSpan="3" className="px-4 py-3 text-center italic text-stone-500"><SiteText contentKey="werewolf.text.01638" />{req.total}<SiteText contentKey="werewolf.text.01639" /></td>
                                        ) : (
                                            <>
                                                <td className="px-4 py-3 text-amber-500/80">{req.glory}</td>
                                                <td className="px-4 py-3 text-stone-300/80">{req.honor}</td>
                                                <td className="px-4 py-3 text-emerald-400/80">{req.wisdom}</td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderProgressTab = () => {
        if (!data) return null;

        const myRank = data.my_rank;
        const nextRank = myRank < 5 ? myRank + 1 : 5;
        const isMaxRank = myRank >= 5;

        if (isMaxRank) {
            return (
                <div className="text-center p-8 bg-amber-500/10 rounded-xl border border-amber-500/30">
                    <Star size={40} className="text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-amber-500 mb-2"><SiteText contentKey="werewolf.text.01640" /></h3>
                    <p className="text-stone-300"><SiteText contentKey="werewolf.text.01641" /></p>
                </div>
            );
        }

        const req = data.rules[data.my_auspice]?.[nextRank];
        const stats = data.my_stats;

        if (!req) return <div className="text-red-400"><SiteText contentKey="werewolf.text.01642" /></div>;

        const isRagabash = data.my_auspice.toUpperCase() === 'RAGABASH';

        // Helper for Progress Item
        const ProgressItem = ({ label, current, target, colorClass }) => {
    useSiteContent();
            const progress = Math.min(100, (current / target) * 100);
            const isMet = current >= target;

            return (
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className={`text-sm font-medium ${isMet ? 'text-stone-200' : 'text-stone-400'}`}>
                            {displayText("werewolf", label)}
                        </span>
                        <span className={`text-sm font-bold ${isMet ? 'text-green-400' : colorClass}`}>
                            {current} / {target}
                        </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${isMet ? 'bg-green-500' : colorClass.replace('text-', 'bg-')}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    {isMet && <div className="flex items-center gap-1 text-xs text-green-400 mt-1"><CheckCircle size={10} /><SiteText contentKey="werewolf.text.01643" /></div>}
                </div>
            );
        };

        return (
            <div className="bg-stone-900/40 rounded-lg p-6 border border-stone-800">
                <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-4">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-stone-500"><SiteText contentKey="werewolf.text.01644" /></span>
                        <div className="text-2xl font-serif text-stone-200"><SiteText contentKey="werewolf.text.01637" />{myRank}</div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs uppercase tracking-wider text-amber-500"><SiteText contentKey="werewolf.text.01645" /></span>
                        <div className="text-2xl font-serif text-amber-500 font-bold flex items-center gap-2"><SiteText contentKey="werewolf.text.01637" />{nextRank} <Star size={18} />
                        </div>
                    </div>
                </div>

                {isRagabash ? (
                    <ProgressItem
                        label={siteText("werewolf.text.01646")}
                        current={stats.glory + stats.honor + stats.wisdom}
                        target={req.total}
                        colorClass="text-stone-300"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ProgressItem label={siteText("werewolf.text.01634")} current={stats.glory} target={req.glory} colorClass="text-amber-500" />
                        <ProgressItem label={siteText("werewolf.text.01635")} current={stats.honor} target={req.honor} colorClass="text-stone-300" />
                        <ProgressItem label={siteText("werewolf.text.01636")} current={stats.wisdom} target={req.wisdom} colorClass="text-emerald-400" />
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-stone-800 text-center">
                    <p className="text-xs text-stone-500 italic"><SiteText contentKey="werewolf.text.01647" /></p>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full bg-stone-950/50 rounded-xl border border-stone-800 overflow-hidden mb-8 shadow-xl">
            {/* Header */}
            <div className="bg-stone-900/80 p-4 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <BookOpen className="text-amber-600" size={24} />
                    <div>
                        <h2 className="text-lg font-serif text-stone-200 font-bold"><SiteText contentKey="werewolf.text.01648" /></h2>
                        <p className="text-xs text-stone-500"><SiteText contentKey="werewolf.text.01649" /></p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-stone-950/50 p-1 rounded-lg">
                    {['general', 'rules', 'progress'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab
                                ? 'bg-stone-800 text-amber-500 shadow-sm'
                                : 'text-stone-500 hover:text-stone-300'
                                }`}
                        >
                            {tab === 'general' && siteText("werewolf.text.01650")}
                            {tab === 'rules' && siteText("werewolf.text.01651")}
                            {tab === 'progress' && siteText("werewolf.text.01652")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Content - Fixed height container to prevent layout jump or auto */}
            <div className="p-6 min-h-[300px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full text-stone-500 animate-pulse">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            <span><SiteText contentKey="werewolf.text.01653" /></span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-400 gap-2 p-6">
                        <AlertCircle size={32} />
                        <p className="font-bold"><SiteText contentKey="werewolf.text.01654" /></p>
                        <p className="text-sm text-center opacity-80">{displayText("werewolf", error)}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-sm transition-colors"
                        ><SiteText contentKey="werewolf.text.01655" /></button>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={TAB_VARIANTS}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'general' && renderGeneralTab()}
                            {activeTab === 'rules' && renderRulesTab()}
                            {activeTab === 'progress' && renderProgressTab()}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
