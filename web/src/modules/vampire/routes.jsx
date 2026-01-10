import { Routes, Route } from 'react-router-dom';
import SheetPage from './pages/SheetPage';
import ClanSelectionPage from './pages/ClanSelectionPage';
import ErrorBoundary from '../../components/ErrorBoundary';

export default function VampireRoutes() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route index element={<SheetPage />} />
                <Route path="clan-selection" element={<ClanSelectionPage />} />
            </Routes>
        </ErrorBoundary>
    );
}
