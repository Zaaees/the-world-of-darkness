// Editorial import from the approved proposal; runtime uses the generated JSON.
const fs = require('node:fs');
const source = fs.readFileSync('docs/proposition_progression_vitae_v2.md', 'utf8');
const entries = [
['Brujah','brujah','Le prix du refus|Les voix qui se lèvent|Briser les chaînes|Un ordre nouveau|La cause vous survivra',
'Exigez la restitution d’un bien confisqué ou la levée d’une interdiction de chasse.|Réunissez des alliés autour d’une action précise : obtenir un accès, protéger un témoin ou faire retirer une sanction.|Coupez le levier d’un maître chanteur ou empêchez une querelle de faire échouer une opération commune.|Faites appliquer de nouvelles conditions de partage du sang malgré ceux qui profitent des anciennes.|Confiez une cause à ceux qui la porteront autrement que vous.'],
['Gangrel','gangrel','La nuit sans murs|Ce que la pluie n’efface pas|Les pactes de la lisière|Les routes n’ont pas de prince|Là où la ville redevient sauvage',
'Traversez une friche, un bois, un réseau ferroviaire, des souterrains ou une zone industrielle jusqu’à découvrir où disparaître avant l’aube ; observez les rondes, les passages oubliés, les dangers locaux et les habitudes des lieux jusqu’à disposer d’un repli ou d’un itinéraire fiable.|Suivez des habitudes de déplacement, des traces physiques, des témoins marginaux ou le comportement des animaux ; reconstituez le passage d’un fugitif, retrouvez un vampire qui ne veut pas l’être ou découvrez où une proie, un messager ou un intrus a réellement disparu.|Échangez des avertissements, des passages sûrs, des lieux de repli ou une assistance en cas de traque ; rapprochez des Gangrel rivaux, des vampires sans domaine ou d’autres habitants des marges, puis faites tenir leur parole lorsqu’une intrusion, une chasse ou une dette menace de briser l’accord.|Reliez voies ferrées, tunnels techniques, berges, toits, terrains vagues ou relais discrets ; obtenez la coopération de ceux qui contrôlent certains passages, prévoyez des détours lorsqu’une route tombe et permettez à une coterie, des messagers ou des fugitifs de traverser réellement la ville grâce à ce réseau.|Rassemblez des lieux de repli, des voies clandestines, des habitants utiles et des accords avec les voisins ; repoussez ou absorbez les prétentions concurrentes, établissez qui peut traverser ou demander refuge, puis confiez suffisamment de responsabilités à d’autres pour que cette lisière continue d’exister même lorsque vous n’y êtes plus.'],
['Malkavien','malkavian',"La fissure du réel|Le miroir se fend|La toile murmure|Le fou devant le trône|Ce que la toile n’oublie pas",
"Attachez-vous à un détail que tous écartent, rapprochez des paroles qui semblent sans rapport ou poursuivez un motif récurrent, puis obtenez la preuve qu’il révélait un mensonge, un danger ou une relation dissimulée.|Nourrissez la paranoïa d’un menteur jusqu’à ce qu’il se trahisse, enfermez un rival dans ses propres contradictions ou faites naître assez de doute chez une cible pour qu’elle rompe une alliance, abandonne une surveillance ou commette une erreur révélatrice.|Comparez les visions ou manies de plusieurs Malkaviens, déchiffrez des messages qui n’ont de sens qu’ensemble ou suivez une série de coïncidences dans le Réseau de Folie, puis utilisez le motif découvert pour anticiper une opération, retrouver quelqu’un ou identifier ce qui manipule les événements.|Annoncez un événement que vous pouvez ensuite démontrer, révélez progressivement les pièces d’un complot ou mettez en scène une contradiction impossible à ignorer afin qu’une coterie, une cour vampirique ou une organisation abandonne un plan, rompe avec un allié ou se retourne contre celui qui la trompait.|Faites d’un symbole le signe reconnu d’une menace, transformez une découverte en récit que les vôtres se transmettent, établissez un rituel destiné à déceler un danger récurrent ou laissez dans le Réseau de Folie un code que d’autres Malkaviens reprendront, interpréteront et transmettront à leur tour."],
['Nosferatu','nosferatu',"Une oreille derrière le mur|Les voix sous la ville|Une écharde dans la toile|Aveugler les guetteurs|Les murmures demeurent",
"Gagnez la confiance d’un gardien, d’un technicien, d’un employé de nuit ou d’un habitué invisible aux yeux des puissants ; aménagez un moyen discret de communiquer avec lui et recoupez l’une de ses informations avant d’agir.|Reliez des informateurs qui ignorent travailler pour la même main, mettez en place des intermédiaires ou des dépôts anonymes, ou organisez des échanges permettant de confirmer une information sans qu’aucune source ne connaisse l’ensemble du réseau.|Retournez un informateur adverse, récupérez une source compromise avant qu’elle ne parle, détournez un canal de communication ou faites parvenir à l’ennemi des informations assez crédibles pour dissimuler celles que vous lui dérobez réellement.|Remontez d’un observateur jusqu’à ceux qui centralisent ses rapports, retournez un intermédiaire, faites disparaître une source essentielle ou introduisez de fausses certitudes assez solides pour que tout un réseau commence à surveiller la mauvaise cible.|Répartissez les informations sensibles entre plusieurs gardiens, transmettez vos accès sans livrer toutes les clés à une seule personne, sauvez un réseau menacé par une purge interne ou reconstruisez ses relais de manière à ce qu’aucune perte future ne puisse faire taire entièrement ce que la ville murmure."],
['Toreador','toreador','Entrer dans la lumière|Le prix de la muse|Sauver la dernière beauté|Le salon des immortels|L’œuvre vous échappe',
"Sauvez une exposition compromise, obtenez qu’un artiste vous introduise dans son cercle, imposez votre contribution à un événement sélectif ou transformez un premier refus en invitation durable.|Financez l’œuvre que personne ne voulait soutenir, obtenez une galerie, une scène ou un éditeur pour un talent ignoré, ouvrez les bonnes portes à un protégé ou fermez-les à celui dont vous condamnez le travail.|Empêchez la fermeture d’un théâtre, sauvez une collection destinée à être dispersée, restaurez la réputation d’un créateur détruit par un scandale ou faites échouer ceux qui veulent effacer un lieu devenu précieux à vos yeux.|Fondez un salon dont l’invitation devient une faveur convoitée, faites d’une galerie ou d’un festival le terrain neutre de rivalités vampiriques, consacrez des artistes qui deviennent des références ou faites de l’exclusion de votre cercle une sanction redoutée.|Faites naître un courant artistique repris par une nouvelle génération, laissez derrière vous une institution que d’autres continuent de faire vivre, transformez un protégé en référence capable de transmettre votre influence ou voyez une œuvre née sous votre égide devenir un symbole que la ville s’approprie."],
['Ventrue','ventrue','Le droit de réclamer|La parole fait loi|Une couronne éprouvée|Tenir la cour|Le trône après vous',
'Négociez un accès fiable à des proies compatibles ou faites accepter une responsabilité que l’on vous conteste.|Obtenez l’exécution d’un accord entre rivaux ou le contrôle réel d’une ressource disputée.|Ralliez un intermédiaire hostile, ou rétablissez la capacité d’un groupe à suivre des décisions contestées.|Faites fonctionner une organisation commune malgré des intérêts rivaux et une opposition active.|Préparez une relève qui puisse effectivement décider sans attendre chacun de vos ordres.'],
['Tremere','tremere','Les veines du savoir|Le cercle sous tension|Délier le sort|Contre le sang adverse|Le grimoire ouvert',
'Analysez une anomalie par l’étude de son sang ou obtenez un texte protégé puis démontrez son utilité.|Récupérez un composant défendu ou surmontez une contrainte inhabituelle pendant un rituel connu.|Levez un effet identifié ou reconstituez une méthode à partir d’éléments incomplets.|Déjouez une opération adverse ou rendez une protection efficace malgré ceux qui cherchent à l’empêcher.|Transmettez une méthode éprouvée ou rendez votre pratique indépendante d’une tutelle établie.'],
['Lasombra','lasombra','La main invisible|Nul maître au-dessus|Retourner la nuit|L’ombre tient le terrain|Le pouvoir sans laisse',
'Changez les conditions d’un accord défavorable ou gagnez le concours d’un intermédiaire qui connaît votre faiblesse.|Supprimez le levier d’une mise sous tutelle ou neutralisez un obstacle concret à votre projet.|Faites changer de camp un partenaire adverse ou remplacez un moyen essentiel perdu en cours d’opération.|Préservez une position conquise contre une riposte réelle, ou prenez l’ascendant sur un réseau rival.|Établissez des relais qui restent efficaces même lorsqu’ils refusent de vous obéir aveuglément.'],
['Tzimisce','tzimisce','Le seuil du Dragon|Façonner ce qui est sien|Reprendre possession|Le domaine consacré|Au-delà de la possession',
'Faites appliquer une hospitalité contestée ou adaptez un refuge à une contrainte concrète de votre condition.|Écartez une ingérence dans votre domaine, ou réalisez une transformation qui répond aux besoins de votre domaine.|Récupérez un domaine compromis ou surmontez les contraintes d’une transformation réellement complexe.|Obtenez un accord protégeant un lieu disputé ou achevez une transformation qui change son fonctionnement.|Transmettez un domaine ou poursuivez une métamorphose dont votre domaine portera la marque.'],
['Giovanni / Hecata','giovanni','Ce que les morts réclament|La dette au-delà du souffle|Délier les ombres|L’accord des deux rives|Un héritage sans repos',
'Récupérez un objet funéraire disputé ou faites honorer une obligation laissée par un défunt.|Négociez un service réellement rendu par un esprit accessible, ou réglez un héritage qui ouvre une ressource.|Déliez une emprise nécromantique, ou vérifiez une vérité que des intérêts familiaux dissimulent.|Faites fonctionner un arrangement entre héritiers et morts, ou établissez un dispositif patrimonial contesté.|Transmettez les moyens d’honorer des obligations qui ne s’arrêteront pas avec votre départ.'],
['Séthites / Ministère','setite','La première entrave tombe|Une autre allégeance|Le dogme fissuré|Le cercle affranchi|Vos disciples sans vous',
'Obtenez l’abandon effectif d’une règle défendue ou entrez dans un cercle fermé par une offre ciblée.|Détachez quelqu’un d’une emprise ou obtenez une adhésion qui change réellement ses décisions.|Retournez un relais d’influence ou démontrez une contradiction qui affaiblit une autorité établie.|Faites fonctionner un cercle malgré l’opposition de ceux qui veulent conserver leur emprise.|Laissez votre enseignement vivre chez ceux qui peuvent aussi retourner vos arguments contre vous.'],
['Banu Haqim','banu_haqim','La balance du sang|La sentence accomplie|Derrière les protections|Nul au-dessus du jugement|La justice après le juge',
'Vérifiez une accusation contestée ou faites réellement restituer ce qui a été pris.|Retrouvez une cible et accomplissez l’objectif de la mission, ou faites exécuter un arbitrage refusé.|Contournez la protection d’un coupable ou retirez le levier qui empêchait une réparation.|Obtenez une réparation malgré une protection organisée, y compris dans votre propre camp.|Établissez un arbitrage qui ne repose plus sur votre seule présence.'],
['Ravnos','ravnos','Passer entre les regards|La fausse piste|Le piège retourné|Les routes insaisissables|Un nom laissé derrière',
'Contournez un accès gardé par une ruse crédible ou gagnez un refuge auprès d’un hôte méfiant.|Faites perdre votre trace à un poursuivant ou remplacez un objet sous une surveillance effective.|Obtenez un bien défendu sans affronter directement ses gardiens, ou désorganisez une opération adverse.|Rendez un passage utilisable sous surveillance ou faites échouer une chasse en retournant ses moyens.|Transmettez une route sûre ou quittez une identité devenue une entrave.'],
['Salubri','salubri','Un abri pour la douleur|Délivrer sans posséder|La porte reste ouverte|Le sanctuaire tient|Le soin vous survivra',
'Mettez un bénéficiaire à l’abri malgré un obstacle ou obtenez pour lui une assistance refusée.|Aidez un blessé à retrouver une faculté perdue ou retirez un levier de dépendance dangereux.|Préservez un lieu d’accueil menacé ou déjouez les recherches visant une personne protégée.|Brisez l’exploitation organisée de vos dons ou maintenez un sanctuaire face à une offensive.|Donnez à d’autres les moyens d’aider sans dépendre indéfiniment de votre disponibilité.'],
['Gargouilles','gargoyles','Le gardien choisit|La pierre ne cède pas|Briser la main du maître|Un refuge pour les libres|Des ailes sans chaînes',
'Empêchez une intrusion établie ou obtenez l’exercice d’une liberté jusque-là refusée.|Préservez une cible réellement attaquée ou neutralisez un moyen concret de servitude.|Faites tenir une défense dont l’ennemi connaît la faille, ou retirez quelqu’un d’un dispositif de contrôle.|Défendez un refuge collectif contre une offensive ou obtenez une autonomie face à des adversaires organisés.|Formez une relève capable de choisir ses engagements plutôt que de reproduire votre servitude.'],
['Samedi','samedi','Franchir le dégoût|La peur a un prix|La place du revenant|Ceux que la tombe rassemble|Un nom au-delà du corps',
'Gagnez un accès refusé à cause de votre condition ou récupérez un corps placé hors de portée.|Conduisez une opération discrète malgré votre apparence, ou obtenez un résultat en faisant de votre apparence une arme de terreur.|Neutralisez une exploitation des morts ou établissez une ressource dans un milieu qui vous excluait.|Préservez un refuge attaqué ou faites coopérer ceux qui ne vous traitaient que comme un instrument.|Transmettez une place reconnue qui ne dépende pas uniquement de votre utilité macabre.'],
['Filles de la Cacophonie','daughters_cacophony','Une voix franchit la porte|Le chant perce le silence|La dissonance révélatrice|La voix qui fait basculer|D’autres voix après vous',
'Obtenez une audience refusée ou faites aboutir une intervention vocale malgré une perturbation réelle.|Faites parvenir un message que l’on cherche à empêcher, ou désamorcez une hostilité par votre voix.|Déjouez une manipulation par votre intervention ou sauvez une opération malgré une voix compromise.|Faites basculer une confrontation organisée ou établissez un cercle d’influence contre une opposition active.|Transmettez un répertoire ou construisez une œuvre où les autres voix gardent leur autonomie.'],
['Baali','baali','Les cendres du secret|Le prix du pacte|Dénouer l’emprise|Contre les maîtres cachés|La dette ultime',
'Récupérez une preuve qui vous expose ou gagnez un intermédiaire dans un cercle occulte fermé.|Menez une opération liée à un engagement établi ou déjouez l’enquête menaçant un complice.|Neutralisez le levier d’une dette occulte ou déjouez un adversaire qui connaît vos pratiques.|Démantelez un dispositif adverse ou obtenez une autonomie réelle face à une tutelle établie.|Résolvez le prix d’un engagement majeur en affrontant celui qui vient réclamer son dû.'],
];
const scales = {1:[3,2,1,1,0],2:[0,5,4,2,0],3:[0,0,8,6,0],4:[0,0,0,12,0],5:[0,0,0,0,0]};
const actions = [];
for (const [heading, clan, titleText, hintText] of entries) {
  const section = source.split(`### ${heading}\n`)[1].split('\n### ')[0];
  const rows = [...section.matchAll(/^\| ([1-5]) — \d+ pt[s]? \| (.+) \|$/gm)];
  if (rows.length !== 5) throw new Error(`Missing levels: ${clan}`);
  rows.forEach((row, index) => {
    const level = Number(row[1]);
    actions.push({id:`vitae_${clan}_${level}`, clan, category:'clan', name:titleText.split('|')[index],
      description:row[2].replace(' autorisée', '').replace(' autorisés', ''),
      hints:[hintText.split('|')[index]],
      minBp:level,maxBp:5,points:scales[level][level-1],scaling:Object.fromEntries(scales[level].map((n,i)=>[i+1,n]))});
  });
}
const general = [
["first_frenzy","unique","La Bête à votre porte","Affrontez pour la première fois une crise où la Bête menace une vie, une couverture ou un engagement.",[3,2,1,1],"Une faim pressante ou une provocation peut mettre un allié en danger. Contenez la Bête ou affrontez ce que sa libération laisse derrière elle."],
["vitae_first_dependence","unique","Le sang fait des chaînes","Établissez votre première dépendance de sang et donnez-lui une place réelle dans la nuit.",[3,2,1,1],"Créez une goule ou nouez un lien de sang, puis répondez aux exigences de cette nouvelle dépendance."],
["vitae_mortal_break","unique","Ce nom n’est plus le vôtre","Abandonnez irréversiblement une part importante de votre vie mortelle pour préserver votre existence vampirique.",[4,3,2,1],"Renoncez à une identité devenue dangereuse, à un accès précieux ou à une relation impossible à préserver."],
["vitae_first_hunt","unique","La première traque","Menez à terme votre première chasse autonome malgré un obstacle qui aurait pu vous démasquer.",[2,1],"Obtenez le sang recherché puis traitez un témoin, une surveillance ou une intrusion territoriale."],
["vitae_hunting_source","general","Une veine dans la cité","Ouvrez ou rétablissez une source de chasse réellement exploitable là où une menace, vos proies ou les maîtres des lieux vous fermaient le passage.",[3,2,1,1],"Négociez un droit de chasse contesté, gagnez un accès surveillé ou établissez une couverture adaptée à vos proies. Si une source a été compromise, traitez la cause de sa perte et rétablissez un accès utilisable."],
["vitae_masquerade","general","Recoudre le voile","Étouffez une menace crédible avant qu’elle ne déchire la Mascarade.",[5,5,4,3],"Récupérez une preuve compromettante, déjouez une enquête ou neutralisez le risque posé par un témoin."],
["vitae_autonomy","general","Briser la laisse","Arrachez une autonomie réelle à une emprise qui organisait votre existence ou celle d’un autre.",[6,6,5,4],"Supprimez un levier de chantage ou démantelez un dispositif de contrôle."],
["vitae_extraction","general","Soustraire une vie à la nuit","Sauvez une personne dont la perte définitive était réellement possible et aurait durablement affecté votre existence.",[6,6,6,5],"Préparez une sortie, déjouez des poursuivants ou franchissez une défense pour empêcher une mort, une Mort ultime ou une disparition définitive. Le récit doit établir la menace et les conséquences durables qu’aurait entraînées cette perte."],
["vitae_crisis","general","Revenir du bord des cendres","Échappez à une situation qui aurait dû vous conduire à la torpeur ou à la Mort ultime, sans abandonner ce qui vous y avait conduit.",[5,5,4,3],"Échappez à une menace concrète de torpeur ou de Mort ultime tout en préservant l’objectif, la personne ou l’engagement qui vous avait poussé à l’affronter."],
["vitae_defense","general","Que le refuge demeure","Brisez une offensive organisée contre un refuge ou un réseau de chasse.",[8,8,8,6],"Identifiez les moyens de l’adversaire puis faites échouer son opération, par défense, négociation ou détournement."],
["vitae_resonance","resonance","Le goût d’une âme vive","Atteignez une source au sang chargé d’une émotion établie, au terme d’une chasse qui ne vous était pas acquise.",[2,1],"Identifiez rage, passion, mélancolie ou calme chez une proie et trouvez le moyen de l’approcher."],
["vitae_dyscrasia","resonance","L’empreinte dans le sang","Découvrez une dyscrasie et goûtez ce que cette empreinte singulière a laissé dans le sang.",[5,5,3,2],"Suivez la trace d’une émotion qui hante une proie, gagnez sa proximité et percez le secret de son sang."],
["vitae_embrace","irreversible","Donner la nuit","Accordez l’Étreinte à un mortel et faites naître un nouveau Damné dont le sang, les actes et les fautes seront désormais liés aux vôtres.",[8,8,8,6],"Choisissez celui ou celle que vous refusez de laisser mourir, obtenez — ou défiez — le droit de l’Étreindre, puis assumez les premières nuits de votre Infant."],
["vitae_diablerie","irreversible","Boire l’âme","Commencez là où la prédation devrait s’arrêter : buvez un autre vampire jusqu’à la Mort ultime et arrachez ce que son sang gardait encore de lui.",[8,8,8,6],"Terrassez un Caïnite, franchissez volontairement l’ultime interdit et survivez aux conséquences laissées dans votre sang, votre conscience et le regard des autres Damnés."],
["vitae_mortal_link","general","Une lumière reste allumée","Préservez un lien avec votre ancienne vie alors que votre nature vampirique rendait sa perte plus simple — ou plus sûre.",[4,4,3,2],"Protégez une Pierre de touche, préservez une relation mortelle ou respectez une Conviction alors que la faim, la Mascarade ou la politique de la nuit vous poussaient à l’abandonner."],
["vitae_mortal_influence","general","Des mains dans le jour","Étendez votre influence sur le monde des mortels sans révéler la main morte qui tire les fils.",[4,4,3,2],"Gagnez un contact, infiltrez une institution ou prenez le contrôle d’un accès dont votre existence nocturne pourra durablement profiter."],
["vitae_haven","general","Une tombe à soi","Faites d’un lieu plus qu’une cache : un refuge capable de protéger votre sommeil et vos secrets lorsque vient le jour.",[3,2,1,1],"Sécurisez les accès, établissez une couverture crédible ou obtenez les protections nécessaires pour pouvoir réellement y abandonner votre corps au sommeil diurne."],
["vitae_mortal_hunter","general","Les yeux du jour","Découvrez qu’un mortel vous chasse et brisez sa piste avant qu’elle ne remonte jusqu’à votre véritable nature.",[6,6,6,5],"Identifiez une surveillance, remontez jusqu’à ceux qui l’organisent et détournez leur attention sans provoquer la brèche qu’ils espéraient."],
["vitae_favor","social","Le poids d’une faveur","Contractez, honorez ou faites payer une dette vampirique dont l’issue modifie réellement une relation.",[4,4,3,2],"Engagez votre parole, acquittez une dette coûteuse ou réclamez une faveur dont le règlement transforme durablement votre relation avec un autre Damné."],
["vitae_secret","social","Un secret vaut du sang","Découvrez un secret dangereux et servez-vous-en pour obtenir quelque chose que la force n’aurait pas permis.",[4,4,3,2],"Vérifiez un secret compromettant, identifiez ceux qu’il menace et échangez votre silence ou sa révélation contre un accès, une protection ou une concession réelle."],
["vitae_negotiation","social","Sans montrer les crocs","Résolvez un conflit sérieux entre vampires par négociation, statut, dette ou manipulation sans recourir à la violence ouverte.",[5,5,4,3],"Dénouez une rivalité, négociez un accord ou mobilisez une dette pour résoudre un conflit dont l’issue engage réellement les vampires concernés."],
["vitae_recognition","social","Une place dans la nuit","Faites reconnaître un droit, un territoire ou une position par ceux qui auraient pu le contester.",[5,5,4,3],"Obtenez une reconnaissance explicite, surmontez une contestation ou réunissez les soutiens qui rendent votre droit, votre territoire ou votre position effectifs."],
["vitae_coterie","social","Le sang de la coterie","Acceptez une perte ou un danger réel pour préserver un membre de la coterie ou ce qu’elle possède collectivement.",[5,5,4,3],"Sacrifiez un avantage précieux, assumez une dette ou exposez-vous à une menace concrète pour sauver un compagnon ou protéger un refuge, un secret ou une ressource commune."],
];
for (const [id,category,name,description,values,hint] of general) actions.push({id,category,name,description,hints:[hint],points:values[0],minBp:1,maxBp:values.length,scaling:Object.fromEntries(values.map((n,i)=>[i+1,n])),legacyCompletedIds:id==='vitae_first_dependence'?['first_ghoul','first_blood_bond']:[]});
const verbs = {Faire:'Faites',Obtenir:'Obtenez',Rassembler:'Rassemblez',Briser:'Brisez',Préserver:'Préservez',Transformer:'Transformez',Mettre:'Mettez',Résoudre:'Résolvez',Sécuriser:'Sécurisez',Établir:'Établissez',Conduire:'Conduisez',Récupérer:'Récupérez',Rompre:'Rompez',Ouvrir:'Ouvrez',Transmettre:'Transmettez',Rendre:'Rendez',Dévoiler:'Dévoilez',Reconstituer:'Reconstituez',Déjouer:'Déjouez',Découvrir:'Découvrez',Infiltrer:'Infiltrez',Soustraire:'Soustrayez',Démanteler:'Démantelez',Retourner:'Retournez',Gagner:'Gagnez',Sauver:'Sauvez',Créer:'Créez',Conclure:'Concluez',Placer:'Placez',Rallier:'Ralliez',Unifier:'Unifiez',Assurer:'Assurez',Maintenir:'Maintenez',Élucider:'Élucidez',Acquérir:'Acquérez',Réussir:'Réussissez',Neutraliser:'Neutralisez',Renverser:'Renversez',Écarter:'Écartez',Accomplir:'Accomplissez',Prendre:'Prenez',Construire:'Construisez',Surmonter:'Surmontez',Adapter:'Adaptez',Réaliser:'Réalisez',Reprendre:'Reprenez',Achever:'Achevez',Protéger:'Protégez',Entrer:'Entrez',Détacher:'Détachez',Mener:'Menez',Confondre:'Confondez',Appliquer:'Appliquez',Franchir:'Franchissez',Détourner:'Détournez',Désorganiser:'Désorganisez',Sortir:'Sortez',Restaurer:'Restaurez',Empêcher:'Empêchez',Libérer:'Libérez',Former:'Formez'};
for (const action of actions.filter(a => a.clan)) {
  action.description = action.description.split(';').map(part => part.trim()).map(part => {
    const word = part.split(' ')[0];
    const key = word[0].toUpperCase() + word.slice(1);
    return verbs[key] ? verbs[key] + part.slice(word.length) : part;
  }).join('. Ou ');
}
// Textes Brujah révisés ; conserver les identifiants et les règles de progression.
const brujahTexts = [
  [
    "Le prix du refus",
    "Refusez une autorité qui prétend décider à votre place et acceptez le prix réel de votre insoumission — ou forcez-la à reconnaître qu’elle est allée trop loin.",
    "Refusez un ordre injuste, récupérez ce qui vous a été arraché ou défiez une interdiction malgré les représailles qu’elle pourrait entraîner."
  ],
  [
    "Les voix qui se lèvent",
    "Faites de votre colère ou de votre conviction une étincelle que d’autres choisissent de suivre.",
    "Ralliez plusieurs personnes autour d’une action concrète : défendre l’un des leurs, contester une décision ou arracher quelque chose que personne n’aurait obtenu seul."
  ],
  [
    "Le feu des idées",
    "Mettez une conviction à l’épreuve face à quelqu’un qui pouvait réellement la briser — et faites de vos paroles, de vos actes ou de votre colère une réponse impossible à ignorer.",
    "Affrontez un adversaire sur ses propres principes, révélez la contradiction d’une autorité ou faites changer de camp quelqu’un qui avait de bonnes raisons de vous résister."
  ],
  [
    "Un ordre nouveau",
    "Faites tomber une règle ou une domination établie, puis imposez une alternative capable de survivre à ceux qui préféraient l’ancien ordre.",
    "Renversez un privilège, redistribuez une ressource ou imposez de nouvelles règles à un groupe malgré ceux qui avaient intérêt à ce que rien ne change."
  ],
  [
    "La cause vous survivra",
    "Faites d’une conviction quelque chose qui n’a plus besoin de vous pour exister.",
    "Transmettez votre combat à ceux qui le poursuivront sans vous, fondez un mouvement capable de vous survivre ou acceptez que votre cause évolue entre les mains de ceux qui l’ont faite leur."
  ]
];
brujahTexts.forEach(([name, description, hint], index) => {
  const action = actions.find(row => row.id === `vitae_brujah_${index + 1}`);
  Object.assign(action, { name, description, hints: [hint] });
});
const firstBeast = actions.find(a => a.id === 'first_frenzy');
firstBeast.id = 'vitae_first_beast';
firstBeast.legacyCompletedIds = ['first_frenzy'];
const categories = {
  "unique": {
    "name": "Les premières cicatrices",
    "description": "Des expériences fondatrices, une fois dans votre existence.",
    "icon": "⭐"
  },
  "clan": {
    "name": "L’héritage de votre sang",
    "description": "Le Sang en vous connaît la voie, mais il ne livre pas tous ses secrets aux plus jeunes.",
    "icon": "🧛"
  },
  "general": {
    "name": "Les épreuves de la nuit",
    "description": "Conquérir, protéger, apprendre : des accomplissements qui laissent une trace.",
    "icon": "⚔️"
  },
  "social": {
    "name": "Les chaînes invisibles",
    "description": "Dettes, secrets et serments : dans la nuit, les crocs ne sont pas les seules armes.",
    "icon": "⛓️"
  },
  "resonance": {
    "name": "Les saveurs du sang",
    "description": "Atteindre une source singulière au-delà d’une chasse ordinaire.",
    "icon": "🩸"
  },
  "irreversible": {
    "name": "Les actes sans retour",
    "description": "Certains choix marquent le sang, la lignée et l’âme elle-même. Ils ne se réclament pas : ils doivent naître de l’histoire.",
    "icon": "💀",
    "warning": "⚠ Ces actes ne peuvent être soumis que lorsqu’ils émergent naturellement du récit et entraînent des conséquences durables. Sous validation stricte du MJ"
  }
};
const catalog = {categories,version:2,thresholds:{1:30,2:60,3:120,4:250},aliases:{hecata:'giovanni',ministry:'setite',setites:'setite',assamites:'banu_haqim',assamite:'banu_haqim',malkavien:'malkavian',gargouilles:'gargoyles'},actions};
fs.writeFileSync('data/blood_actions.json',JSON.stringify(catalog,null,2)+'\n');
console.log(`${actions.length} actions written`);
