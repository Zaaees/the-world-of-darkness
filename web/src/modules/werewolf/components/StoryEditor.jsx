import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, List, Maximize2, Minimize2, X, Check, Save } from 'lucide-react';

/**
 * StoryEditor Component
 * Un éditeur de texte enrichi (Markdown) avec sauvegarde automatique et mode Focus.
 */
const StoryEditor = ({ initialValue, onSave, onCancel, autoSaveDelay = 5000 }) => {
    const [content, setContent] = useState(initialValue || '');
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
    const textareaRef = useRef(null);
    const lastSavedContent = useRef(initialValue || '');
    // Sync state with prop if it changes externally
    useEffect(() => {
        if (initialValue !== undefined && initialValue !== content && lastSavedContent.current === content) {
            setContent(initialValue);
            lastSavedContent.current = initialValue;
        }
    }, [initialValue, content]);

    // Logique de sauvegarde automatique (5s après modification)
    // Logique de sauvegarde automatique (Check toutes les 5s)
    useEffect(() => {
        const interval = setInterval(async () => {
            if (content !== lastSavedContent.current && saveStatus !== 'saving') {
                setSaveStatus('saving');
                try {
                    const result = await onSave(content);
                    lastSavedContent.current = content;

                    if (result && result.synced) {
                        setSaveStatus('synced');
                    } else {
                        setSaveStatus('saved');
                    }
                    setTimeout(() => setSaveStatus('idle'), 3000);
                } catch (error) {
                    console.error('Erreur auto-save:', error);
                    setSaveStatus('error');
                }
            }
        }, autoSaveDelay);

        return () => clearInterval(interval);
    }, [content, saveStatus, onSave, autoSaveDelay]);

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
        setContent(newText);

        // reposition cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    return (
        <div className={`flex flex-col border border-emerald-900/40 rounded bg-stone-950 transition-all duration-300 ${isFocusMode ? 'fixed inset-0 z-50 p-6 md:p-12 bg-stone-950/98' : 'w-full h-80'}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-emerald-900/20 bg-stone-900/40">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => insertText('**', '**')}
                        className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors"
                        title="Gras"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertText('*', '*')}
                        className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors"
                        title="Italique"
                    >
                        <Italic size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => insertText('- ')}
                        className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors"
                        title="Liste"
                    >
                        <List size={18} />
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Status Indicator */}
                    <div className="text-xs font-serif italic text-stone-500 flex items-center">
                        {saveStatus === 'saving' && (
                            <>
                                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-2" />
                                En cours de sauvegarde...
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <>
                                <Check size={12} className="text-emerald-500 mr-1" />
                                <span className="text-emerald-500/80">Sauvegardé</span>
                            </>
                        )}
                        {saveStatus === 'synced' && (
                            <>
                                <Check size={12} className="text-indigo-400 mr-1" />
                                <span className="text-indigo-400/80">Synchronisé avec Discord</span>
                            </>
                        )}
                        {saveStatus === 'error' && (
                            <>
                                <X size={12} className="text-red-500 mr-1" />
                                <span className="text-red-500/80">Échec de sauvegarde</span>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition-colors"
                        title="Mode Focus"
                    >
                        {isFocusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>

                    {!isFocusMode && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-3 py-1 text-stone-500 hover:text-red-400 transition-colors text-sm"
                            title="Annuler"
                        >
                            Annuler
                        </button>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={`flex-1 w-full bg-transparent p-4 text-amber-100 font-serif leading-relaxed focus:outline-none resize-none placeholder-stone-700 ${isFocusMode ? 'text-lg md:text-xl md:max-w-4xl md:mx-auto' : 'text-base'}`}
                placeholder="Racontez votre épopée..."
                autoFocus={isFocusMode}
            />

            {/* Focus Mode Footer */}
            {isFocusMode && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setIsFocusMode(false)}
                        className="px-8 py-3 bg-stone-900 border border-amber-900/30 text-amber-200/80 rounded font-serif uppercase tracking-widest hover:bg-stone-800 hover:border-amber-600 transition-all"
                    >
                        Quitter le mode Focus
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoryEditor;
