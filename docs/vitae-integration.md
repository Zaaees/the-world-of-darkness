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
