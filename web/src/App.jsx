import { BrowserRouter } from 'react-router-dom';
import AppRouter from './core/router/AppRouter';
import ContentController from './core/content/ContentController';

// Le basename doit correspondre au "base" dans vite.config.js pour GitHub Pages
const basename = import.meta.env.BASE_URL || '/the-world-of-darkness/';

function App() {
  return (
    <BrowserRouter basename={basename}>
      <AppRouter />
      <ContentController />
    </BrowserRouter>
  );
}

export default App;
