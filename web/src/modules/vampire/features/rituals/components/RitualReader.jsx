import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, BookOpen, Quote } from 'lucide-react';

/**
 * Recursively extracts text content from React children.
 * Handles strings, numbers, arrays, and React elements.
 */
const extractTextContent = (children) => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return String(children);
    if (children == null) return '';
    if (Array.isArray(children)) {
        return children.map(extractTextContent).join('');
    }
    if (React.isValidElement(children) && children.props?.children) {
        return extractTextContent(children.props.children);
    }
    return '';
};

const RitualReader = ({ ritual, onClose }) => {
    if (!ritual) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-500 bg-[#1c1917] border-l border-[#292524]">
                <BookOpen size={48} className="mb-4 opacity-50" />
                <p className="font-serif italic text-lg opacity-60">Sélectionnez un rituel pour étudier ses secrets...</p>
            </div>
        );
    }

    // Custom renderers for React Markdown
    const components = {
        // Headers - Playfair Display
        h1: ({ node, ...props }) => <h1 className="font-serif text-3xl text-red-600 mt-6 mb-4 leading-tight" {...props} />,
        h2: ({ node, ...props }) => <h2 className="font-serif text-2xl text-red-500 mt-5 mb-3 border-b border-red-900/30 pb-1" {...props} />,
        h3: ({ node, ...props }) => <h3 className="font-serif text-xl text-red-400 mt-4 mb-2" {...props} />,
        h4: ({ node, ...props }) => <h4 className="font-serif text-lg text-stone-300 mt-4 mb-2 font-bold" {...props} />,

        // Paragraphs - Inter & Drop Cap logic
        p: ({ node, children, ...props }) => {
            // System text check using recursive text extraction
            const textContent = extractTextContent(children);
            const isSystem = textContent.startsWith('System:') ||
                textContent.startsWith('Système:') ||
                textContent.startsWith('**System:**') ||
                textContent.startsWith('**Système:**');

            if (isSystem) {
                return (
                    <div className="my-6 p-4 bg-stone-900/80 border border-red-900/50 rounded-lg shadow-inner relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-800/50"></div>
                        <p className="font-sans text-sm text-stone-300 leading-relaxed pl-3" {...props}>
                            {children}
                        </p>
                    </div>
                );
            }

            return (
                <p className="font-body text-stone-300 mb-4 leading-relaxed first-of-type:first-letter:text-5xl first-of-type:first-letter:font-serif first-of-type:first-letter:text-red-700 first-of-type:first-letter:float-left first-of-type:first-letter:mr-3 first-of-type:first-letter:mt-[-4px]" {...props}>
                    {children}
                </p>
            );
        },

        // Emphasis - Inked style
        strong: ({ node, ...props }) => <strong className="font-bold text-stone-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]" {...props} />,
        b: ({ node, ...props }) => <strong className="font-bold text-stone-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]" {...props} />,

        // Blockquotes - Handwriting style
        blockquote: ({ node, ...props }) => (
            <blockquote className="my-6 pl-6 border-l-2 border-red-900/50 italic text-stone-400 font-hand text-xl relative">
                <Quote size={20} className="absolute -left-6 -top-4 text-red-900/40" />
                {props.children}
            </blockquote>
        ),

        // Lists
        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 text-stone-300 marker:text-red-800" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 text-stone-300 marker:text-red-800" {...props} />,
    };

    // Respect reduced motion preference for WCAG accessibility
    const prefersReducedMotion = useReducedMotion();

    // Animation variants based on motion preference
    const animationProps = prefersReducedMotion
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={ritual.id}
                {...animationProps}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                className="h-full flex flex-col bg-[#1c1917] border-l border-[#292524] relative shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-[#292524] bg-stone-950/30 flex justify-between items-start sticky top-0 z-10 backdrop-blur-sm">
                    <div>
                        <h2 className="font-serif text-3xl text-red-600 leading-none mb-2">{ritual.name}</h2>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-stone-500 font-serif">
                            <span>Niveau {ritual.level}</span>
                            <span className="w-1 h-1 rounded-full bg-red-900"></span>
                            <span>{ritual.discipline || "Rituel Incconu"}</span>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red-900/20 rounded-full transition-colors text-stone-500 hover:text-red-400"
                            aria-label="Fermer le rituel"
                        >
                            <X size={24} aria-hidden="true" />
                        </button>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
                    <div className="max-w-2xl mx-auto break-words [overflow-wrap:anywhere]">
                        <ReactMarkdown components={components}>
                            {ritual.description_md || "*Description manquante...*"}
                        </ReactMarkdown>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RitualReader;
