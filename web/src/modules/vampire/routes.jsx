import { Routes, Route } from 'react-router-dom';
import SheetPage from './pages/SheetPage';
import ClanSelectionPage from './pages/ClanSelectionPage';
import ErrorBoundary from '../../components/ErrorBoundary';
import './assets/vampire-theme.css';

export default function VampireRoutes() {
    return (
        <ErrorBoundary>
            <div className="vampire-ui">
                <Routes>
                    <Route index element={<SheetPage />} />
                    <Route path="clan-selection" element={<ClanSelectionPage />} />
                </Routes>
            </div>
        </ErrorBoundary>
    );
}
