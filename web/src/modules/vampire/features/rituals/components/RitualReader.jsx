import CatalogText from '../../../../../core/content/CatalogText';
// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../../../core/content/store';
import SiteText from '../../../../../core/content/SiteText';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, BookOpen, Quote, FlaskConical, Scroll, Clock, Skull, Droplets } from 'lucide-react';
import { getDisciplineName } from '../../../../../utils/translations';

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
    useSiteContent();
    const prefersReducedMotion = useReducedMotion();
    if (!ritual) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-stone-500 bg-[#1c1917] border-l border-[#292524]">
                <BookOpen size={48} className="mb-4 opacity-50" />
                <p className="font-serif italic text-lg opacity-60"><SiteText contentKey="vampire.text.01498" /></p>
            </div>
        );
    }

    // Custom renderers for React Markdown
    const components = {
        // Headers - Playfair Display
        h1: ({ node: _node, ...props }) => <h1 className="font-serif text-3xl text-red-600 mt-6 mb-4 leading-tight" {...props} />,
        h2: ({ node: _node, ...props }) => <h2 className="font-serif text-2xl text-red-500 mt-5 mb-3 border-b border-red-900/30 pb-1" {...props} />,
        h3: ({ node: _node, ...props }) => <h3 className="font-serif text-xl text-red-400 mt-4 mb-2" {...props} />,
        h4: ({ node: _node, ...props }) => <h4 className="font-serif text-lg text-stone-300 mt-4 mb-2 font-bold" {...props} />,

        // Paragraphs - Inter & Drop Cap logic
        p: ({ node: _node, children, ...props }) => {
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
        strong: ({ node: _node, ...props }) => <strong className="font-bold text-stone-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]" {...props} />,
        b: ({ node: _node, ...props }) => <strong className="font-bold text-stone-100 drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]" {...props} />,

        // Blockquotes - Handwriting style
        blockquote: ({ node: _node, ...props }) => (
            <blockquote className="my-6 pl-6 border-l-2 border-red-900/50 italic text-stone-400 font-hand text-xl relative">
                <Quote size={20} className="absolute -left-6 -top-4 text-red-900/40" />
                {props.children}
            </blockquote>
        ),

        // Lists
        ul: ({ node: _node, ...props }) => <ul className="list-disc list-inside mb-4 text-stone-300 marker:text-red-800" {...props} />,
        ol: ({ node: _node, ...props }) => <ol className="list-decimal list-inside mb-4 text-stone-300 marker:text-red-800" {...props} />,
    };

    // Respect reduced motion preference for WCAG accessibility


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
                        <h2 className="font-serif text-3xl text-red-600 leading-none mb-2"><CatalogText scope={"vampire"} value={ritual.name} /></h2>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-stone-500 font-serif">
                            <span><SiteText contentKey="vampire.text.01499" /><CatalogText scope={"vampire"} value={ritual.level} /></span>
                            <span className="w-1 h-1 rounded-full bg-red-900"></span>
                            <span><CatalogText scope={"vampire"} value={getDisciplineName(ritual.discipline)} /></span>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-red-900/20 rounded-full transition-colors text-stone-500 hover:text-red-400"
                            aria-label={siteText("vampire.text.01500")}
                        >
                            <X size={24} aria-hidden="true" />
                        </button>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar">
                    <div className="max-w-5xl mx-auto break-words [overflow-wrap:anywhere]">
                        <ReactMarkdown components={components} rehypePlugins={[rehypeSanitize]} skipHtml>
                            {displayText("vampire", ritual.description_md || ritual.description || siteText("vampire.text.01501"))}
                        </ReactMarkdown>

                        {/* Extended Data Sections */}
                        <div className="mt-8 space-y-6 border-t border-stone-800 pt-8">

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ritual.duration && (
                                    <div className="bg-stone-900/40 p-3 rounded border border-stone-800 flex items-center gap-3">
                                        <div className="p-2 bg-stone-950 rounded-full text-amber-600/70 border border-amber-900/20">
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-stone-500 block"><SiteText contentKey="vampire.text.01502" /></span>
                                            <span className="text-stone-300 font-serif text-sm"><CatalogText scope={"vampire"} value={ritual.duration} /></span>
                                        </div>
                                    </div>
                                )}

                                <div className="bg-stone-900/40 p-3 rounded border border-stone-800 flex items-center gap-3">
                                    <div className="p-2 bg-stone-950 rounded-full text-red-600/70 border border-red-900/20">
                                        <Droplets size={16} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] uppercase tracking-widest text-stone-500 block"><SiteText contentKey="vampire.text.01503" /></span>
                                        <span className="text-stone-300 font-serif text-sm"><SiteText contentKey="vampire.text.01504" /></span>
                                    </div>
                                </div>
                            </div>

                            {/* Ingredients */}
                            {ritual.ingredients && (
                                <div className="relative pl-6 border-l-2 border-amber-900/30">
                                    <h3 className="flex items-center gap-2 text-amber-600 font-serif text-lg mb-2">
                                        <FlaskConical size={18} />
                                        <span><SiteText contentKey="vampire.text.01505" /></span>
                                    </h3>
                                    <p className="text-stone-400 italic text-sm leading-relaxed">
                                        <CatalogText scope={"vampire"} value={ritual.ingredients} />
                                    </p>
                                </div>
                            )}

                            {/* Steps */}
                            {ritual.steps && ritual.steps.length > 0 && (
                                <div className="bg-stone-950/30 border border-stone-800 p-6 rounded-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Scroll size={100} />
                                    </div>

                                    <h3 className="font-serif text-xl text-stone-200 mb-6 flex items-center gap-3 border-b border-stone-800 pb-2">
                                        <Scroll size={20} className="text-stone-500" /><SiteText contentKey="vampire.text.01506" /></h3>

                                    <ol className="space-y-4">
                                        {ritual.steps.map((step, idx) => (
                                            <li key={idx} className="flex gap-4 group">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-900 border border-stone-700 text-stone-500 font-serif text-sm group-hover:border-red-900 group-hover:text-red-500 transition-colors">
                                                    {idx + 1}
                                                </span>
                                                <p className="text-stone-300/90 text-sm leading-relaxed pt-1.5 border-b border-stone-800/50 pb-4 w-full group-last:border-0">
                                                    {displayText("vampire", step).replace(/^\d+\.\s*/, '') /* Remove numbering after resolving the editorial text */}
                                                </p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RitualReader;
