import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import RenownGuide from '../components/RenownGuide';
import RenownCard from '../components/RenownCard';
import { useRenown } from '../hooks/useRenown';

import WerewolfLayout from '../components/WerewolfLayout';

export default function WerewolfRenownPage() {
    // ... hooks ...

    // ... render ...
    return (
        <WerewolfLayout>
            <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
                <header>
                    <h1 className="text-3xl font-serif font-bold text-stone-100 flex items-center gap-3">
                        <span className="text-amber-600">✦</span>
                        Hauts Faits & Renommée
                    </h1>
                    <p className="text-stone-500 mt-2 max-w-2xl">
                        Consultez vos actes de gloire, d'honneur et de sagesse reconnus par les esprits et la nation Garou.
                    </p>
                </header>

                {error && (
                    <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <RenownGuide />

                {isEmpty && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-stone-900/80 to-stone-950 border border-stone-800 p-8 rounded-xl text-center mb-8"
                    >
                        <h3 className="font-serif text-xl text-stone-300 mb-2">Votre légende commence ici</h3>
                        <p className="text-stone-500 max-w-lg mx-auto">
                            Vous n'avez pas encore de hauts faits validés. Accomplissez des actes dignes de Gaia et faites-les reconnaître pour gagner en Renommée.
                        </p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[500px]">
                    <RenownCard
                        type="glory"
                        score={scores.glory}
                        items={renownData.glory}
                    />
                    <RenownCard
                        type="honor"
                        score={scores.honor}
                        items={renownData.honor}
                    />
                    <RenownCard
                        type="wisdom"
                        score={scores.wisdom}
                        items={renownData.wisdom}
                    />
                </div>
            </div>
        </WerewolfLayout>
    );
}
