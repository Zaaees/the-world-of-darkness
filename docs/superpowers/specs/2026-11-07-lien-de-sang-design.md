# Lien de sang — conception

Date : 2026-11-07. Module : Vampire. Statut : conception validée en séance avec l'utilisateur, section par section.

## Objectif

Le Lien de sang (*blood bond* de V20) n'existe aujourd'hui que pour les goules. Ce chantier le crée entre vampires, l'aligne pour les goules, et l'écrit dans le Règlement. Rappels du serveur : RP écrit sans dés, Vitae seule monnaie, Puissance de Sang (rangs 1 à 5) à la place de la Génération, mécaniques rattachées aux scènes et jamais à une durée, PvP autorisé sans accord supplémentaire.

## Décisions

| Sujet | Décision |
|---|---|
| Régnant | Un vampire joueur **ou** un PNJ. |
| Déclaration | **Le régnant seul** déclare une gorgée, depuis le panneau `/vampire`. Chaque gorgée lui coûte **1 Vitae**. |
| PNJ régnant | Le MJ crée le lien dans CAIN. |
| Stades | 1, 2, 3. Chaque gorgée monte d'un cran. La **première gorgée d'un régnant Tremere** lie directement au stade 2. |
| Scènes | Aucun verrou technique : confiance au récit, annonce publique dans le salon. |
| Exclusivité | Un seul lien au stade 3 à la fois. Tant qu'il tient, les gorgées de tout autre régnant sont refusées (même pour monter un stade 1 ou 2). Les liens partiels existants restent. |
| Stade 3 | Directive : le lié ne peut pas agir contre son régnant. Il le peut, mais **chaque action** contre lui coûte autant de Vitae que **le rang du régnant**. |
| Rupture | Le temps n'efface rien. **Seul le MJ** efface un lien (CAIN), quand le récit l'a défait (Vaulderie, rituel, « Briser la laisse »…). Exception automatique : le changement de clan (nouveau personnage) efface les liens du personnage dans les deux sens. |
| Zénith | La « Scène de chasse » au rang 5 (boire un vampire pour s'en nourrir) **ne lie pas**. Exception assumée, écrite au Règlement et rappelée au panneau. |
| Goules | Une goule de sang est liée au stade 3 dès sa création ; une goule de l'esprit n'a pas de lien. Coût (3 Vitae) et limites inchangés. |
| Hors code | Vaulderie, rituels et pouvoir Thaumaturgique qui défont ou forgent un lien : récit, puis ajustement du MJ dans CAIN. |

## Données

Table SQLite `vampire_blood_bonds` (même base que la Frénésie), créée au démarrage, sans toucher Google Sheets ni l'Apps Script.

| Colonne | Rôle |
|---|---|
| `id` | entier, clé primaire |
| `guild_id` | serveur |
| `thrall_id` | ID Discord du lié |
| `regnant_kind` | `player` ou `npc` |
| `regnant_ref` | ID Discord du régnant (`player`), ID du registre PNJ ou nom libre normalisé (`npc`) |
| `regnant_name` | nom affiché (PNJ ; instantané de secours pour un joueur) |
| `regnant_potency` | rang du régnant PNJ (1 à 5) ; nul pour un joueur, dont on lit le rang actuel |
| `stage` | 1 à 3 |
| `created_at`, `updated_at` | horodatage |

Unicité : (`guild_id`, `thrall_id`, `regnant_kind`, `regnant_ref`). Côté site, tous les IDs Discord circulent en chaînes.

Noms affichés d'un joueur : nom du personnage (fiche du site), sinon nom Discord, sinon « Vampire inconnu ».

## Règles appliquées par le code

**Offrir son sang** (régnant joueur → lié joueur) :

1. La cible est un membre du serveur avec un personnage vampire (race vampire et clan), autre que le régnant.
2. Refus, sans prélever de Vitae :
   - réserve du régnant vide ;
   - cible liée au stade 3 à un autre régnant ;
   - cible déjà liée au stade 3 envers ce régnant.
3. Sinon : 1 Vitae prélevé (transaction existante `modify_vitae`), stade + 1 (ou 2 directement pour une première gorgée d'un régnant Tremere), plafonné à 3.

**Prix du défi** : rang actuel du régnant joueur, ou `regnant_potency` du PNJ. Prélevé comme toute dépense ; une réserve insuffisante refuse le défi sans rien prélever (le lié ne peut pas agir contre son régnant) ; à zéro, la Faim prend le relais (logique existante `handle_empty_reserve`).

**Opérations MJ** : créer un lien envers un PNJ (régnant du registre, dont le rang pré-remplit le formulaire, ou nom libre et rang), changer le stade (1 à 3), effacer. L'exclusivité vaut aussi pour le MJ : un second stade 3 est refusé (« efface d'abord l'autre lien au stade 3 »).

**Changement de clan** : à côté de `clear_frenzy_data`, effacement des liens où le personnage est lié ou régnant.

## Panneau `/vampire` (Discord)

Le panneau reste éphémère. Les annonces publiques réutilisent le mécanisme des cartes de Frénésie (`post_card`), dans le salon où le panneau a été ouvert.

**Côté lié**
- Champ « ⛓️ Liens de sang » : chaque régnant, son stade et une phrase :
  - stade 1 : *X occupe tes pensées plus que de raison.*
  - stade 2 : *X compte plus que quiconque ; tu le protèges sans y penser.*
  - stade 3 : *X passe avant tout, même avant toi.*
- Au stade 3, champ « Directive de jeu » : *Tu ne peux pas agir contre X. Chaque action contre lui te coûte N Vitae : déclare-la avec « Défier le lien ».*
- Entrée « Défier le lien envers X (N Vitae) » dans le menu « Utiliser un pouvoir… », présente seulement avec un lien au stade 3. Note au panneau, pas d'annonce publique.

**Côté régnant**
- Champ « 🩸 Ont bu ton sang » : noms et stades, cinq au plus, puis « …et N autres ».
- Bouton « Offrir mon sang » (ligne 2, à côté de la Bête), désactivé à réserve vide. Il remplace le panneau par un sélecteur de membre et un bouton Retour. Après validation : carte publique qui mentionne le lié (*« 🩸 Y boit le sang de X. Le lien se noue. »* / *« …Le lien se resserre. »* / *« Y est désormais lié à X. »*), puis retour au panneau avec une note. Salon inaccessible : la note demande de prévenir la scène soi-même.

**Zénith** : le texte « Alimentation » précise *(cette chasse ne te lie pas)*.

## Site

**Fiche du joueur** : l'onglet « Goules » devient « Goules & Liens » (même clé de texte, nouvelle valeur par défaut).
- Nouveau composant `BloodBondsSection.jsx`, en lecture seule : « Tu es lié à » (régnant, stade, phrase) et « Ont bu ton sang » (nom, stade) ; au stade 3, rappel du prix du défi ; une phrase sobre sans aucun lien.
- `GhoulsTab` : badge « Liée au stade 3 » sur les goules de sang, « Sans lien de sang : tenue par la Domination » sur les goules de l'esprit.

**CAIN (`GmDashboard`)** : troisième onglet « Liens de sang », composant `BloodBondsAdmin.jsx`. Liste de tous les liens du serveur (lié → régnant, type, stade, rang du régnant), changement de stade, effacement avec confirmation, formulaire « Lier un joueur à un PNJ » (vampire du serveur ; PNJ du registre ou nom libre et rang ; stade).

Les deux composants suivent les conventions du site : TailwindCSS seulement, un composant par fichier, textes dans le registre CAIN, affichage mobile vérifié.

## API

| Route | Accès | Rôle |
|---|---|---|
| `GET /api/vampire/bonds` | joueur authentifié | ses liens dans les deux sens |
| `GET /api/gm/bonds` | MJ Vampire ou Fondateur | tous les liens du serveur, plus la liste des vampires du serveur |
| `POST /api/gm/bonds` | MJ | crée un lien envers un PNJ |
| `PUT /api/gm/bonds/{id}` | MJ | change le stade |
| `DELETE /api/gm/bonds/{id}` | MJ | efface le lien |

Rôle vérifié côté serveur à chaque appel ; un lien d'un autre serveur est introuvable (404).

## Découpage du code

| Fichier | Rôle |
|---|---|
| `data/blood_bonds.py` | textes des stades, directive, constantes (coût d'une gorgée, règle Tremere) |
| `utils/blood_bonds.py` | table et règles : offrir son sang, prix du défi, opérations MJ, effacement au changement de clan |
| `modules/vampire/views/bonds.py` | sélecteur « Offrir mon sang », carte publique, champs du panneau |
| `modules/vampire/views/panel.py` | branchement du bouton, de l'entrée « Défier le lien » et des champs |
| `modules/vampire/api.py` | routes joueur et MJ |
| `web/src/modules/vampire/components/BloodBondsSection.jsx` | liens sur la fiche |
| `web/src/core/components/BloodBondsAdmin.jsx` | onglet CAIN |

`utils/database.py` ne reçoit que l'appel de création de table au démarrage.

## Règlement

Section VI de `RulesTab.jsx`, encadré placé après « Restrictions concernant les goules », mise en page de l'encadré « Les Scènes de Chasse ». Clés dédiées `vampire.rules.bond.*` dans `data/site_content.json` (aucune renumérotation, pas de collision avec les sessions parallèles).

> ### Le Lien de sang
> Boire le sang d'un vampire, c'est commencer à l'aimer.
>
> - Chaque gorgée resserre le lien d'un cran ; à la **troisième**, vous êtes lié : votre régnant, celui dont vous avez bu le sang, passe avant tout, même avant vous.
> - Seul celui qui donne son sang le déclare, en scène, avec « Offrir mon sang » du panneau. Chaque gorgée lui coûte 1 Vitae. Le sang Tremere est plus traître : sa première gorgée lie déjà au deuxième stade.
> - **Lié, vous n'avez qu'un maître** : aucun autre sang ne vous prend tant que le lien tient. Agir contre lui reste possible, mais chaque action vous coûte autant de Vitae que son rang, avec « Défier le lien » du panneau.
> - Le temps n'use pas le lien. Seul le récit le défait : une Vaulderie, un rituel, une laisse brisée. Le MJ l'efface alors.
>
> **Note :** une goule de sang est liée au troisième stade dès sa création ; une goule de l'esprit ne l'est pas. Au Zénith, boire un autre vampire vous nourrit sans vous lier.

Inchangés : l'action « Briser la laisse » (et son générateur), la phrase existante sur les goules d'autrui dont on se nourrit, tout le module Werewolf.

## Tests

- **pytest** `tests/modules/vampire/test_blood_bonds.py`, bases temporaires : progression 1 → 2 → 3 et coût ; Tremere au stade 2 ; refus sans prélèvement (réserve vide, soi-même, stade 3 envers un autre, stade 3 complet) ; prix du défi joueur et PNJ ; effacement au changement de clan dans les deux sens ; routes MJ (refus non-MJ, exclusivité, autre serveur) ; route joueur.
- **vitest** : `BloodBondsSection` (liste, vide, stade 3), `BloodBondsAdmin` (liste, effacement, formulaire), badge des goules.
- **Vérification** : `cd web && npm run lint` ; vitest des périmètres vampire, data et core ; `pytest tests --ignore=tests/modules/werewolf` ; affichage mobile.

## Fusion

D'autres sessions modifient en parallèle `data/site_content.json` et `RulesTab.jsx` (Vigilance par quartier en section II, Souffle de vie en IV, aura de la Diablerie en V). Les clés dédiées évitent les collisions de numéros ; une note dans le dossier partagé des sessions signale les zones touchées pour la fusion finale.
