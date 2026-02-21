# ATDD Checklist: Story 1.3 - Middleware de Vérification de Rôle Discord

**Story**: [1-3-middleware-de-verification-de-role-discord.md](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/1-3-middleware-de-verification-de-role-discord.md)
**Status**: DONE

## Acceptance Criteria Breakdown

| ID | Criterion | Level | Verification |
|---|---|---|---|
| AC1 | Erreur 403 si rôle `Werewolf` absent | API / Security | Manual API Call |
| AC2 | Message thématique : "Vous n'entendez pas l'appel de Gaïa" | API | Manual API Call |
| AC3 | Accès autorisé si rôle présent | API | Manual API Call |
| AC4 | Pas de hardcoding du Role ID (usage `data.config`) | Code Quality | `middleware.py` |

## Implementation Checklist

- [x] Créer le décorateur `require_werewolf_role`
- [x] Connecter le décorateur pour vérifier via l'`interface_bot`
- [x] Configurer les routes dans `modules/werewolf/routes.py`
- [x] Enregistrer les routes dans `api_server.py`
- [x] **[Note]** Tests backend différés (non configurés)

## Execution Commands

```bash
# Vérification manuelle (exigerait un token valide)
# curl -H "X-Discord-User-ID: XXX" http://localhost:8000/api/modules/werewolf/profile
```
