// site-content: migrated
import SiteText from '../../../core/content/SiteText';
import WerewolfLayout from './WerewolfLayout';

/**
 * Fallback de chargement avec thème Werewolf
 */
export default function WerewolfLoading() {
    return (
        <WerewolfLayout>
            <div data-testid="loading-spinner" className="min-h-screen flex items-center justify-center">
                <div className="text-emerald-400 font-serif animate-pulse"><SiteText contentKey="werewolf.text.01691" /></div>
            </div>
        </WerewolfLayout>
    );
}
