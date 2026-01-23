# ATDD Checklist: Story 2.1 - Modèle de Données Werewolf

**Story**: [2-1-modele-de-donnees-werewolf.md](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/2-1-modele-de-donnees-werewolf.md)
**Status**: DONE (Verification complete)

## Acceptance Criteria Breakdown

| ID | Criterion | Level | Test File |
|---|---|---|---|
| AC1 | Table `werewolf_data` avec colonnes spécifiées (`user_id`, `breed`, etc.) | Integration | `test_store.py` |
| AC2 | `user_id` comme PK / Index unique | Integration | `test_store.py` |
| AC3 | Enums pour `breed`, `auspice`, `tribe` | Unit | `test_store.py` |
| AC4 | Immuabilité des champs `breed`, `auspice`, `tribe` dans le service | Logic / Unit | `test_store.py` |
| AC5 | Persistence des modifications sur les autres champs | Integration | `test_store.py` |

## Supporting Infrastructure

### Data Factories
- **WerewolfDataFactory**: Génère des objets `WerewolfData` valides pour les tests SQLite.

### Mock Requirements
- Utilisation de `aiosqlite` en mode `:memory:` pour les tests d'intégration sans persistance sur disque.

## Implementation Checklist

- [x] Définir le Schéma SQL (DDL)
- [x] Implémenter le DTO `WerewolfData` (Dataclass)
- [x] Implémenter les fonctions CRUD dans `store.py`
- [x] Ajouter le garde-fou pour l'immuabilité (Logic)
- [x] Vérifier la protection contre les injections SQL
- [x] Validation des Enums au niveau du DTO/Service

## Execution Commands

```bash
# Lancer les tests du store
pytest tests/modules/werewolf/test_store.py
```

## Red-Green-Refactor Progress

- **RED**: Tests de base échouent sans table.
- **GREEN**: CRUD opérationnel.
- **REFACTOR**: Correction de la faille SQL et ajout de la validation par Enums suite à la Code Review.
