import { Routes, Route } from 'react-router-dom';
import SheetPage from './pages/SheetPage';
import ClanSelectionPage from './pages/ClanSelectionPage';

export default function VampireRoutes() {
    return (
        <Routes>
            <Route index element={<SheetPage />} />
            <Route path="clan-selection" element={<ClanSelectionPage />} />
        </Routes>
    );
}
