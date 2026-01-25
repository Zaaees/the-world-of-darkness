# ATDD Checklist - Epic 4, Story 4.1: Modèle de Données Renommée

**Date:** 2026-01-24
**Author:** Zaès
**Primary Test Level:** Unit/API

---

## Story Summary

Création de la table `werewolf_renown` pour stocker et suivre les demandes de Hauts Faits (accomplissements narratifs) des joueurs Loup-Garou.

**As a** système
**I want** une table `werewolf_renown` en base de données
**So that** les demandes de Hauts Faits soient stockées et suivies

---

## Acceptance Criteria

1. La table `werewolf_renown` existe dans la base de données
2. Elle contient les colonnes: `id`, `user_id` (FK), `title`, `description`, `renown_type` (Glory/Honor/Wisdom), `status` (pending/approved/rejected), `submitted_at`, `validated_at`, `validated_by`
3. L'enum `RenownType` définit les types: Glory, Honor, Wisdom
4. L'enum `RenownStatus` définit les statuts: pending, approved, rejected
5. Le dataclass `RenownRequest` représente une entrée complète

---

## Failing Tests Created (RED Phase)

### Unit Tests (8 tests)

**File:** `tests/modules/werewolf/test_renown_atdd.py` (265 lines)

| Test | Status | Verifies |
|------|--------|----------|
| `test_renown_table_exists` | 🔴 RED - ImportError | Table `werewolf_renown` can be created |
| `test_renown_table_has_required_columns` | 🔴 RED - ImportError | All 9 required columns exist |
| `test_renown_type_enum_values` | 🔴 RED - ImportError | RenownType has Glory/Honor/Wisdom |
| `test_renown_status_enum_values` | 🔴 RED - ImportError | RenownStatus has pending/approved/rejected |
| `test_renown_dataclass_exists` | 🔴 RED - ImportError | RenownRequest dataclass defined |
| `test_create_renown_request_function` | 🔴 RED - ImportError | CRUD: Create renown request |
| `test_get_renown_requests_by_user` | 🔴 RED - ImportError | CRUD: Read user's requests |
| `test_user_id_foreign_key_relationship` | 🔴 RED - ImportError | FK relationship with werewolf_data |

---

## Data Factories Required

### RenownRequest Factory

**File à créer:** `tests/support/factories/renown_factory.py`

```python
from faker import Faker
from modules.werewolf.models.renown import RenownType, RenownStatus

fake = Faker('fr_FR')

def create_renown_request(overrides=None):
    data = {
        "user_id": str(fake.random_number(digits=18)),
        "title": fake.sentence(nb_words=4),
        "description": fake.paragraph(nb_sentences=3),
        "renown_type": fake.random_element([RenownType.GLORY, RenownType.HONOR, RenownType.WISDOM]),
        "status": RenownStatus.PENDING,
        **(overrides or {})
    }
    return data
```

---

## Implementation Checklist

### Test: `test_renown_table_exists`

**Tasks to make this test pass:**

- [ ] Créer le fichier `modules/werewolf/models/renown.py`
- [ ] Implémenter la fonction `create_renown_table(db)`
- [ ] Définir le schéma SQL de la table `werewolf_renown`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_renown_table_exists -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: `test_renown_table_has_required_columns`

**Tasks to make this test pass:**

- [ ] Ajouter colonne `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- [ ] Ajouter colonne `user_id` (TEXT NOT NULL)
- [ ] Ajouter colonne `title` (TEXT NOT NULL)
- [ ] Ajouter colonne `description` (TEXT)
- [ ] Ajouter colonne `renown_type` (TEXT NOT NULL)
- [ ] Ajouter colonne `status` (TEXT DEFAULT 'pending')
- [ ] Ajouter colonne `submitted_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- [ ] Ajouter colonne `validated_at` (TIMESTAMP)
- [ ] Ajouter colonne `validated_by` (TEXT)
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_renown_table_has_required_columns -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: `test_renown_type_enum_values`

**Tasks to make this test pass:**

- [ ] Définir `class RenownType(str, Enum)` dans renown.py
- [ ] Ajouter `GLORY = "Glory"`
- [ ] Ajouter `HONOR = "Honor"`
- [ ] Ajouter `WISDOM = "Wisdom"`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_renown_type_enum_values -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.25 hours

---

### Test: `test_renown_status_enum_values`

**Tasks to make this test pass:**

- [ ] Définir `class RenownStatus(str, Enum)` dans renown.py
- [ ] Ajouter `PENDING = "pending"`
- [ ] Ajouter `APPROVED = "approved"`
- [ ] Ajouter `REJECTED = "rejected"`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_renown_status_enum_values -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.25 hours

---

### Test: `test_renown_dataclass_exists`

**Tasks to make this test pass:**

- [ ] Définir `@dataclass class RenownRequest`
- [ ] Ajouter champ `id: Optional[int]`
- [ ] Ajouter champ `user_id: str`
- [ ] Ajouter champ `title: str`
- [ ] Ajouter champ `description: Optional[str]`
- [ ] Ajouter champ `renown_type: RenownType`
- [ ] Ajouter champ `status: RenownStatus`
- [ ] Ajouter champ `submitted_at: Optional[datetime]`
- [ ] Ajouter champ `validated_at: Optional[datetime]`
- [ ] Ajouter champ `validated_by: Optional[str]`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_renown_dataclass_exists -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: `test_create_renown_request_function`

**Tasks to make this test pass:**

- [ ] Implémenter `async def create_renown_request(db, data) -> RenownRequest`
- [ ] INSERT avec statut 'pending' par défaut
- [ ] `submitted_at` = datetime.now()
- [ ] Retourner l'entrée créée avec son ID
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_create_renown_request_function -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

### Test: `test_get_renown_requests_by_user`

**Tasks to make this test pass:**

- [ ] Implémenter `async def get_renown_requests_by_user(db, user_id) -> List[RenownRequest]`
- [ ] SELECT * WHERE user_id = ?
- [ ] Mapper les résultats en objets RenownRequest
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_get_renown_requests_by_user -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

### Test: `test_user_id_foreign_key_relationship`

**Tasks to make this test pass:**

- [ ] Vérifier que les deux tables peuvent être créées ensemble
- [ ] Vérifier l'insertion avec user_id valide
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_user_id_foreign_key_relationship -v`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 0.5 hours

---

## Running Tests

```bash
# Run all failing tests for this story
pytest tests/modules/werewolf/test_renown_atdd.py -v

# Run specific test
pytest tests/modules/werewolf/test_renown_atdd.py::TestStory4_1_RenownDataModel::test_renown_table_exists -v

# Run with coverage
pytest tests/modules/werewolf/test_renown_atdd.py --cov=modules.werewolf.models.renown -v

# Debug mode
pytest tests/modules/werewolf/test_renown_atdd.py -v -s --tb=long
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ 8 tests written and failing (ImportError expected)
- ✅ Dataclass structure defined in tests
- ✅ Enum expectations documented
- ✅ Implementation checklist created

### GREEN Phase (DEV Team - Next Steps)

1. Créer `modules/werewolf/models/renown.py`
2. Implémenter les enums `RenownType` et `RenownStatus`
3. Implémenter le dataclass `RenownRequest`
4. Implémenter `create_renown_table()`
5. Implémenter `create_renown_request()`
6. Implémenter `get_renown_requests_by_user()`
7. Exécuter les tests jusqu'à ce qu'ils passent tous

### REFACTOR Phase

- Extraire les patterns communs avec `store.py`
- Optimiser les requêtes SQL si nécessaire
- Ajouter la validation des données d'entrée

---

## Next Steps

1. **Run failing tests** to confirm RED phase: `pytest tests/modules/werewolf/test_renown_atdd.py -v`
2. **Begin implementation** with `modules/werewolf/models/renown.py`
3. **Work one test at a time** (red → green)
4. **When all tests pass**, proceed to Story 4.2 (Formulaire de Soumission)

---

## Knowledge Base References Applied

- **fixture-architecture.md** - Test fixture patterns with auto-cleanup
- **data-factories.md** - Factory patterns using faker for test data
- **test-quality.md** - Given-When-Then structure, one assertion focus

---

## File Structure Created

```
tests/modules/werewolf/
└── test_renown_atdd.py          # 8 failing tests (this checklist)

modules/werewolf/models/
├── store.py                     # Existing - werewolf_data table
└── renown.py                    # TO CREATE - werewolf_renown table
```

---

**Generated by**: BMad TEA Agent - ATDD Workflow
**Version**: 4.0 (BMad v6)
