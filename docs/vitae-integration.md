# Intégration du catalogue Vitae v2

Le catalogue partagé est `data/blood_actions.json` : 90 voies de clan (18 lignées, cinq niveaux) et 14 actions communes ou uniques. Le site le charge via `web/src/data/bloodActions.js` ; le bot le charge via `data/blood_actions.py`.

Chaque action contient un intitulé, un objectif et une piste de réalisation. Les rappels de validation et de règles restent dans les règles générales, sans répétition dans les fiches. Les pistes sont dépliables indépendamment du bouton de soumission. Au niveau 5, les voies d'héritage sont lisibles sans soumission ni points.

Les points sont recalculés par le bot lors de l'enregistrement de la demande et conservés avec cette demande. Le montant transmis par le navigateur n'est pas utilisé par ce chemin de validation. Les actions indisponibles pour le niveau ou le clan sont écartées. Plusieurs actions distinctes peuvent être en attente pour une même scène ; la vérification du double compte narratif reste du ressort du MJ.

La proposition évoquait un gel au niveau d'ouverture de la scène. Le système existant ne stocke ni identifiant de scène ni niveau d'ouverture : cette version fige donc le montant lors de l'enregistrement par le bot, et non à l'ouverture du RP. Une même action ne peut avoir qu'une demande en attente par personnage ; elle redevient soumettable après traitement, sans délai. Il n'existe aucun plafond de points par scène ou période.

Les niveaux acquis et l'historique restent inchangés. Les anciennes expériences de frénésie, goule et lien déjà complétées empêchent de réclamer leur nouvelle équivalence. Les demandes en attente correspondant à des actions retirées ne sont pas récompensées : le MJ peut les refuser puis orienter vers un objectif actuel. Les anciens délais stockés ne bloquent plus les cartes du nouveau catalogue.

Les seuils partagés sont 30/60/120/250. Le bot reporte l'excédent et n'impose plus d'incubation. Les règles du site et l'exemple Apps Script ont été alignés.

## Publication

Publier le site et le bot ensemble : l'ancien bot ne connaît pas les nouveaux identifiants. Le workflow web surveille aussi le JSON partagé. Aucun déploiement distant n'est effectué par les modifications locales.

`docs/google-apps-script.js` reste une copie locale : sa modification ne met pas à jour un déploiement Google existant. Le chemin courant de soumission conserve son contrat existant ; la validation utilisée par Discord calcule la progression en Python. Si une installation appelle directement la fonction Apps Script `validateAction`, elle doit recevoir aussi la version mise à jour pour conserver les excédents et supprimer les anciens délais.

Pour régénérer les textes depuis la proposition et les annotations éditoriales : `node tools/build_vitae_catalog.cjs`. Les tests vérifient la couverture des lignées, les aliases, les gains, l'excédent et les interactions des cartes.

## Économie de sang et équilibrage (7 novembre 2026)

Trois systèmes se tiennent désormais : la réserve de Vitae, les coûts des disciplines et la progression.

**Réserve (bot, SQLite `vampire_soif`).** « Chasse en off » rend 40 % de la réserve (2/4/5/8/10), une fois par nuit réelle (`VITAE_QUICK_FEED_COOLDOWN_HOURS`), et seulement tant que la réserve est encore à 40 % ou plus ; en dessous, seule « Scène de chasse » (lien Discord du serveur) remplit la réserve. Un entretien paresseux retire 1 Vitae par tranche de 2 jours réels à l'ouverture de `/vampire` ou de l'onglet Disciplines, au plus 3 par ouverture (`data/config.py`). Un changement de rang plafonne la réserve au nouveau maximum sans la remplir. Les colonnes `last_fed` et `last_upkeep` sont ajoutées par migration.

**Disciplines.** `data/disciplines.json` est exporté de `web/src/data/disciplines.js` par `node tools/export_disciplines.cjs` ; les tests web vérifient l'égalité. Grille des niveaux 1 à 5 : 0/1 au niveau 1, 1 au niveau 2, 1 ou 3 au niveau 3, 3 au niveau 4, 9 au niveau 5 (les disciplines passives Force d'Âme, Puissance et Vol restent gratuites jusqu'au niveau 4 et deviennent une activation à 9 au niveau 5). Le menu « Utiliser un pouvoir » du panneau et le bouton « Utiliser » du site prélèvent le coût via `POST /api/vampire/vitae` ; `GET /api/vampire/vitae` lit la réserve après entretien. Salubri a des disciplines ; la clé goules des Filles de la Cacophonie est `daughters_cacophony`.

**Progression.** Seuils 30/60/120/200. Même action validée au même rang : 100 %, 75 %, puis 50 % (`repeat.factors`), calculé par le bot à l'enregistrement (`base_points` conservé) et recalculé par Apps Script depuis `history` (entrées avec `actionId` et `bp`). Chaque seuil demande la clé de rang `vitae_<clan>_<rang>` déjà validée ; sinon les points attendent et la mutation survient à la validation de la clé (`blocked_by_key`). Étreinte et diablerie portent `once: true`. Le MJ dispose d'un bouton « Ajuster » qui valide avec un montant corrigé. Lier une goule de sang coûte `GHOUL_BLOOD_COST` Vitae ; limites 1/2/3/5/8 et goules de l'esprit 1 (rang 4) / 2 (rang 5) dans `data/ghoul_disciplines.json`.

**Déploiement.** `docs/google-apps-script.js` contient les constantes `THRESHOLDS`, `CLAN_ALIASES` et `REPEAT_FACTORS` (vérifiées contre `data/blood_actions.json` par `node --test tests/apps_script.test.cjs`) : redéployer le script Google en même temps que le bot, sinon les anciens seuils (250) et l'absence de clé de rang restent actifs côté feuille.
