/**
 * Disciplines de Vampire: The Masquerade V20
 *
 * Chaque discipline a 5 niveaux de pouvoir.
 * L'accès dépend du clan (disciplines de clan) et du niveau de Puissance du Sang.
 *
 * Accès par Puissance du Sang:
 * - BP 1: Niveaux 1-2
 * - BP 2: Niveaux 1-3
 * - BP 3: Niveaux 1-4
 * - BP 4-5: Niveaux 1-5
 */

export const DISCIPLINES = {
  animalism: {
    id: "animalism",
    name: "Animalisme",
    description: "Ta Bête reconnaît ses semblables. Les créatures sauvages sentent la prédation dans ton regard et s'y soumettent.",
    powers: [
      {
        level: 1,
        name: "Murmures Fauves",
        bloodCost: 0,
        description: "Croise le regard d'un animal et parle-lui comme à un égal. Le chien de garde comprendra ta requête, le rat d'égout te décrira ce qu'il a vu, le corbeau te guidera vers ta proie. Les animaux te répondent par leurs comportements et leurs sons que tu comprends instinctivement. Tu peux demander un service simple ou obtenir des informations sur ce qui se passe dans leur territoire."
      },
      {
        level: 2,
        name: "L'Appel",
        bloodCost: 1,
        description: "Pousse un hurlement, un cri ou un sifflement silencieux dans la nuit. Tous les animaux d'un type que tu choisis (corbeaux, rats, chiens errants, chats de gouttière) dans un rayon de plusieurs pâtés de maisons ressentent ton appel irrésistible. Ils accourent par dizaines, prêts à t'obéir. Parfait pour créer une diversion, espionner un quartier entier, ou submerger un ennemi sous une marée de créatures furieuses."
      },
      {
        level: 3,
        name: "Dompter la Bête",
        bloodCost: 3,
        description: "Ta propre Bête reconnaît celle des autres. D'un regard chargé de volonté, tu peux calmer un vampire en pleine frénésie, apaisant sa rage comme on dompte un animal sauvage. Ou au contraire, libère la terreur primordiale : fixe un vampire et réveille son Rötschreck, cette peur ancestrale du feu et du soleil qui le force à fuir comme une bête traquée."
      },
      {
        level: 4,
        name: "Communion Spirituelle",
        bloodCost: 3,
        description: "Ferme les yeux et projette ton esprit dans le corps d'un animal que tu as touché. Pendant que ton corps de vampire tombe en torpeur, tu vois par les yeux du faucon planant au-dessus de la ville, tu cours dans les rues avec le corps du loup, tu te faufiles dans les conduits avec celui du rat. Tu contrôles totalement l'animal, gardant ton intelligence et ta perception. L'espionnage parfait, personne ne soupçonne l'oiseau sur le rebord de la fenêtre."
      },
      {
        level: 5,
        name: "Libérer la Bête",
        bloodCost: 9,
        description: "Quand la frénésie monte en toi, projette-la violemment dans une victime proche. Ta Bête bondit de ta poitrine vers la sienne, et c'est elle qui sombre dans la rage animale tandis que tu deviens étrangement vide, froid, incapable d'émotions pendant quelques heures. Tu peux diriger ta Bête vers un ennemi pour qu'il se transforme en monstre enragé, ou vers un innocent pour t'en débarrasser. Quand ta Bête reviendra, elle se souviendra de ce que tu lui as fait."
      }
    ]
  },

  auspex: {
    id: "auspex",
    name: "Auspex",
    description: "Le voile entre les mondes s'efface. Tes sens transcendent la chair pour percevoir ce que les mortels ne verront jamais.",
    powers: [
      {
        level: 1,
        name: "Sens Accrus",
        bloodCost: 0,
        description: "Concentre-toi et l'un de tes sens devient surhumain. Choisis de voir dans l'obscurité totale des égouts comme en plein jour, d'entendre une conversation chuchotée à trois étages de distance, de suivre une trace à l'odeur comme un limier, de goûter le moindre poison dans le vin, ou de sentir les vibrations de pas à travers un mur. Les détails invisibles aux mortels t'apparaissent clairement. La contrepartie ? Pendant ce temps, tu es hypersensible : un flash de lumière t'aveugle, un bruit fort te paralyse."
      },
      {
        level: 2,
        name: "Perception de l'Aura",
        bloodCost: 0,
        description: "Regarde quelqu'un et tu vois son âme nue. Des volutes de couleurs tournent autour de lui : rouge pour la colère, bleu pour le calme, noir strié d'écarlate pour un vampire, or pâle pour un mortel pieux, vert maladif pour l'envie. Tu discernes ses émotions dominantes, détectes s'il ment, vois s'il est ensorcelé par la Domination, ou reconnais sa vraie nature surnaturelle. Les auras ne mentent jamais, mais les interpréter demande de l'expérience."
      },
      {
        level: 3,
        name: "Toucher de l'Esprit",
        bloodCost: 3,
        description: "Prends un objet entre tes mains et ferme les yeux. Les émotions et souvenirs qui y sont imprégnés déferlent dans ton esprit en visions fragmentées. Ce couteau ? Tu vois son propriétaire le plonger dans le dos de sa victime. Cette lettre ? Tu ressens le désespoir de celle qui l'a écrite. Plus l'objet est chargé émotionnellement ou ancien, plus les visions sont intenses. Touche un mur et vois le meurtre qui s'y est déroulé il y a dix ans."
      },
      {
        level: 4,
        name: "Télépathie",
        bloodCost: 3,
        description: "Fixe quelqu'un et plonge dans son esprit. Ses pensées de surface te parviennent comme des murmures : 'Je dois cacher cette lettre', 'Il ment, je le sais', 'Comment sortir d'ici ?'. Tu peux aussi projeter tes propres pensées directement dans sa tête, créant une conversation silencieuse. Avec de l'effort, tu peux fouiller plus profondément, cherchant un souvenir précis, mais l'esprit résiste comme un château fortifié. Les pensées des vampires anciens sont encore plus difficiles à pénétrer."
      },
      {
        level: 5,
        name: "Projection Psychique",
        bloodCost: 9,
        description: "Ton esprit se détache de ton corps de chair qui s'effondre, inanimé. Tu flottes au-dessus, forme fantomatique d'énergie psychique argentée, invisible aux mortels. Traverse les murs, vole au-dessus de la ville à la vitesse de la pensée, explore le repaire de ton ennemi sans risque. Tu peux voyager jusqu'au plan astral, un monde de symboles et d'archétypes où rôdent des entités étranges. Mais ton corps est vulnérable : s'il meurt pendant ton absence, ton esprit erre pour l'éternité."
      }
    ]
  },

  celerity: {
    id: "celerity",
    name: "Célérité",
    description: "Le sang mort dans tes veines pulse d'une énergie explosive. Le monde ralentit autour de toi tandis que tu deviens l'éclair.",
    powers: [
      {
        level: 1,
        name: "Grâce Féline",
        bloodCost: 0,
        description: "Ton corps se meut avec une fluidité surnaturelle qui défie les lois de la biomécanique. Esquive les coups avec des torsions impossibles, rattrape un objet qui tombe avant qu'il ne touche le sol, tourne un coin en pleine course sans ralentir. Aux yeux des mortels, tu sembles simplement très agile. Ceux qui savent reconnaissent le signe du prédateur."
      },
      {
        level: 2,
        name: "Rapidité",
        bloodCost: 1,
        description: "Invoque le sang et le monde ralentit. Tu dégaines ton arme, tires, et la ranges avant que ton adversaire n'ait fini de cligner des yeux. Frappe deux fois dans le temps qu'il faut à un mortel pour lever son poing. Cours le long d'un couloir, ouvre chaque porte, fouille chaque pièce en quelques secondes. Les mortels voient un flou, une ombre trop rapide pour être suivie du regard."
      },
      {
        level: 3,
        name: "Fulgurance",
        bloodCost: 3,
        description: "Tu es là, puis là-bas. Les témoins jurent que tu t'es téléporté. En réalité, tu as traversé la distance en une fraction de seconde, trop vite pour que l'œil humain puisse suivre. Traverse une rue avant que le feu ne passe au rouge, apparais derrière ton ennemi alors qu'il te regardait de face il y a un instant. La distance n'a plus de sens à cette vitesse, seulement la ligne droite entre toi et ta destination."
      },
      {
        level: 4,
        name: "Lenteur du Monde",
        bloodCost: 3,
        description: "Le temps se fige presque. Tu vois la balle sortir du canon au ralenti, tu lis les lèvres de ton ennemi formuler l'ordre avant qu'il ne sorte de sa bouche, tu observes chaque goutte d'eau de la pluie suspendue dans l'air. Tu agis, agis encore, et encore, accomplissant en un battement de cœur ce qui prendrait des secondes à un mortel. Vide ton chargeur, cours jusqu'à ton ennemi, recharge, tire à nouveau, tout cela pendant qu'il lève son bras pour se protéger."
      },
      {
        level: 5,
        name: "Projection Éclair",
        bloodCost: 9,
        description: "Tu deviens vitesse pure. Traverse plusieurs pâtés de maisons en un clin d'œil, cours sur les murs et au plafond, ton inertie te portant là où la gravité ne peut pas te retenir. Pour les mortels, tu disparais simplement d'un endroit pour réapparaître ailleurs, laissant derrière toi un courant d'air et peut-être une image rémanente sur leur rétine. À cette vitesse, tu peux courir sur l'eau, attraper une flèche en plein vol, ou contourner une explosion."
      }
    ]
  },

  dominate: {
    id: "dominate",
    name: "Domination",
    description: "Ton regard est une chaîne, ta voix un fouet. Les esprits faibles se brisent devant ta volonté comme du verre.",
    powers: [
      {
        level: 1,
        name: "Commandement",
        bloodCost: 1,
        description: "Regarde quelqu'un dans les yeux et donne-lui un ordre d'un seul mot : 'Fuis !', 'Tombe !', 'Oublie !', 'Parle !'. Ta volonté s'écrase contre la sienne comme un marteau. Il doit obéir immédiatement, incapable de résister à cet impératif qui résonne dans son crâne. L'ordre doit être simple et direct, mais les possibilités sont infinies : faire tomber une arme, avouer un secret, quitter la pièce. Le commandement ne dure qu'un instant, mais cet instant peut tout changer."
      },
      {
        level: 2,
        name: "Mésmerisme",
        bloodCost: 1,
        description: "Plonge ton regard dans le sien et parle doucement. Implante une suggestion complexe dans son subconscient comme on programme une machine : 'Quand tu verras le Prince, tu oublieras ce que tu as vu ce soir', 'Si quelqu'un pose des questions, tu diras que j'étais avec toi toute la soirée'. La suggestion reste dormante jusqu'à ce que la condition se déclenche. La victime ne se souviendra pas de tes instructions, elle agira simplement comme si c'était son idée. Tu peux créer des alibis, des taupes, des saboteurs qui ne savent pas qu'ils le sont."
      },
      {
        level: 3,
        name: "Oubli",
        bloodCost: 3,
        description: "Regarde-le dans les yeux et vole ses souvenirs. Efface les dernières minutes de sa mémoire comme on gomme du crayon, fais disparaître toute la soirée, ou plonge plus profond pour arracher des années entières. Tu peux aussi réécrire ses souvenirs : il se souviendra t'avoir vu ailleurs, ou que c'est son ami qui l'a trahi, pas toi. Les vampires utilisent ce pouvoir pour préserver la Mascarade, pour créer des témoins fiables de crimes qu'ils n'ont pas commis, ou simplement pour que leurs proies oublient le baiser."
      },
      {
        level: 4,
        name: "Conditionnement",
        bloodCost: 3,
        description: "Séance après séance, nuit après nuit, tu brises sa volonté comme on dresse un animal. Chaque session de Domination enfonce les chaînes plus profondément : obéissance absolue, dévotion totale, soumission sans limite. Après des semaines ou des mois, sa personnalité est remodelée. Il t'aime, te craint, te vénère. Il trahira sa famille pour toi, tuera pour toi, mourra pour toi en souriant. Les esclaves ainsi conditionnés sont appelés des goules de l'esprit, et leur loyauté dépasse celle du sang."
      },
      {
        level: 5,
        name: "Possession",
        bloodCost: 9,
        description: "Fixe un mortel dans les yeux et projette ton esprit dans le sien, l'écrasant, le noyant, le poussant dans un coin obscur de son propre crâne. Tu prends le contrôle total de son corps. Pendant que ton enveloppe de vampire tombe en torpeur, tu vis sa vie : tu sens la chaleur du soleil, tu goûtes la nourriture, tu respires. Tu peux marcher en plein jour, passer inaperçu, accéder à des lieux interdits aux vampires. Mais son esprit hurle dans sa prison mentale, et s'il meurt pendant que tu l'habites, ton esprit meurt avec lui."
      }
    ]
  },

  fortitude: {
    id: "fortitude",
    name: "Force d'Âme",
    description: "Ton corps mort est plus résistant que l'acier vivant. Balles, lames et flammes se brisent contre ta chair de cadavre.",
    powers: [
      {
        level: 1,
        name: "Résilience",
        bloodCost: 0,
        description: "Les coups qui briseraient les os d'un mortel te font à peine reculer. Une batte de baseball sur le crâne ? Tu secoues la tête et continues d'avancer. Tombe du deuxième étage et relève-toi. Reçois des coups de poing brutaux et encaisse sans broncher. Tes muscles morts et ton sang stagnant absorbent l'impact comme du caoutchouc. Les contusions et fractures guérissent en quelques nuits, ou instantanément si tu dépenses de la vitae."
      },
      {
        level: 2,
        name: "Endurance",
        bloodCost: 0,
        description: "Les balles pénètrent ta chair mais ne causent que des blessures superficielles, comme si tu étais fait de bois dur. Un couteau planté dans ton ventre ne te ralentit même pas. Ta peau morte est comme du cuir tanné, tes os comme du chêne. Même le feu et les premiers rayons du soleil te brûlent moins qu'ils ne le devraient - tu as quelques précieuses secondes de plus pour t'échapper de l'incendie ou plonger dans l'ombre avant que ton corps ne se consume."
      },
      {
        level: 3,
        name: "Résistance",
        bloodCost: 0,
        description: "Même les dégâts qui devraient te détruire définitivement ne font que t'affaiblir. Les griffes d'un loup-garou déchirent ta chair mais ne la brûlent pas comme elles le devraient. Une torche enflammée te roussit mais ne t'embrase pas immédiatement. Tu peux continuer à agir malgré des blessures qui mettraient un autre vampire en torpeur : un pieu dans le cœur te paralyse, mais ton esprit reste conscient, observant, attendant. La douleur existe toujours, mais elle est distante, sans importance."
      },
      {
        level: 4,
        name: "Inébranlable",
        bloodCost: 0,
        description: "La douleur n'est plus qu'un concept abstrait. Marche avec un bras arraché, combat avec le ventre ouvert, cours malgré les jambes brisées. Ton corps refuse simplement d'abandonner. Les flammes lèchent ta chair sans te faire hurler, le soleil te brûle mais tu peux tenir assez longtemps pour achever ta mission avant de t'effondrer. Les témoins te voient continuer après des blessures qui auraient tué dix hommes et comprennent qu'ils font face à quelque chose d'inhumain."
      },
      {
        level: 5,
        name: "Invulnérabilité",
        bloodCost: 0,
        description: "Tu es un monument de pierre animé. Les balles rebondissent sur ta peau en y laissant à peine une marque, les lames se tordent et se brisent contre tes os. Traverse un immeuble en feu pour sauver ton havre, tes vêtements et cheveux brûlent mais ton corps tient. Même la lumière du soleil, le fléau de tous les vampires, te consume lentement au lieu de t'incinérer instantanément. Tu n'es pas immortel, mais tu es la chose qui se rapproche le plus de l'indestructibilité dans la nuit."
      }
    ]
  },

  obfuscate: {
    id: "obfuscate",
    name: "Occultation",
    description: "Tu plies la perception comme d'autres plient la lumière. Les regards glissent sur toi, les esprits t'oublient instantanément.",
    powers: [
      {
        level: 1,
        name: "Cape d'Ombre",
        bloodCost: 0,
        description: "Fonds-toi dans l'ombre d'un recoin, d'une colonne, d'une alcôve. Reste immobile et tu deviens... rien. Pas invisible : les gens pourraient techniquement te voir si ils regardaient directement, mais leur cerveau refuse d'enregistrer ta présence. Leur regard glisse sur toi comme l'eau sur du verre. Tu es juste un détail sans importance, un morceau du décor, un rien. Bouge trop vite et le charme se brise. Parfait pour écouter des conversations ou attendre le moment parfait pour frapper."
      },
      {
        level: 2,
        name: "Présence Invisible",
        bloodCost: 0,
        description: "Maintenant tu peux marcher parmi eux. Traverse une foule, longe un couloir, suis ta cible dans la rue. Les gens te voient subconsciemment et s'écartent sans savoir pourquoi, comme on évite un poteau. Les caméras de surveillance enregistrent ton passage mais l'opérateur qui regarde l'écran ne remarque rien. Tu peux fouiller un bureau pendant que le propriétaire travaille à son bureau, voler des clés dans la poche de quelqu'un, passer devant un garde. Ne fais rien pour attirer l'attention et tu restes invisible."
      },
      {
        level: 3,
        name: "Masque aux Mille Visages",
        bloodCost: 3,
        description: "Au lieu de disparaître, projette une autre image : un visage différent, des vêtements différents, une corpulence différente. Tu ne changes pas physiquement, mais tous ceux qui te regardent voient ce que tu veux qu'ils voient. Deviens ce PDG pour entrer dans l'immeuble, prends les traits de son garde du corps, ou apparais comme un parfait inconnu. Les photos et vidéos montreront ton vrai visage, mais les témoins oculaires jureront avoir vu quelqu'un d'autre. Change d'apparence en un instant pour semer tes poursuivants."
      },
      {
        level: 4,
        name: "Disparition",
        bloodCost: 3,
        description: "En pleine conversation, en pleine course, en plein combat : disparais. Un instant tu es là, l'instant suivant tu n'y es plus, évaporé comme de la fumée. Même ceux qui te regardaient directement clignent des yeux, confus, se demandant où tu es passé. Même les sens vampiriques et l'Auspex ont du mal à te détecter - tu es devenu un trou dans la réalité. Réapparais derrière ton adversaire, échappe-toi d'une pièce verrouillée en marchant devant les gardes stupéfaits, ou observe une scène en étant physiquement présent mais totalement imperceptible."
      },
      {
        level: 5,
        name: "Voile Collectif",
        bloodCost: 9,
        description: "Étends ton pouvoir comme un manteau. Touche tes compagnons et ils disparaissent avec toi, un groupe fantôme qui se déplace dans la ville sans être vu. Dissimule ta voiture pour passer des barrages routiers, cache un groupe de goules armées, ou fais disparaître des preuves compromettantes sous les yeux des enquêteurs. Plus le groupe est large, plus c'est difficile : si l'un d'eux attire l'attention, le voile se déchire pour tous. Mais un groupe discipliné peut traverser un aéroport bondé comme des spectres."
      }
    ]
  },

  potence: {
    id: "potence",
    name: "Puissance",
    description: "Tes muscles morts contiennent la force de la damnation. Ce qui résiste, tu le brises. Ce qui s'oppose, tu l'écrases.",
    powers: [
      {
        level: 1,
        name: "Vigueur",
        bloodCost: 0,
        description: "La force coule dans tes membres comme du fer en fusion. Soulève une moto d'une main, plie une barre de fer, broie une poignée de porte en poudre. Tes poings frappent comme des marteaux, tes mains serrent comme des étaux. Un coup bien placé brise une mâchoire, une étreinte fracture les côtes. Les mortels te voient soulever ce qui devrait être impossible et reculent, instinctivement conscients qu'ils sont face à quelque chose de contre-nature."
      },
      {
        level: 2,
        name: "Prouesse",
        bloodCost: 0,
        description: "Défonce une porte d'un coup d'épaule, arrache un lampadaire du sol pour t'en servir comme arme, tords les barreaux de fer d'une fenêtre comme du papier d'aluminium. Projette un homme à travers la pièce d'une simple poussée. Escalade un mur en plantant tes doigts dans la brique comme dans de l'argile. Ta force commence à dépasser ce que la biomécanique humaine peut expliquer - les témoins ne peuvent que regarder, horrifiés."
      },
      {
        level: 3,
        name: "Brutalité",
        bloodCost: 0,
        description: "Traverse un mur de briques comme une balle de canon. Écrase une portière de voiture en la refermant sur quelqu'un. Déchire un homme littéralement en deux si la Bête te prend. Saute d'un toit et atterris sur une voiture en l'écrasant sous ton poids et ta force. Une seule de tes frappes peut tuer un mortel net. Les armes de mêlée se brisent dans tes mains à cause de la force que tu y mets. Tu n'es plus fort qu'un humain, tu es une force de la nature."
      },
      {
        level: 4,
        name: "Fureur",
        bloodCost: 0,
        description: "Renverse une voiture d'une poussée, arrache une porte blindée de ses gonds, fais s'effondrer un pilier de béton d'un coup. Écrase l'acier dans tes mains, démolis un mur porteur d'un coup d'épaule. En combat, tes coups envoient les adversaires voler à travers les vitres et les murs. Tu peux déchirer un vampire en morceaux de tes mains nues, ou décapiter d'un seul coup. La terre tremble légèrement sous tes pas quand tu charges."
      },
      {
        level: 5,
        name: "Force Titanesque",
        bloodCost: 0,
        description: "Tu es une catastrophe naturelle à forme humaine. Arrache un arbre centenaire de terre, fais basculer un camion, détruis les fondations d'un bâtiment à mains nues. Arrête une voiture lancée à pleine vitesse en te plantant devant elle, tes pieds creusant des sillons dans l'asphalte. Projette un adversaire si fort qu'il traverse plusieurs murs. Lance une moto comme un javelot. À ce niveau de puissance, les mortels qui te voient en action parlent de démons ou de dieux. Et ils n'ont pas tort."
      }
    ]
  },

  presence: {
    id: "presence",
    name: "Présence",
    description: "Ton aura plie les émotions comme un ouragan plie les arbres. Amour, terreur, dévotion : tu es la tempête dans leurs cœurs.",
    powers: [
      {
        level: 1,
        name: "Crainte Révérencielle",
        bloodCost: 0,
        description: "Entre dans une pièce et tous les regards se tournent vers toi. Projette une aura de fascination magnétique ou de menace primordiale. Les conversations s'arrêtent, les gens s'écartent inconsciemment. Tu peux choisir l'émotion : admiration qui fait que les inconnus veulent te plaire, ou crainte qui les fait baisser les yeux. Pas besoin de contact visuel ou de mots, ta simple présence suffit. Les mortels trouvent des excuses pour rester près de toi ou pour fuir, selon ce que tu veux."
      },
      {
        level: 2,
        name: "Regard Terrifiant",
        bloodCost: 1,
        description: "Fixe quelqu'un et libère ta Bête juste assez pour qu'il la voie. Tes yeux deviennent ceux d'un prédateur antédiluvien, ton visage un masque de terreur primordiale. La victime voit sa propre mort dans ton regard et la peur absolue la submerge. Elle fuit en hurlant, se recroqueville en position fœtale, ou se fige complètement, paralysée. Même les vampires peuvent être affectés, leur propre Bête reconnaissant un prédateur supérieur. L'effet est instantané et dévastateur."
      },
      {
        level: 3,
        name: "Envoûtement",
        bloodCost: 3,
        description: "Parle à quelqu'un pendant quelques minutes et tisse autour de lui un réseau d'affection surnaturelle. Il devient fasciné par toi, pensant constamment à toi, cherchant des excuses pour te revoir. Ce n'est pas de l'amour véritable mais une obsession induite, aussi puissante qu'irrationnelle. Il te fera des faveurs, te couvrira, rationalisera tes actions horribles. Le lien émotionnel peut durer des semaines ou des mois. Cumule les victimes et tu peux bâtir un culte de mortels dévoués qui feraient n'importe quoi pour toi."
      },
      {
        level: 4,
        name: "Convocation",
        bloodCost: 3,
        description: "Concentre-toi sur quelqu'un que tu as déjà rencontré, prononce son nom, et envoie l'appel. Où qu'il soit dans la ville, il ressent une impulsion irrésistible de venir te retrouver. Il ne sait pas pourquoi, mais il doit te voir, maintenant. Il quittera son travail, sa famille, son lit au milieu de la nuit pour te rejoindre. Le trajet peut prendre des heures, mais il viendra. Il ne peut pas résister à la convocation, sauf s'il est retenu physiquement. Quand il arrive, il sera désorienté, ne comprenant pas pourquoi il est venu."
      },
      {
        level: 5,
        name: "Majesté",
        bloodCost: 9,
        description: "Active cette couronne invisible et tu deviens intouchable. Ton aura devient si écrasante, si magnifique et terrible à la fois, que personne ne peut lever la main contre toi. Les agresseurs baissent leurs armes, incapables de te frapper. Les insulteurs ravalent leurs mots. Même les vampires anciens hésitent. Tu deviens comme un roi-dieu : vénéré, craint, mais absolument inattaquable. Marche à travers une foule hostile sans être touché, donne des ordres que personne n'ose contester. Pour briser ta Majesté, il faut une volonté de fer ou ne plus te regarder du tout."
      }
    ]
  },

  protean: {
    id: "protean",
    name: "Protéisme",
    description: "Ta chair est argile, tes os sont fluides. La nature sauvage coule dans tes veines et tu peux prendre les formes de la Bête.",
    powers: [
      {
        level: 1,
        name: "Yeux de la Bête",
        bloodCost: 0,
        description: "Tes yeux brillent d'une lueur rouge sang dans l'obscurité, comme ceux d'un loup ou d'un chat. L'obscurité totale devient claire comme le jour : tu vois chaque détail dans les tunnels d'égouts, les forêts sans lune, les caves sans fenêtres. Les mortels qui croisent ton regard dans le noir voient deux orbes écarlates flottant dans les ténèbres et comprennent qu'ils sont face à un prédateur. Même la lumière ne te gêne plus : tes yeux s'adaptent instantanément, passant de la vision nocturne à la vision diurne sans aveuglement."
      },
      {
        level: 2,
        name: "Griffes de la Bête",
        bloodCost: 1,
        description: "Tes ongles s'allongent et s'épaississent, devenant des griffes d'os noir et brillant, dures comme de l'acier trempé et aiguisées comme des rasoirs. Elles poussent en quelques secondes dans un craquement d'os. Ces griffes ne sont pas de simples armes : elles infligent des blessures aggravées qui ne guérissent pas facilement, déchirant la chair vampirique comme du papier. Lacère un ennemi, déchire une gorge, éviscère d'un geste. Ou utilise-les pour escalader : plante-les dans la pierre, le béton, même l'acier, et grimpe comme une araignée."
      },
      {
        level: 3,
        name: "Fusion avec la Terre",
        bloodCost: 3,
        description: "Agenouille-toi et touche la terre nue. Ton corps se liquéfie partiellement, s'enfonçant dans le sol comme dans de l'eau. En quelques secondes, tu disparais complètement, fusionnant avec la terre, le béton, même l'asphalte. Pendant le jour, tu reposes dans les entrailles de la terre, totalement protégé du soleil. Tu es conscient de ce qui se passe au-dessus : les vibrations des pas, les voix. Si quelqu'un creuse jusqu'à toi, tu te réveilles instantanément. Au crépuscule, émerge du sol comme un cadavre surgissant de sa tombe. Impossible à trouver, impossible à atteindre."
      },
      {
        level: 4,
        name: "Forme de la Bête",
        bloodCost: 3,
        description: "Ton corps se tord, se reforme, les os craquent et la chair coule. En quelques secondes de transformation douloureuse, tu deviens un loup massif aux yeux rouges ou une chauve-souris géante. Tu gardes ton intelligence et ta personnalité, mais gains les sens et capacités de l'animal : vitesse et morsure du loup, vol et écholocation de la chauve-souris. Chasse dans les rues comme un prédateur naturel, vole au-dessus de la ville pour espionner, ou utilise ta forme animale pour échapper aux poursuivants. Les vêtements et petits objets se fondent dans la transformation."
      },
      {
        level: 5,
        name: "Forme de Brume",
        bloodCost: 9,
        description: "Ton corps se dissout en brume spectrale, un nuage de vapeur pâle à peine visible. Tu deviens intangible : les balles te traversent, les lames ne font que disperser temporairement ton essence. Glisse-toi sous les portes, à travers les grilles, les fissures dans les murs. Flotte au-dessus des obstacles, échappe à toute contrainte physique. Tu peux même te disperser complètement pour éviter un danger, te reformant plus loin. Le vent peut te pousser mais pas te blesser. Seuls le feu et le soleil peuvent te nuire sous cette forme, mais même eux causent moins de dégâts. Tu es devenu l'essence même du vampire : ni mort ni vivant, entre deux états."
      }
    ]
  },

  obtenebration: {
    id: "obtenebration",
    name: "Obténébration",
    description: "L'Abysse répond à ton appel. Les ténèbres t'obéissent comme des serviteurs, et dans ton ombre quelque chose de terrible attend.",
    powers: [
      {
        level: 1,
        name: "Jeu d'Ombres",
        bloodCost: 0,
        description: "Les ombres autour de toi s'animent à ton contact. Fais danser ton ombre sur le mur, étire celle d'un arbre pour couvrir une fenêtre, assombris un coin de la pièce pour te cacher. Les ombres que tu manipules deviennent plus sombres, plus denses, presque palpables. Éteins une lampe sans la toucher en l'enveloppant d'obscurité, fais croire à quelqu'un qu'une silhouette se déplace dans l'ombre, ou crée des zones d'obscurité pour faciliter ta fuite. C'est subtil, mais terriblement efficace pour créer la peur et la confusion."
      },
      {
        level: 2,
        name: "Linceul de la Nuit",
        bloodCost: 1,
        description: "Invoque une sphère de ténèbres absolues qui avale toute lumière. À l'intérieur : obscurité totale, même pour ceux qui peuvent voir dans le noir. Les lampes torches y meurent, les sorts de lumière s'éteignent. Pire encore, le Linceul étouffe le son, transformant les cris en murmures étouffés. Les victimes prisonnières sont aveugles, sourdes, désorientées, paniquées. Toi, tu te déplaces dans ces ténèbres comme chez toi. Crée le chaos dans un combat, couvre ta fuite, ou isole une victime pour l'éliminer sans témoins."
      },
      {
        level: 3,
        name: "Bras des Abysses",
        bloodCost: 3,
        description: "Ton ombre se soulève et des tentacules d'obscurité solide en jaillissent comme des serpents. Ces membres d'ombre sont froids au toucher, solides comme de la chair mais faits de ténèbres vivantes. Ils agrippent, frappent, étranglent selon ta volonté. Emprisonne un adversaire dans une étreinte glaciale, gifle une arme hors d'une main, soulève quelqu'un et projette-le contre un mur. Les tentacules peuvent aussi servir à manipuler des objets à distance. Les victimes paniquent souvent, horrifiées de se faire toucher par l'Abysse elle-même."
      },
      {
        level: 4,
        name: "Forme Ténébreuse",
        bloodCost: 3,
        description: "Dissous ton corps en ombre vivante, une silhouette sombre et mouvante à peine discernable dans la pénombre. Sous cette forme, tu es bidimensionnel : glisse le long des murs, coule sur le sol, rampe au plafond. Les armes physiques te traversent sans effet, les balles passent à travers toi comme à travers de la fumée. Seule la lumière intense te blesse, te forçant à fuir vers les ténèbres. Tu peux te faufiler sous les portes, à travers les grilles, dans les conduits. Tu es devenu l'ombre incarnée, une chose d'obscurité et de terreur."
      },
      {
        level: 5,
        name: "Ténèbres Intérieures",
        bloodCost: 9,
        description: "Ouvre ton âme et libère l'Abysse qui sommeille en toi. Un puits de ténèbres absolues jaillit de ta bouche, de tes yeux, de ta poitrine, s'étendant comme une tache d'encre vivante. Cette obscurité dévore tout : la lumière, le son, la chaleur, l'espoir. Ceux qui y sont pris ressentent un froid glacial, une terreur viscérale, comme s'ils tombaient dans un gouffre sans fond. L'obscurité peut consumer les objets, dissoudre les murs, aspirer les victimes dans un néant temporaire. Même les autres vampires reculent devant cette manifestation pure de l'Abysse. C'est l'arme ultime du Lasombra, mais l'utiliser trop longtemps, c'est risquer que les ténèbres ne te consument aussi."
      }
    ]
  },

  thaumaturgy: {
    id: "thaumaturgy",
    name: "Thaumaturgie",
    description: "Le sang est pouvoir, et tu en es le maître. La magie des Tremere plie la vitae à ta volonté, transformant le sang en arme.",
    powers: [
      {
        level: 1,
        name: "Goût du Sang",
        bloodCost: 0,
        description: "Une seule goutte sur ta langue et les secrets se révèlent. Goûte le sang de quelqu'un et tu sais instantanément : vampire ou mortel, quel clan, quelle génération, combien de fois il s'est nourri récemment. Si c'est un vampire, tu sens s'il a commis la diablerie, ce crime ultime qui laisse une trace indélébile dans la vitae. Tu peux analyser le sang d'une scène de crime pour identifier le coupable, vérifier l'identité d'un suspect, ou détecter un imposteur. Le sang parle, et toi seul l'entends."
      },
      {
        level: 2,
        name: "Rage du Sang",
        bloodCost: 1,
        description: "Pointe du doigt quelqu'un à distance de regard et concentre-toi. Son sang commence à chauffer, à bouillonner dans ses veines. La victime ressent une douleur atroce, comme si son corps brûlait de l'intérieur. Les mortels s'effondrent en hurlant, les vampires luttent contre la frénésie tandis que leur vitae se rebelle. La douleur est si intense qu'elle empêche toute concentration, tout mouvement coordonné. Paralyse un adversaire le temps de fuir, torture un prisonnier sans le toucher, ou force un vampire à dépenser sa précieuse vitae pour résister."
      },
      {
        level: 3,
        name: "Puissance du Sang",
        bloodCost: 3,
        description: "Concentre ta vitae par un rituel rapide, forçant le pouvoir de ton sang à irriguer tes muscles, tes réflexes, ta résistance. Pendant quelques minutes, tu deviens plus fort, plus rapide, plus résistant qu'aucun vampire de ton âge ne devrait l'être. Combats comme un Ancien alors que tu n'es qu'un néonate, accomplis des exploits physiques impossibles. Le prix ? Ta vitae brûle vite sous cette forme concentrée, te laissant affaibli et affamé quand l'effet se dissipe. Mais ces quelques minutes de puissance surnaturelle peuvent faire la différence entre la victoire et la destruction."
      },
      {
        level: 4,
        name: "Vol de Vitae",
        bloodCost: 3,
        description: "Tends la main vers une victime visible et invoque le sortilège. Son sang répond à ton appel, jaillissant de ses yeux, son nez, sa bouche, même à travers sa peau. La vitae vole à travers l'air en un jet écarlate pour se déverser dans ta bouche ouverte, ou dans un calice que tu tiens. C'est violent, spectaculaire, terrifiant : la victime se vide littéralement sous tes yeux tandis que tu te nourris à distance. Pas besoin de toucher, pas besoin de mordre. Le sang vient à toi. Les mortels meurent en quelques secondes, les vampires entrent en torpeur, vidés de leur vitae."
      },
      {
        level: 5,
        name: "Chaudron de Sang",
        bloodCost: 9,
        description: "Le sort le plus meurtrier de la Thaumaturgie. Fixe ta victime et prononce la formule. Son sang atteint le point d'ébullition instantanément. De l'intérieur, le corps explose : le sang bout, la chair se déchire, les os se fissurent sous la pression. Les mortels éclatent littéralement, leurs veines explosant dans une fontaine de sang et de vapeur. Les vampires hurlent et s'effondrent, leur corps se consumant de l'intérieur en dégâts aggravés massifs. Même les Anciens craignent ce pouvoir. Un seul mot, un seul geste, et ton ennemi se transforme en torche vivante de sang bouillonnant."
      }
    ]
  },

  vicissitude: {
    id: "vicissitude",
    name: "Vicissitude",
    description: "Chair et os sont ton argile, la forme humaine juste une suggestion. Sculpte la viande vivante selon ta vision tordue.",
    powers: [
      {
        level: 1,
        name: "Modelage Mineur",
        bloodCost: 1,
        description: "Touche ton visage et la chair répond, malléable sous tes doigts comme de la cire chaude. Change la forme de ton nez, la couleur de tes yeux, la structure de ta mâchoire. Deviens plus beau, plus ordinaire, ou grotesque selon tes besoins. Les changements sont permanents jusqu'à ce que tu les modifies à nouveau. Efface les cicatrices, change ton apparence pour échapper aux poursuivants, ou crée un déguisement parfait. La transformation est lente, méthodique, presque artistique. Les Tzimisce voient cela comme de la sculpture vivante, l'expression ultime de la domination sur la chair."
      },
      {
        level: 2,
        name: "Sculpture de Chair",
        bloodCost: 1,
        description: "Pose tes mains sur la peau nue de quelqu'un d'autre et modèle sa chair comme de l'argile. Déforme son visage, allonge ses membres, crée des bosses et des creux. Les victimes non consentantes hurlent pendant que tu les remodèles, sentant leur chair se tordre et se reformer. Tu peux créer de la beauté ou de l'horreur : embellir un serviteur fidèle, ou transformer un ennemi en aberration défigurée. Les changements sont permanents. Les Tzimisce punissent souvent les traîtres en les transformant en monstruosités, des avertissements vivants pour les autres."
      },
      {
        level: 3,
        name: "Sculpture d'Os",
        bloodCost: 3,
        description: "Maintenant tu maîtrises le squelette. Fais jaillir des pointes d'os de tes mains comme des lames, crée des plaques osseuses sous ta peau comme une armure naturelle, déforme les os de tes victimes pour les paralyser ou les déformer de façon grotesque. Tu peux façonner des armes vivantes : des griffes d'os en spirale, des cornes sur ton crâne, des épines le long de ta colonne vertébrale. Ou torture tes ennemis en faisant pousser leurs os dans de mauvaises directions, créant des angles impossibles qui déchirent leur chair de l'intérieur."
      },
      {
        level: 4,
        name: "Forme Horrible",
        bloodCost: 3,
        description: "Libère le monstre en toi. Ton corps se tord dans une transformation agonisante : tu grandis jusqu'à 2m50, ta peau devient noire et cireuse, des plaques d'os jaillissent pour former une armure naturelle, tes doigts s'allongent en griffes dentelées, ta mâchoire se déforme en gueule pleine de crocs. Tu deviens la Bête incarnée, une créature de cauchemar conçue pour le carnage. Ta force et ta résistance augmentent drastiquement. Les mortels fuient en hurlant, même les vampires reculent. Tu es devenu le monstre que les enfants craignent dans le noir."
      },
      {
        level: 5,
        name: "Forme de Sang",
        bloodCost: 9,
        description: "Dissous complètement ton corps en une flaque de vitae sentiente, un mare de sang qui pense et bouge. Tu t'étales sur le sol, te coules sous les portes, à travers les grilles, dans les fissures. Sous cette forme, tu es presque invulnérable aux dégâts physiques : les balles font juste des éclaboussures, les lames te traversent sans effet. Tu peux t'étaler pour couvrir une large zone, ou te concentrer en un petit point. Engloutis un adversaire, le noyant dans ta substance, ou infiltre-toi dans des lieux impossibles. Seul le feu peut vraiment te blesser sous cette forme. Tu es devenu l'essence même de la monstruosité vampirique."
      }
    ]
  },

  necromancy: {
    id: "necromancy",
    name: "Nécromancie",
    description: "Tu marches entre la vie et la mort. Les morts te parlent, les fantômes t'obéissent, et les cadavres se lèvent à ton appel.",
    powers: [
      {
        level: 1,
        name: "Insight",
        bloodCost: 0,
        description: "Le voile entre les mondes s'amincit pour toi. Tu vois les fantômes qui errent invisibles autour des vivants, formes spectrales prisonnières entre deux mondes. Tu sens les traces de mort : un meurtre laisse une marque froide que tu peux détecter des jours après, un mourant irradie une aura particulière. Dans les cimetières et morgues, tu perçois une cacophonie d'esprits. Regarde quelqu'un et sais s'il est proche de la mort, combien de temps il lui reste. Les autres ne voient que le monde des vivants, toi tu vois les deux mondes superposés."
      },
      {
        level: 2,
        name: "Convocation",
        bloodCost: 1,
        description: "Prononce le nom d'un mort et appelle son esprit. Si tu possèdes quelque chose qui lui appartenait, ou si tu es sur le lieu de sa mort, le fantôme doit venir. Il se matérialise devant toi, forme translucide et grisâtre, confus et souvent en colère d'avoir été arraché à son repos. Tu peux l'interroger : les morts voient beaucoup de choses, et souvent les meurtriers laissent des témoins fantomatiques. L'esprit répondra à tes questions, mais il peut mentir, omettre, ou être trop dérangé pour être cohérent. Quand tu le libères, il retourne au royaume des morts."
      },
      {
        level: 3,
        name: "Compelle",
        bloodCost: 3,
        description: "Les fantômes ne sont plus de simples témoins, ils deviennent tes serviteurs. Ordonne à un esprit et il doit obéir, même contre sa volonté. Force-le à te servir d'espion, observant des lieux où tu ne peux pas aller. Utilise-le pour hanter tes ennemis, créant des phénomènes paranormaux : objets qui bougent, voix dans le vide, apparitions terrifiantes. Ou emploie-le pour posséder temporairement un mortel, créant un agent que tu contrôles indirectement. Les esprits haïssent cette servitude, mais ta volonté les enchaîne aussi sûrement que des fers."
      },
      {
        level: 4,
        name: "Animation Cadavérique",
        bloodCost: 3,
        description: "Pose ta main sur un cadavre et insuffle-lui une parodie de vie. Le corps se lève, yeux vides et mouvements saccadés, totalement sous ton contrôle. Plus le corps est frais, mieux il fonctionne : un cadavre récent peut passer pour humain avec les bons vêtements, un squelette n'est qu'un serviteur maladroit. Crée une armée de zombies pour garder ton havre, utilise des cadavres pour faire le travail sale, ou anime le corps d'un ennemi mort pour terroriser ses alliés. Les zombies n'ont aucune volonté propre, juste des extensions de la tienne."
      },
      {
        level: 5,
        name: "Tourment",
        bloodCost: 9,
        description: "Le pouvoir ultime sur la mort. Pointe un fantôme et inflige-lui une souffrance que seuls les morts peuvent connaître : son essence spectrale se déchire, se tord, hurle dans une agonie sans fin. Les esprits les plus puissants se brisent, suppliant ta miséricorde. Ou cible un mourant : au moment précis où son âme quitte son corps, saisis-la et arrache-la violemment, infligeant une mort atroce. Tu peux même torturer les autres vampires, faisant vibrer la frontière entre mort et non-mort dans leur corps, les paralysant de douleur. C'est le pouvoir absolu sur le royaume des morts."
      }
    ]
  },

  quietus: {
    id: "quietus",
    name: "Quietus",
    description: "Tu es l'assassin silencieux, juge et bourreau. Ton sang est poison, ta présence est la mort qui ne fait aucun bruit.",
    powers: [
      {
        level: 1,
        name: "Silence de la Mort",
        bloodCost: 1,
        description: "Active ce pouvoir et une bulle de silence absolu t'enveloppe. Aucun son ne peut entrer ou sortir : tes pas sont inaudibles, tes armes ne font aucun bruit, les cris de tes victimes sont étouffés avant même de quitter leur gorge. Tue en plein milieu d'une foule sans que personne n'entende, brise une fenêtre sans un tintement, tire une arme sans détonation. Les autres te voient bouger les lèvres sans entendre un mot. C'est l'arme parfaite de l'assassin : dans le silence, tu es mortel, fantôme parmi les vivants."
      },
      {
        level: 2,
        name: "Toucher du Scorpion",
        bloodCost: 1,
        description: "Concentre ta vitae et transforme-la en poison mortel. Quelques gouttes de ton sang suffisent : enduis une lame, verse-le dans un verre, ou mêle-le à de la nourriture. Quand la victime absorbe le poison, son corps se paralyse progressivement, ses muscles se figent, sa respiration devient laborieuse. Les mortels s'effondrent, incapables de bouger. Les vampires luttent, mais leur corps trahit aussi. Le poison dure plusieurs heures, laissant la victime consciente mais totalement impuissante. Parfait pour capturer quelqu'un vivant ou le laisser mourant mais conscient de son sort."
      },
      {
        level: 3,
        name: "Appel de Dagon",
        bloodCost: 3,
        description: "Fixe ta victime et invoque le pouvoir. Son sang se rebelle, remontant dans sa gorge comme une marée rouge. Elle s'étouffe sur son propre sang, crachant, suffoquant, incapable de respirer. Les mortels se noient de l'intérieur en quelques minutes atroces. Les vampires toussent de la vitae, affaiblis et paniqués. C'est silencieux, horrible, et terriblement efficace. La victime meurt sans une marque extérieure, juste du sang coulant de sa bouche et son nez. L'arme parfaite pour un meurtre qui ressemble à une mort naturelle."
      },
      {
        level: 4,
        name: "Caresse de Baal",
        bloodCost: 3,
        description: "Ton sang devient acide corrosif au contact de l'air. Ouvre une veine et ton sang jaillit, brûlant tout ce qu'il touche comme de l'acide concentré. La peau se dissout, le métal se corrode, le bois fume et se décompose. Asperge un ennemi et regarde sa chair se consumer. Utilise-le pour détruire des preuves, dissoudre des serrures, ou torturer des victimes. Même les autres vampires hurlent quand ton sang acide les brûle, infligeant des dégâts aggravés qui ne guérissent pas facilement. Mais attention : chaque utilisation te coûte de la précieuse vitae."
      },
      {
        level: 5,
        name: "Goût de la Mort",
        bloodCost: 9,
        description: "Le pouvoir ultime du Quietus. Crache ton sang comme un serpent crache son venin. Un jet d'acide écarlate jaillit de ta bouche, traversant plusieurs mètres pour frapper ta cible. Tout ce que le jet touche se consume : chair, os, vêtements, métal. Les victimes hurlent pendant que l'acide les dévore vivantes, leur corps se dissolvant en fumée toxique. C'est spectaculaire, brutal, définitif. Les Banu Haqim utilisent ce pouvoir comme jugement final, une exécution qui ne laisse presque rien de la victime. Ton sang est devenu l'incarnation de la mort elle-même."
      }
    ]
  },

  serpentis: {
    id: "serpentis",
    name: "Serpentis",
    description: "Le serpent du jardin coule dans tes veines. Tentation, transformation, et l'impossible don d'échapper à la mort du pieu.",
    powers: [
      {
        level: 1,
        name: "Regard Hypnotique",
        bloodCost: 1,
        description: "Fixe quelqu'un dans les yeux. Tes pupilles deviennent verticales, reptiliennes, captivantes. La victime est paralysée, incapable de détourner le regard, son esprit pris dans un piège hypnotique. Elle reste debout, consciente mais totalement sans défense, fascinée par le prédateur qu'elle voit en toi. Tu peux bouger autour d'elle, lui parler, même la toucher sans briser le charme. Le contact visuel rompu, elle cligne des yeux, désorientée. Parfait pour neutraliser un adversaire sans violence, ou pour t'approcher d'une proie sans alarme."
      },
      {
        level: 2,
        name: "Langue du Serpent",
        bloodCost: 0,
        description: "Ta langue s'allonge hors de ta bouche, devenant un appendice fourchu de près d'un mètre, couvert d'écailles et étonnamment fort. Utilise-la comme un bras supplémentaire : saisis des objets hors de portée, fouette-la comme un fouet pour frapper ou désarmer, ou goûte l'air pour suivre une piste comme un serpent. Tu peux aussi l'utiliser pendant le baiser, ta langue serpentine glissant dans la plaie pour aspirer le sang plus efficacement. C'est perturbant, alien, et terriblement pratique. La langue se rétracte instantanément quand tu le désires."
      },
      {
        level: 3,
        name: "Peau de Vipère",
        bloodCost: 0,
        description: "Ta peau se transforme, développant des écailles dures et brillantes comme celles d'un python. Ces écailles forment une armure naturelle qui dévie les lames, ralentit les balles, absorbe les coups. Ta peau devient difficile à percer, résistante aux coupures. Les écailles peuvent être de n'importe quelle couleur : vert sombre, noir brillant, même des motifs complexes. Tu peux choisir de ne transformer qu'une partie de ton corps ou de te couvrir entièrement. Sous cette forme, tu ressembles à un hybride homme-reptile, beau et terrible à la fois."
      },
      {
        level: 4,
        name: "Forme du Cobra",
        bloodCost: 3,
        description: "Ton corps se liquéfie et se reforme en un serpent massif de 3 à 4 mètres de long : un cobra royal, un python, ou une vipère géante. Tu gardes ton intelligence et ta conscience, mais gains les sens du serpent : vision thermique, détection des vibrations, et bien sûr des crocs venimeux. Glisse-toi dans des espaces impossibles, grimpe les murs avec aisance, ou frappe avec une vitesse surhumaine. Ton venin est mortel pour les mortels, paralysant pour les vampires. Tu peux aussi mordre pour te nourrir sous cette forme, ton morsure serpentine étant plus discrète qu'une morsure humaine."
      },
      {
        level: 5,
        name: "Cœur des Ténèbres",
        bloodCost: 9,
        description: "Le rituel le plus étrange du Serpentis. Plonge ta main dans ta propre poitrine et arrache ton cœur. Il bat toujours dans ta paume, noir et luisant. Tu peux le cacher n'importe où : enterré, dans un coffre, au fond d'un lac. Tant que ton cœur est séparé de ton corps, tu es immunisé au pieu dans la poitrine - il n'y a rien à embrocher. Tu deviens extrêmement difficile à détruire définitivement. Mais attention : si quelqu'un trouve ton cœur caché et le détruit, tu meurs instantanément, où que tu sois. Ce pouvoir est la liberté ultime, ou la vulnérabilité ultime, selon qui détient ton cœur."
      }
    ]
  },

  dementation: {
    id: "dementation",
    name: "Aliénation",
    description: "La folie est contagieuse, et tu es le vecteur. Dans ton sillage, les esprits se brisent comme du verre.",
    powers: [
      {
        level: 1,
        name: "Passion",
        bloodCost: 1,
        description: "Touche quelqu'un ou parle-lui brièvement, et tords le cadran de ses émotions. Amplifie sa colère jusqu'à la rage, sa tristesse jusqu'au désespoir, sa joie jusqu'à l'euphorie maniaque, ou sa peur jusqu'à la terreur paralysante. L'émotion choisie submerge toute raison : le garde en colère abandonne son poste pour régler ses comptes, le rival déprimé rentre chez lui en pleurant, l'informateur nerveux panique et fuit. L'effet dure plusieurs heures, le laissant confus quant à la raison de ses actions. C'est subtil, mais dévastateur pour l'équilibre mental."
      },
      {
        level: 2,
        name: "Hantise",
        bloodCost: 1,
        description: "Plonge ton regard dans le sien et implante une phobie ou une obsession dans les profondeurs de son esprit. Crée une peur irrationnelle : phobie des espaces clos, terreur des oiseaux, conviction que les miroirs cachent quelque chose de terrible. Ou implante une obsession : compter compulsivement, vérifier les serrures sans fin, paranoïa que tout le monde complote contre lui. La victime sait que c'est irrationnel, mais ne peut pas s'en empêcher. La hantise dure des semaines ou des mois, rongeant lentement la santé mentale. Un outil parfait pour détruire quelqu'un sans le toucher."
      },
      {
        level: 3,
        name: "Yeux du Chaos",
        bloodCost: 0,
        description: "Ta folie devient une lentille qui révèle les patterns cachés de l'univers. Regarde une scène et tu vois les connections invisibles : cette personne va trahir dans dix minutes, ce fil tenu fera tomber tout l'édifice, cette parole déclenchera la violence. Tu perçois l'ordre dans le chaos, les failles dans les plans, les faiblesses cachées. Anticipe les comportements, trouve l'incohérence dans un mensonge, vois la solution que la logique ne peut pas trouver. Mais attention : voir trop de patterns mène à la vraie folie. Les Malkaviens appellent ça 'la sagesse du fou'."
      },
      {
        level: 4,
        name: "Voix de la Folie",
        bloodCost: 3,
        description: "Parle à quelqu'un et laisse ta démence s'infiltrer dans tes mots comme un virus. Quelques phrases suffisent, prononcées dans un murmure ou un cri : 'Les murs ont des yeux', 'Ils viennent tous pour toi', 'Tu n'es pas réel'. L'esprit de la victime s'effondre instantanément. Elle sombre dans une folie complète : hallucinations, paranoïa délirante, catatonie, ou violence irrationnelle. Mortels et vampires sont affectés. L'effet dure quelques heures, la laissant ravagée et traumatisée. Certains ne s'en remettent jamais complètement."
      },
      {
        level: 5,
        name: "Démence Totale",
        bloodCost: 9,
        description: "Le pouvoir ultime de l'Aliénation. Touche quelqu'un et fracture définitivement son esprit en milliers de fragments. Sa psyché se brise comme un miroir, créant une psychose permanente et profonde. La victime développe des personnalités multiples, des hallucinations constantes, une dissociation complète de la réalité. Elle ne guérira jamais, même avec des années de thérapie. Les mortels finissent internés, les vampires deviennent dangereux et imprévisibles. C'est un destin pire que la mort : une éternité prisonnière d'un esprit brisé. Les Malkaviens utilisent ce pouvoir rarement, car c'est partager leur propre malédiction avec un autre."
      }
    ]
  },

  chimerstry: {
    id: "chimerstry",
    name: "Chimérie",
    description: "La réalité est malléable pour ceux qui savent voir. Tisse des mensonges si convaincants que le monde lui-même y croit.",
    powers: [
      {
        level: 1,
        name: "Ignis Fatuus",
        bloodCost: 1,
        description: "Crée une illusion simple affectant un seul sens. Fais apparaître une image : un visage dans la foule, un mur où il n'y a qu'un couloir, une silhouette menaçante dans l'ombre. Ou crée un son : des pas derrière quelqu'un, une voix appelant au secours, le clic d'une arme qu'on arme. Ou même une odeur : fumée d'incendie, parfum distinctif, odeur de cadavre. L'illusion est statique, comme une photographie ou un enregistrement en boucle, mais parfaitement convaincante pour le sens ciblé. Crée des distractions, sème la confusion, ou fais croire à une menace inexistante."
      },
      {
        level: 2,
        name: "Fata Morgana",
        bloodCost: 1,
        description: "Maintenant tes illusions sont complètes : vue, son, odeur, même le toucher superficiel. Crée un mur solide en apparence, une personne convaincante qui respire et dégage de la chaleur, un feu qui crépite et sent la fumée. Les victimes peuvent toucher tes illusions et sentir de la résistance (mais pas de poids réel). Fais apparaître un ennemi pour détourner l'attention, crée un obstacle pour bloquer une poursuite, ou conjure un alibi visuel. L'illusion reste statique, mais elle est si détaillée que la tromper tous les sens à la fois."
      },
      {
        level: 3,
        name: "Apparition",
        bloodCost: 3,
        description: "Tes illusions prennent vie. Elles bougent, réagissent, interagissent de manière autonome selon des paramètres que tu définis. Crée un garde illusoire qui patrouille, un double de toi-même qui marche dans une direction pendant que tu files dans une autre, un monstre qui poursuit tes ennemis. Les illusions suivent des routines simples ou répondent à des déclencheurs : attaquer celui qui entre, fuir si on lui tire dessus, converser de manière basique. Elles semblent vivantes, pensantes, réelles. Seul un examen très attentif ou des sens surnaturels peuvent révéler la supercherie."
      },
      {
        level: 4,
        name: "Permanence",
        bloodCost: 3,
        description: "Tes illusions persistent maintenant sans que tu aies besoin de te concentrer. Crée une scène complète - un bureau luxueux, un mur de briques cachant un passage secret, un cadavre sanglant - et elle reste en place pendant des heures ou des jours, même quand tu es parti. Tu peux créer des repaires illusoires, des preuves de crimes qui n'ont jamais eu lieu, des personnes qui continuent leur vie apparente. Les illusions ne disparaissent que si tu le décides, si quelqu'un les détruit (révélant le vide dessous), ou après plusieurs jours. Tu peux maintenir plusieurs illusions permanentes simultanément."
      },
      {
        level: 5,
        name: "Réalité Illusoire",
        bloodCost: 9,
        description: "La frontière entre illusion et réalité s'efface. Tes créations deviennent horriblement réelles pour ceux qui y croient. Le feu illusoire brûle vraiment, la balle illusoire blesse vraiment, le mur illusoire arrête vraiment - mais seulement pour ceux qui sont convaincus. Si tu crois que le feu te consume, ton corps développe de vraies brûlures psychosomatiques. Si tu crois que l'assassin t'a poignardé, tu saignes. Les dégâts sont réels, potentiellement mortels. Mais si quelqu'un réalise la supercherie, l'illusion perd son pouvoir sur lui. C'est la réalité façonnée par la croyance, le mensonge ultime qui devient vérité."
      }
    ]
  },

  flight: {
    id: "flight",
    name: "Vol",
    description: "Les ailes de pierre battent. Le ciel nocturne t'appartient, défiant la gravité comme seuls les monstres le peuvent.",
    powers: [
      {
        level: 1,
        name: "Lévitation",
        bloodCost: 0,
        description: "Concentre-toi et tes pieds quittent le sol. Tu flottes à quelques mètres de hauteur, te déplaçant lentement dans les airs comme suspendu par des fils invisibles. Parfait pour atteindre un toit, franchir un gouffre, ou impressionner par ta nature surnaturelle. Mais reste à portée du sol : monter trop haut ou perdre ta concentration te ferait chuter brutalement."
      },
      {
        level: 2,
        name: "Planer",
        bloodCost: 0,
        description: "Lance-toi dans le vide et plane comme un rapace. Tu ne peux pas vraiment voler, mais tu contrôles ta chute avec grâce, glissant sur les courants d'air pour parcourir de grandes distances. Saute d'un immeuble et atterris en douceur trois rues plus loin. Poursuis une cible en sautant de toit en toit sans jamais toucher terre. La ville devient un terrain de chasse tridimensionnel."
      },
      {
        level: 3,
        name: "Ailes de Nuit",
        bloodCost: 3,
        description: "Des ailes de chair et de pierre émergent de ton dos dans un craquement horrible. Tu voles maintenant vraiment, battant des ailes pour t'élever dans le ciel nocturne. Vole au-dessus de la ville, patrouille ton territoire vu d'en haut, fond sur tes ennemis comme un démon ailé. Ta silhouette monstrueuse dans le ciel est une vision de cauchemar médiéval."
      },
      {
        level: 4,
        name: "Vol Supersonique",
        bloodCost: 3,
        description: "Tes ailes sont puissantes. Tu files dans le ciel à une vitesse terrifiante, traversant la ville en minutes. Rattrape une voiture en fuite, voyage entre les cités en une seule nuit, ou frappe depuis les airs avec la force d'une météorite. Le vent hurle autour de toi, ta forme un éclair noir dans la nuit."
      },
      {
        level: 5,
        name: "Maître du Ciel",
        bloodCost: 9,
        description: "Le ciel t'obéit. Vole dans n'importe quelle condition : tempête, vent violent, même à travers les flammes. Tu peux emporter des passagers, voler en portant un poids énorme, ou exécuter des manœuvres impossibles. Plonge en piqué à travers une fenêtre, vole à l'envers sous un pont, reste immobile en vol stationnaire. Tu es aussi à l'aise dans les airs qu'au sol, peut-être plus."
      }
    ]
  },

  visceratika: {
    id: "visceratika",
    name: "Visceratika",
    description: "La pierre coule dans tes veines. Ta chair devient marbre, tes os se tordent en armes vivantes. Le corps comme argile.",
    powers: [
      {
        level: 1,
        name: "Peau de Marbre",
        bloodCost: 0,
        description: "Ta peau durcit, devient grise et lisse comme de la pierre polie. Les coups glissent, les lames rebondissent. Tu encaisses des blessures qui tueraient un mortel : couteaux, balles, chutes. Ta chair résonne d'un bruit sourd et creux quand on te frappe. L'armure naturelle du golem, gravée dans ta chair maudite."
      },
      {
        level: 2,
        name: "Griffes d'Obsidienne",
        bloodCost: 1,
        description: "Tes doigts se tordent, les ongles s'allongent en griffes de pierre noire tranchantes comme du verre volcanique. Taille à travers la chair, déchire le métal, lacère les os. Tes mains deviennent des armes mortelles qui ne se brisent jamais, ne s'émoussent jamais. Le sang glisse sur l'obsidienne comme sur du verre."
      },
      {
        level: 3,
        name: "Modelage Corporel",
        bloodCost: 3,
        description: "Modèle ta chair comme de l'argile. Fait pousser des pointes osseuses de ton dos, transforme ton bras en masse de pierre, ouvre un œil supplémentaire sur ta paume. Chaque transformation est douloureuse, un craquement d'os et un déchirement de chair, mais le résultat est fonctionnel. Armes naturelles, armure supplémentaire, outils organiques - ton corps devient ce dont tu as besoin."
      },
      {
        level: 4,
        name: "Forme de Gargouille",
        bloodCost: 3,
        description: "Transforme-toi complètement : corps massif de pierre grise, ailes membraneuses, griffes et crocs, yeux rouges brûlants. Tu deviens une véritable gargouille, statue vivante et terrifiante. Dans cette forme, tu es incroyablement résistant, les balles ricochent, les lames se brisent. Mais tu es aussi lourd, moins agile. La forme ultime du gardien de pierre."
      },
      {
        level: 5,
        name: "Âme de Granit",
        bloodCost: 9,
        description: "Transforme entièrement en statue de pierre à volonté. Dans cet état, tu es totalement immobile mais pratiquement indestructible. Le feu ne te brûle pas, le soleil ne te consume pas, les siècles peuvent passer sans t'affecter. Perché sur un toit, tu sembles une simple gargouille décorative pendant des années si nécessaire. Reviens à la vie quand tu le décides, explosant de ta prison de pierre dans un déluge de gravats. L'immortalité par pétrification."
      }
    ]
  },

  thanatosis: {
    id: "thanatosis",
    name: "Thanatosis",
    description: "Tu es la mort qui marche. La putréfaction est ton royaume, le tombeau ta demeure. La frontière entre cadavre et vampire s'efface.",
    powers: [
      {
        level: 1,
        name: "Masque Cadavérique",
        bloodCost: 0,
        description: "Concentre-toi et ton apparence devient celle d'un cadavre : peau blafarde et froide, yeux vitreux, rigidité mortelle. Tu sembles mort depuis des heures, assez pour tromper même un médecin. Parfait pour échapper aux chasseurs, infiltrer une morgue, ou simplement terroriser. L'odeur douceâtre de la mort commence même à suinter de ta peau."
      },
      {
        level: 2,
        name: "Putréfaction",
        bloodCost: 0,
        description: "Accélère la décomposition de ta propre chair. Ta peau se couvre de plaies suppurantes, tes doigts noircissent, l'odeur devient insupportable. Mais dans cet état de pourriture avancée, tu deviens résistant aux dégâts : les balles traversent de la chair morte qui ne ressent rien, les coups de couteau ne font que détacher des morceaux qui se régénèrent. Tu es déjà mort, comment te tuer à nouveau ?"
      },
      {
        level: 3,
        name: "Cri de la Tombe",
        bloodCost: 3,
        description: "Pousse un hurlement d'outre-tombe, un son d'agonie et de désespoir qui glace le sang. Tous ceux qui l'entendent sont paralysés par une terreur primale, leur instinct hurlant de fuir la chose morte qui marche. Les mortels s'enfuient en panique ou se figent, tétanisés. Même les vampires doivent lutter contre l'envie de fuir cette chose qui incarne leur propre nature monstrueuse."
      },
      {
        level: 4,
        name: "Invasion Parasitaire",
        bloodCost: 3,
        description: "Ton corps libère un nuage d'insectes nécrophages : mouches, asticots, scarabées. Ils grouillent hors de ta bouche, de tes plaies, de tes yeux. Le nuage obscurcit la vision, les insectes mordent et piquent, s'infiltrent sous les vêtements, dans les oreilles, les narines. Tes ennemis sont aveuglés, dégoûtés, paniqués par ce déluge de vermine. Les insectes te retournent ensuite, rampant sous ta peau."
      },
      {
        level: 5,
        name: "Mort Simulée Parfaite",
        bloodCost: 0,
        description: "Entre en état de mort totale. Ton cœur s'arrête complètement, ta chair devient froide comme la glace, la rigidité cadavérique s'installe. Même un examen médical approfondi confirmera ta mort. Aucun signe vital, aucune réaction aux stimuli, même les tests sanguins montrent un cadavre. Tu peux rester dans cet état indéfiniment, conscient mais immobile, attendant le moment parfait pour 'ressusciter'. Le piège ultime, l'infiltration parfaite, ou simplement un sommeil qui ressemble enfin à la paix de la mort."
      }
    ]
  },

  melpominee: {
    id: "melpominee",
    name: "Melpominée",
    description: "Ta voix porte le pouvoir des sirènes. Le chant devient arme, la mélodie devient sortilège. La musique façonne les âmes.",
    powers: [
      {
        level: 1,
        name: "Voix Enchanteresse",
        bloodCost: 0,
        description: "Chante ou parle et ta voix devient irrésistiblement belle, hypnotique. Ceux qui t'écoutent sont captivés, incapables de détourner leur attention. Un garde oublie sa vigilance pour t'écouter, une foule s'arrête fascinée, une cible baisse sa garde. Ta voix porte une suggestion subtile d'amitié et de confiance. Les gens veulent t'écouter, veulent te croire."
      },
      {
        level: 2,
        name: "Cri Destructeur",
        bloodCost: 1,
        description: "Pousse une note aiguë et surpuissante qui fait trembler l'air. Le verre explose en éclats, les tympans saignent, les structures fragiles se fissurent. Brise des fenêtres à distance, fais s'effondrer un lustre, rend tes ennemis sourds et désorientés. Plus tu maintiens la note, plus les dégâts sont importants. Les murs eux-mêmes peuvent céder à ta voix de destruction."
      },
      {
        level: 3,
        name: "Sérénade Ensorcelante",
        bloodCost: 3,
        description: "Chante une mélodie et implante une émotion spécifique dans le cœur de ton audience. Joie euphorique, tristesse écrasante, terreur paralysante, rage aveugle - tu choisis. Une salle entière peut être plongée dans le désespoir, une foule hostile calmée par la mélancolie, des ennemis terrifiés jusqu'à la fuite. L'émotion semble venir de leur propre cœur, pas de manipulation externe. Ta musique façonne leurs âmes."
      },
      {
        level: 4,
        name: "Voix du Maître",
        bloodCost: 3,
        description: "Chante un commandement et ceux qui t'écoutent obéissent. Comme la Domination mais portée par ta voix de sirène, affectant tous ceux à portée simultanément. 'Dormez', et ils s'effondrent. 'Fuyez', et ils courent. 'Oubliez', et leurs souvenirs s'effacent. Plus l'ordre est simple, plus il est efficace. Une foule entière peut être contrôlée par une seule chanson, transformée en marionnettes dansant sur tes notes."
      },
      {
        level: 5,
        name: "Requiem de Sang",
        bloodCost: 9,
        description: "Chante la note de mort, la fréquence qui fait résonner le sang lui-même. Ceux qui l'entendent sentent leur sang vibrer douloureusement dans leurs veines. Les mortels saignent des yeux, des oreilles, effondrent avec des hémorragies internes massives. Les vampires résistent mieux mais souffrent terriblement, leur Vitae s'agitant contre sa prison de chair. Maintiens la note assez longtemps et les cœurs éclatent, les vaisseaux se rompent, le sang jaillit de chaque orifice. La mort par symphonie."
      }
    ]
  },

  daimoinon: {
    id: "daimoinon",
    name: "Daimoinon",
    description: "Les portes de l'Enfer s'entrouvrent à ton appel. Le feu infernal brûle dans tes veines, les démons murmurent tes noms.",
    powers: [
      {
        level: 1,
        name: "Flammes de l'Enfer",
        bloodCost: 1,
        description: "Invoque des flammes noires et glacées qui brûlent d'un froid surnaturel. Ces feux infernaux consument la chair mais laissent étrangement les objets intacts. Allume un feu dans ta paume pour éclairer les ténèbres d'une lueur sinistre, embrase ta main pour une touche brûlante, ou lance une gerbe de flammes noires. Le feu fait mal même aux vampires, mais toi il t'obéit."
      },
      {
        level: 2,
        name: "Peur du Vide",
        bloodCost: 1,
        description: "Ouvre brièvement un aperçu de l'Abîme dans l'esprit de ta cible. Elle voit, l'espace d'un instant horrible, l'immensité du néant infernal, le vide hurlant où les âmes damnées s'effacent. La terreur existentielle la paralyse. Les mortels s'effondrent, catatoniques. Les vampires luttent pour ne pas fuir en Rötschreck, leur Bête hurlant devant ce qui est pire que la mort. L'aperçu de la damnation véritable."
      },
      {
        level: 3,
        name: "Malédiction Infernale",
        bloodCost: 3,
        description: "Prononce une malédiction et la cible devient marquée par les forces infernales. Rien de dramatique immédiatement, mais sa chance tourne : les accidents s'accumulent, les plans échouent, les alliés le trahissent. Les choses vont mal, constamment. La malédiction dure des semaines, un poids d'infortune qui semble venir de nulle part. Comme si le destin lui-même conspirait contre elle."
      },
      {
        level: 4,
        name: "Invoquer le Démon Mineur",
        bloodCost: 3,
        description: "Ouvre un portail et invoque une créature de l'Enfer. Pas un démon majeur, mais quelque chose de petit et vicieux : une ombre griffue, un diablotin ricanant, une masse de tentacules qui suintent. La créature obéit à tes ordres pour la durée de la nuit - espionner, attaquer, terroriser. Elle pue le soufre et disparaît dans un éclair de feu à l'aube. Mais chaque invocation te marque un peu plus, te lie davantage aux Enfers."
      },
      {
        level: 5,
        name: "Avatar Infernal",
        bloodCost: 9,
        description: "Transforme-toi en incarnation diabolique : cornes torsadées, peau écarlate, yeux de braise, ailes de chauve-souris, queue fouettante. Dans cette forme, tu dégages une aura de terreur primale qui fait fuir même les courageux. Ta force augmente, ta résistance devient surhumaine. Les flammes infernales dansent autour de toi sans te brûler. Tu ressembles à ce que tu es vraiment : une créature damnée, un serviteur des Enfers, un démon fait chair. La vision finale de l'horreur."
      }
    ]
  }
};

// Disciplines par clan
export const CLAN_DISCIPLINES = {
  brujah: ["celerity", "potence", "presence"],
  gangrel: ["animalism", "fortitude", "protean"],
  malkavian: ["auspex", "dementation", "obfuscate"],
  nosferatu: ["animalism", "obfuscate", "potence"],
  toreador: ["auspex", "celerity", "presence"],
  tremere: ["auspex", "dominate", "thaumaturgy"],
  ventrue: ["dominate", "fortitude", "presence"],
  lasombra: ["dominate", "obtenebration", "potence"],
  tzimisce: ["animalism", "auspex", "vicissitude"],
  giovanni: ["auspex", "fortitude", "necromancy"],
  setites: ["obfuscate", "presence", "serpentis"],
  assamites: ["celerity", "obfuscate", "quietus"],
  ravnos: ["animalism", "chimerstry", "fortitude"],
  gargoyles: ["flight", "fortitude", "potence", "visceratika"],
  samedi: ["fortitude", "obfuscate", "thanatosis"],
  daughters_of_cacophony: ["fortitude", "melpominee", "presence"],
  baali: ["daimoinon", "obfuscate", "presence"],
  // Caïn - Le Père des Vampires (MJ only) - Accès à TOUTES les disciplines
  cain: [
    "animalism", "auspex", "celerity", "chimerstry", "daimoinon",
    "dementation", "dominate", "flight", "fortitude", "melpominee",
    "necromancy", "obfuscate", "obtenebration", "potence", "presence",
    "protean", "quietus", "serpentis", "thaumaturgy", "thanatosis",
    "vicissitude", "visceratika"
  ]
};

// Niveau maximum de discipline selon la Puissance du Sang
export const MAX_DISCIPLINE_LEVEL = {
  1: 1,  // BP 1: accès au niveau 1
  2: 2,  // BP 2: accès aux niveaux 1-2
  3: 3,  // BP 3: accès aux niveaux 1-3
  4: 4,  // BP 4: accès aux niveaux 1-4
  5: 5   // BP 5: accès aux niveaux 1-5
};

/**
 * Récupère les disciplines disponibles pour un clan et un niveau de BP
 */
export function getAvailableDisciplines(clan, bloodPotency) {
  const clanLower = clan?.toLowerCase();
  const clanDisciplineIds = CLAN_DISCIPLINES[clanLower] || [];
  const maxLevel = MAX_DISCIPLINE_LEVEL[bloodPotency] || 2;

  return clanDisciplineIds.map(disciplineId => {
    const discipline = DISCIPLINES[disciplineId];
    if (!discipline) return null;

    return {
      ...discipline,
      powers: discipline.powers.filter(power => power.level <= maxLevel),
      maxLevel: maxLevel
    };
  }).filter(Boolean);
}

/**
 * Récupère toutes les disciplines (pour affichage admin/référence)
 */
export function getAllDisciplines() {
  return Object.values(DISCIPLINES);
}
