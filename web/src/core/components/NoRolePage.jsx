import { useNavigate } from 'react-router-dom';

/**
 * Page immersive affichée quand l'utilisateur n'a aucun rôle de jeu
 * (ni Vampire ni Loup-Garou). Style World of Darkness, atmosphérique.
 */
export default function NoRolePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('discord_token');
        navigate('/');
        window.location.reload();
    };

    return (
        <div className="no-role-page">
            <div className="no-role-fog" />
            <div className="no-role-content">
                <div className="no-role-symbol">⛧</div>
                <h1 className="no-role-title">Les ténèbres te sont fermées</h1>
                <p className="no-role-subtitle">
                    Ce lieu n'est pas accessible aux mortels ordinaires.
                </p>
                <div className="no-role-divider">
                    <span>✦</span>
                </div>
                <button onClick={handleLogout} className="no-role-logout">
                    Quitter
                </button>
            </div>

            <style>{`
        .no-role-page {
          min-height: 100vh;
          background: #0c0a09;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .no-role-fog {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(120, 0, 0, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(80, 0, 120, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
          animation: fogPulse 8s ease-in-out infinite;
        }

        @keyframes fogPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .no-role-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 420px;
          padding: 2rem;
          animation: fadeIn 1.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .no-role-symbol {
          font-size: 3.5rem;
          color: #7f1d1d;
          margin-bottom: 1.5rem;
          opacity: 0.7;
          animation: symbolGlow 4s ease-in-out infinite;
        }

        @keyframes symbolGlow {
          0%, 100% { opacity: 0.5; text-shadow: 0 0 20px rgba(127, 29, 29, 0.3); }
          50% { opacity: 0.8; text-shadow: 0 0 40px rgba(127, 29, 29, 0.5); }
        }

        .no-role-title {
          font-family: 'Cinzel', 'Georgia', serif;
          font-size: 1.75rem;
          color: #a8a29e;
          margin-bottom: 1rem;
          letter-spacing: 0.05em;
          font-weight: 400;
        }

        .no-role-subtitle {
          color: #78716c;
          font-size: 0.95rem;
          line-height: 1.6;
          font-style: italic;
        }

        .no-role-divider {
          margin: 2rem 0;
          color: #44403c;
          font-size: 0.75rem;
          letter-spacing: 1em;
        }

        .no-role-logout {
          background: transparent;
          border: 1px solid #44403c;
          color: #78716c;
          padding: 0.5rem 2rem;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .no-role-logout:hover {
          border-color: #7f1d1d;
          color: #a8a29e;
          background: rgba(127, 29, 29, 0.1);
        }
      `}</style>
        </div>
    );
}
