import { Navigate, Outlet } from 'react-router-dom';
import useUserRoles, { WEREWOLF_ROLE_ID } from '../../../core/hooks/useUserRoles';
import WerewolfLoading from './WerewolfLoading';

/**
 * Guard Component pour protéger l'accès aux routes Werewolf.
 * Redirige les utilisateurs non autorisés.
 */
export default function RequireWerewolfRole({ children }) {
    const { isLoading, hasRole, hasVampireRole, error } = useUserRoles();

    if (isLoading) {
        return <WerewolfLoading />;
    }

    if (error) {
        // En cas d'erreur (réseau, session), on peut rediriger ou afficher une erreur
        // Pour l'instant, fail-safe vers 403 ou page d'erreur dédiée
        return <Navigate to="/403" state={{ reason: error }} replace />;
    }

    // Vérification du rôle Werewolf
    if (!hasRole(WEREWOLF_ROLE_ID)) {
        // Si c'est un Vampire -> Redirection vers son profil
        if (hasVampireRole) {
            return <Navigate to="/vampire" replace />;
        }

        // Sinon -> Accès interdit générique (ou page 403)
        return <Navigate to="/403" replace />;
    }

    // Accès autorisé
    // Si children est fourni, l'afficher, sinon Outlet pour les Layout Routes
    return children ? children : <Outlet />;
}
